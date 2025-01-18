import { cookies } from "next/headers";
import { createClient } from "../supabase/client";
const supabase = createClient();

export const getUserSubscription = async (user_id: string) => {
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", user_id);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) return null;

    // Check if any subscription is valid
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
    console.error("Error getting subscription:", error);
    return null;
  }
};
