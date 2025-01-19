import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "./app/utils/supabase/client";
import { isValid } from "date-fns";
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const supabase = createClient();

// Cache for subscription status
const subscriptionCache = new Map<
  string,
  {
    data: {
      status: string;
      isValid: boolean;
      current_period_end: string;
    } | null;
    timestamp: number;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function checkSubscription(userId: string) {
  const cached = subscriptionCache.get(userId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", userId);

    if (error) throw error;

    let subscriptionData = null;
    if (!subscriptions || subscriptions.length === 0) return { isValid: false };

    const validSubscription = subscriptions.find((subscription) => {
      return (
        subscription.status === "active" &&
        new Date(subscription.current_period_end) > new Date()
      );
    });

    return {
      subscriptions,
      isValid: !!validSubscription,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return null;
  }
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
    const session = await auth.protect();
    if (session?.userId) {
      const subscription = await checkSubscription(session.userId);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set(
        "x-subscription-valid",
        String(!!subscription?.isValid)
      );

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
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
