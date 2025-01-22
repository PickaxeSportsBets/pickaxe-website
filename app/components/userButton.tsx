"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Package, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
type SubscriptionStatus = {
  isSubscribed: boolean;
  subscriptionStatus: string;
  activePlans: string[];
  stripeCustomerId?: string;
};

export const CustomUserButton = () => {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

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

  const handlePortalAccess = async () => {
    try {
      const stripeCustomerId = subscriptionStatus?.stripeCustomerId;

      if (!stripeCustomerId) {
        console.log("No Stripe customer ID found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: stripeCustomerId,
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

  if (!isLoaded || !user?.id) return null;

  const subscriptionText = (() => {
    if (!subscriptionStatus) return "Loading...";
    if (subscriptionStatus.isSubscribed) return "Active Subscriber";
    return "Free Plan";
  })();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-secondary-bg-light dark:border-secondary-bg-dark bg-white dark:bg-secondary-bg-dark px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <Image
            alt={user.primaryEmailAddress?.emailAddress!}
            src={user.imageUrl}
            width={32}
            height={32}
            className="rounded-full"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="mt-2 min-w-[240px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-secondary-bg-dark shadow-lg"
          align="end"
          sideOffset={5}
        >
          <div className="flex flex-col gap-1 p-2">
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-primary-text-light dark:text-primary-text-dark">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark">
                {subscriptionText}
              </p>
            </div>

            <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <DropdownMenu.Item asChild>
              <button
                onClick={() => openUserProfile()}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/subscribe"
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Package className="h-4 w-4" />
                Pricing Plans
              </Link>
            </DropdownMenu.Item>

            {subscriptionStatus?.isSubscribed && (
              <DropdownMenu.Item asChild>
                <button
                  onClick={handlePortalAccess}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Manage Subscriptions
                </button>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <DropdownMenu.Item asChild>
              <button
                onClick={() => signOut(() => router.push("/sign-in"))}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
