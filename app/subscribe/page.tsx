// "use client";
// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, Zap, Mail } from "lucide-react";
// import Header from "../components/header";
// import { useUser } from "@clerk/nextjs";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout,
// } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// const PricingPage = () => {
//   const { user } = useUser();
//   const [clientSecret, setClientSecret] = useState<string | null>(null);

//   const emailFeatures = [
//     "Daily handpicked arbitrage opportunities",
//     "EV betting opportunities",
//     "Weekly performance summary",
//     "Direct email delivery",
//   ];
//   const emailPrices = [
//     {
//       price: "$50",
//       period: "month",
//       priceId: "price_1QiMqJIs3FmBtaEC2FHprbKG",
//     },
//     { price: "$25", period: "week", priceId: "price_1QiMqJIs3FmBtaECNFFaiPIR" },
//     { price: "$10", period: "day", priceId: "price_1QiMqJIs3FmBtaECfoHWZm3h" },
//   ];

//   const softwareFeatures = [
//     "Full platform access",
//     "Unlimited opportunities",
//     "Real-time alerts",
//     "Advanced filtering",
//     "Personalized dashboard",
//   ];

//   const handleSubscribe = async (priceId: string) => {
//     if (!user) {
//       return;
//     }

//     try {
//       const response = await fetch("/api/checkOutSession", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           priceId,
//           userId: user.id,
//           userEmail: user.emailAddresses[0].emailAddress,
//         }),
//       });

//       const data = await response.json();

//       if (data.error) {
//         console.error("Error:", data.error);
//         return;
//       }

