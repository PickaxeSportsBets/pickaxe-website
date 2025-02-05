import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkSubscription } from "./app/utils/token/subscription";
import { generateToken, shouldRefreshToken } from "./app/utils/token/jwtService";

// Only sign in, sign up, and landing pages are public.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/landing(.*)",
  "/api/subscription-details(.*)",
  "/api/redeem-bet(.*)",
]);

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request) => {
  const url = new URL(request.url);

  // If this is a public route, just continue.
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  try {
    // Ensure the user is authenticated.
    const session = await auth.protect();
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }

    if (url.pathname.startsWith("/api") || url.pathname === "/") {
      const requestHeaders = new Headers(request.headers);

      const authHeader = request.headers.get("Authorization");
      const existingToken = authHeader?.replace(/^Bearer\s/, "");
      let token: string | null = null;

      // Check if token exists and if it needs refreshing.
      if (existingToken) {
        const needsRefresh = await shouldRefreshToken(existingToken);
        if (!needsRefresh) {
          token = existingToken;
        }
      }

      // Always fetch subscription data (or cache it as needed).
      const subscription = await checkSubscription(session.userId);

      // Generate a new token if there’s no valid existing one.
      if (!token) {
        token = await generateToken(session.userId, subscription);
      }

      // Set the JWT token and subscription details as headers.
      requestHeaders.set("Authorization", `Bearer ${token}`);
      requestHeaders.set("x-subscription-valid", String(subscription.isValid));
      requestHeaders.set("x-subscription-status", subscription.status);
      requestHeaders.set("x-subscription-plans", JSON.stringify(subscription.plans));
      requestHeaders.set("x-active-plan-ids", JSON.stringify(subscription.activePlans));

      // Forward the request with the updated headers.
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // For other routes, just pass through.
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error (or missing session) redirect to the landing page.
    return NextResponse.redirect(new URL("/landing", request.url));
  }
});

// This matcher ensures the middleware runs on all routes you wish to protect,
// including API routes (except static files and _next routes).
export const config = {
  matcher: [
    // Matches any path except:
    //   - NextJS internals (_next)
    //   - Files with extensions (e.g., .css, .js, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Also run for tRPC and our API (except if they are under /api/auth).
    "/trpc(.*)",
    "/api/((?!auth).*)",
  ],
};
