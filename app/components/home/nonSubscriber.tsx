import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "../utilities/loadingSkeleton";
export const NoSubscriptionOverlay = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary-bg-light/80 dark:bg-primary-bg-dark/80 backdrop-blur-md z-20 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4 border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
              Unlock Premium Betting Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
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

export const EmailSubscriptionOverlay = () => {
  return (
    <div className="mb-8">
      <Card className="border border-indigo-100 dark:border-indigo-900 bg-white/90 dark:bg-gray-800/90">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-50 dark:bg-purple-900/50 p-3">
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Email Plan Active
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                You currently have access to our daily email picks
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2 mt-1">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
                  <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
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

// Example usage component that decides which overlay to show
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
  console.log(subscriptionStatus);
  if (!subscriptionStatus && loading) {
    return <LoadingSkeleton />;
  }
  if (subscriptionStatus && !subscriptionStatus.isSubscribed) {
    return (
      <>
        <NoSubscriptionOverlay />
        {/* Fix this */}
        <div className="filter blur-md pointer-events-none">{children}</div>
      </>
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

export default SubscriptionCheck;
