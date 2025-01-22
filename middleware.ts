import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "./app/utils/supabase/client";
import { SignJWT } from 'jose';  
import Stripe from 'stripe';
import { jwtVerify } from 'jose';


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const supabase = createClient();

type SubscriptionPlan = {
  name: string;
  id: string;
  status: string;
  periodEnd: string;
};

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}


type CachedSubscriptionData = {
  status: string;
  isValid: boolean;
  current_period_end: string;
  plans: SubscriptionPlan[];
  activePlans: string[]; // List of active subscription IDs
};

type CacheEntry = {
  data: CachedSubscriptionData | null;
  timestamp: number;
};

// Enhanced cache with typed data
const subscriptionCache = new Map<string, CacheEntry>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function generateSubscriptionToken(userId: string, subscription: CachedSubscriptionData) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({
      userId,
      isSubscribed: subscription.isValid,
      subscriptionStatus: subscription.status,
      activePlans: subscription.activePlans,
      iat: now,
      exp: now + 3600, // 1 hour expiration
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
    
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

async function checkSubscription(userId: string): Promise<CachedSubscriptionData> {
  const cached = subscriptionCache.get(userId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data || getDefaultSubscriptionData();
  }

  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", userId)
      .neq("status", "cancelled");

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return getDefaultSubscriptionData();
    }

    // Get all subscription details from Stripe
    const plans: SubscriptionPlan[] = [];
    const activePlans: string[] = [];

    for (const sub of subscriptions) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          sub.subscription_id,
          {
            expand: ['items.data.price.product']
          }
        );
        
        if (stripeSubscription.items.data[0]?.price?.product) {
          const product = stripeSubscription.items.data[0].price.product as Stripe.Product;
          const plan = {
            name: product.name,
            id: sub.subscription_id,
            status: sub.status,
            periodEnd: sub.current_period_end
          };
          
          plans.push(plan);

          if (sub.status === 'active' && new Date(sub.current_period_end) > new Date()) {
            activePlans.push(sub.subscription_id);
          }
        }
      } catch (stripeError) {
        console.error(`Error fetching Stripe subscription ${sub.subscription_id}:`, stripeError);
      }
    }

    // Find the latest active subscription for main status
    const activeSubscriptions = subscriptions.filter(sub => 
      sub.status === 'active' && new Date(sub.current_period_end) > new Date()
    );

    const latestActive = activeSubscriptions.reduce((latest, current) => {
      return !latest || new Date(current.current_period_end) > new Date(latest.current_period_end)
        ? current
        : latest;
    }, null);

    const subscriptionData: CachedSubscriptionData = {
      isValid: !!latestActive,
      status: latestActive ? 'active' : 'inactive',
      current_period_end: latestActive ? latestActive.current_period_end : '',
      plans,
      activePlans
    };

    // Update cache
    subscriptionCache.set(userId, {
      data: subscriptionData,
      timestamp: now
    });

    return subscriptionData;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return getDefaultSubscriptionData();
  }
}

function getDefaultSubscriptionData(): CachedSubscriptionData {
  return {
    isValid: false,
    status: 'no_subscription',
    current_period_end: '',
    plans: [],
    activePlans: []
  };
}

// Cleanup expired cache entries
const cleanupCache = () => {
  const now = Date.now();
  const entries = Array.from(subscriptionCache.entries());
  entries.forEach(([key, value]) => {
    if (now - value.timestamp >= CACHE_DURATION) {
      subscriptionCache.delete(key);
    }
  });
};

setInterval(cleanupCache, CACHE_DURATION);
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request) => {
  if (!isPublicRoute(request)) {
    try {
      const session = await auth.protect();
      if (session?.userId) {
        const subscription = await checkSubscription(session.userId);
        
        const requestHeaders = new Headers(request.headers);
        
        // Check if there's an existing token
        const existingToken = request.headers.get("x-subscription-token");
        let token = null;

        if (existingToken) {
          // Verify existing token
          const payload = await verifyToken(existingToken);
          if (payload) {
            // Token is still valid, reuse it
            token = existingToken;
          }
        }

        // Generate new token if needed
        if (!token && subscription.isValid) {
          token = await generateSubscriptionToken(session.userId, subscription);
        }

        // Set headers
        requestHeaders.set("x-subscription-valid", String(subscription.isValid));
        requestHeaders.set("x-subscription-status", subscription.status);
        requestHeaders.set("x-subscription-plans", JSON.stringify(subscription.plans));
        requestHeaders.set("x-active-plan-ids", JSON.stringify(subscription.activePlans));
        
        if (token) {
          requestHeaders.set("x-subscription-token", token);
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/trpc(.*)",
  ],
};
