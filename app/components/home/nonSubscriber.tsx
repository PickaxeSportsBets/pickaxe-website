import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "../utilities/loadingSkeleton";

export const NoSubscriptionOverlay = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary-bg-light/80 dark:bg-primary-bg-dark/80 backdrop-blur-md z-20 flex items-start pt-8 justify-center">
        <Card className="max-w-xl w-full mx-4 border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90">
          <CardHeader className="text-center py-4">
            <div className="mx-auto w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
              Unlock Premium Betting Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Subscribe to access our complete collection of betting
              opportunities, real-time alerts, and advanced analytics.
            </p>
            <div className="space-y-4">
              <Link href="/subscribe" passHref>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SubscriptionCheck = ({
  subscriptionStatus,
  loading,
  children,
}: {
  subscriptionStatus: {
    isSubscribed: boolean;
    subscriptionName?: string;
  };
  loading: boolean;
  children: React.ReactNode;
}) => {
  if (!subscriptionStatus && loading) {
    return <LoadingSkeleton />;
  }

  if (subscriptionStatus && !subscriptionStatus.isSubscribed) {
    return (
      <div className="relative">
        <NoSubscriptionOverlay />
        <div
          className="relative"
          style={{
            opacity: "0.4",
            filter: "blur(8px)",
            WebkitFilter: "blur(8px)",
            pointerEvents: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            touchAction: "none",
            cursor: "default",
          }}
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  if (
    subscriptionStatus &&
    subscriptionStatus.subscriptionName?.toLowerCase().includes("email")
  ) {
    return (
      <>
        <EmailSubscriptionOverlay />
      </>
    );
  }

  return <>{children}</>;
};

export const EmailSubscriptionOverlay = () => {
  return (
    <div className="mb-6">
      <Card className="border border-indigo-100 dark:border-indigo-900 bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-50 dark:bg-purple-900/50 p-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Email Plan Active
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                You currently have access to our daily email picks
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="mt-2 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Upgrade to Software Access
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Get unlimited access to all betting opportunities, real-time
                  alerts, and our advanced analytics platform.
                </p>
                <Link href="/subscribe" passHref>
                  <Button className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCheck;
