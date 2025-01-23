import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkSubscription } from "./app/utils/token/subscription";
import { generateToken, verifyToken, shouldRefreshToken } from "./app/utils/token/jwtService";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)",
  "/api(.*)"]);

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }

  try {
    const session = await auth.protect();
    if (!session?.userId) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(request.headers);
    const existingToken = request.headers.get("x-subscription-token");
    let token = null;

    // Check existing token and whether it needs refresh
    if (existingToken) {
      const needsRefresh = await shouldRefreshToken(existingToken);
      if (!needsRefresh) {
        token = existingToken;
      }
    }

    // Get subscription data and generate new token
    const subscription = await checkSubscription(session.userId);
    if (!token) {
      token = await generateToken(session.userId, subscription);
      
      // Debug logging
      console.log('=== New JWT Token Generated ===');
      console.log('Token:', token);
      console.log('=============================');
    }

    // Set headers
    requestHeaders.set("x-subscription-valid", String(subscription.isValid));
    requestHeaders.set("x-subscription-status", subscription.status);
    requestHeaders.set("x-subscription-plans", JSON.stringify(subscription.plans));
    requestHeaders.set("x-active-plan-ids", JSON.stringify(subscription.activePlans));
    
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/trpc(.*)",
    "/api/((?!auth).*)",

  ],
};