//       setClientSecret(data.clientSecret);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
//         {clientSecret ? (
//           <div className="max-w-3xl mx-auto px-4">
//             <EmbeddedCheckoutProvider
//               stripe={stripePromise}
//               options={{ clientSecret }}
//             >
//               <EmbeddedCheckout />
//             </EmbeddedCheckoutProvider>
//           </div>
//         ) : (
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text mb-4">
//                 Choose Your Plan
//               </h1>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Select the plan that best fits your betting strategy
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Email Picks Plan */}
//               <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
//                 <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20" />
//                 <CardHeader className="relative">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Mail className="w-5 h-5 text-purple-500" />
//                     <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
//                       Email Plan
//                     </span>
//                   </div>
//                   <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
//                     Email Picks Plan
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="relative">
//                   <div className="space-y-4 mb-8">
//                     {emailFeatures.map((feature, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
//                         <span className="text-gray-700 dark:text-gray-300">
//                           {feature}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="space-y-4">
//                     {emailPrices.map((plan) => (
//                       <div
//                         key={plan.period}
//                         className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm"
//                       >
//                         <div className="flex items-end gap-2 mb-3">
//                           <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                             {plan.price}
//                           </span>
//                           <span className="text-gray-600 dark:text-gray-400">
//                             /{plan.period}
//                           </span>
//                         </div>
//                         <Button
//                           onClick={() => handleSubscribe(plan.priceId)}
//                           className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
//                         >
//                           Subscribe {plan.period}ly
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Software Plan */}
//               <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20" />
//                 <CardHeader className="relative">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Zap className="w-5 h-5 text-indigo-500" />
//                     <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                       Software Plan
//                     </span>
//                   </div>
//                   <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
//                     Software Plan (Standard)
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="relative">
//                   <div className="space-y-4 mb-8">
//                     {softwareFeatures.map((feature, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
//                         <span className="text-gray-700 dark:text-gray-300">
//                           {feature}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm">
//                     <div className="flex items-end gap-2 mb-3">
//                       <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                         $75
//                       </span>
//                       <span className="text-gray-600 dark:text-gray-400">
//                         /month
//                       </span>
//                     </div>
//                     <Button
//                       onClick={() =>
//                         handleSubscribe("price_1QiMqKIs3FmBtaECt8QXCPjE")
//                       }
//                       className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//                     >
//                       Subscribe
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PricingPage;
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "../components/utilities/header";
import { CheckCircle, Zap, Mail } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createCheckoutSession } from "../utils/stripe/stripe";
import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getUserSubscription } from "../utils/stripe/getSubscription";
import { CreditCard } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const PricingPage = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const headers = new Headers();

        const currentHeaders = await fetch("/api/headers").then(
          (res) => res.headers
        );
        for (const [key, value] of currentHeaders.entries()) {
          headers.set(key, value);
        }

        headers.set("Content-Type", "application/json");

        const response = await fetch(`${API_URL}/protected`, {
          method: "GET",
          headers: headers,
          credentials: "include", // Important for cookies and auth headers
        });

        if (response.ok) {
          const data = await response.json();

          setSubscriptionStatus({
            isSubscribed: data.isSubscribed,
            subscriptionStatus: data.subscriptionStatus,
            activePlans: data.activePlans || [],
            stripeCustomerId: user?.publicMetadata
              ?.stripe_customer_id as string,
          });
        } else {
          console.error(
            "Error response:",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        setSubscriptionStatus({
          isSubscribed: false,
          subscriptionStatus: "inactive",
          activePlans: [],
        });
      }
    };

    if (user?.id) {
      checkSubscriptionStatus();
    }
  }, [user?.id]);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout_sessions", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  const emailFeatures = [
    "Daily handpicked arbitrage opportunities",
    "EV betting opportunities",
    "Weekly performance summary",
    "Direct email delivery",
  ];
  const emailPrices = [
    {
      price: "$50",
      period: "month",
      priceId: "price_1QiMqJIs3FmBtaEC2FHprbKG",
    },
    { price: "$25", period: "week", priceId: "price_1QiMqJIs3FmBtaECNFFaiPIR" },
    { price: "$10", period: "day", priceId: "price_1QiMqJIs3FmBtaECfoHWZm3h" },
  ];
  const softwareFeatures = [
    "Full platform access",
    "Unlimited opportunities",
    "Real-time alerts",
    "Advanced filtering",
    "Personalized dashboard",
  ];
  const softwarePrices = [
    {
      priceId: "price_1QiMqKIs3FmBtaECt8QXCPjE",
      price: "$75",
      period: "month",
    },
  ];

  const handlePortalAccess = async () => {
    try {
      // Use the stripe_customer_id from Clerk metadata
      const stripeCustomerId = user?.publicMetadata?.stripe_customer_id;
      const stripeCustomerIDV2 = subscription?.subscriptions[0]?.customer_id;

      if (!stripeCustomerId) {
        console.log("No Stripe customer ID found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: stripeCustomerIDV2,
            return_url: window.location.origin,
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        }
      );

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      return;
    }
    await createCheckoutSession(
      priceId,
      user.id,
      user.emailAddresses[0].emailAddress
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {subscription?.isValid && (
            <div className="mb-8 rounded-lg bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/50 p-2">
                    <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Active Subscription
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You're currently subscribed. Review the plans below if
                      you'd like to make changes to your subscription.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handlePortalAccess}
                  variant="outline"
                  className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text mb-4">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Select the plan that best fits your betting strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Picks Plan */}
            <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Email Plan
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Email Picks Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-8">
                  {emailFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {emailPrices.map((plan) => (
                    <div
                      key={plan.period}
                      className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm"
                    >
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          /{plan.period}
                        </span>
                      </div>
                      <Button
                        onClick={
                          subscription?.isValid
                            ? handlePortalAccess
                            : () => handleSubscribe(plan.priceId)
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Subscribe
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Software Plan */}
            <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Software Plan
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Software Plan (Standard)
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-8">
                  {softwareFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                {softwarePrices.map((plan) => (
                  <div
                    key={plan.period}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm"
                  >
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    </div>
                    <Button
                      onClick={
                        subscription?.isValid
                          ? handlePortalAccess
                          : () => handleSubscribe(plan.priceId)
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      Subscribe
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
