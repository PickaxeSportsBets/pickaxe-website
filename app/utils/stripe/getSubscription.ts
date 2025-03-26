import { createClient } from "../supabase/client";
import { useHeaders } from "@/app/hooks/use-headers";
const supabase = createClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getUserSubscription = async (user_id: string) => {
  const { getAuthHeaders } = useHeaders();
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${API_URL}/api/get-subscriptions/${user_id}`, {
      headers,
      method: "GET",
    });
    const data = await response.json();
    const subscriptions = data.subscriptions;
    

    if (!subscriptions || subscriptions.length === 0) {
      return {
        subscriptions: [],
        isValid: true, // Free user is considered valid
        plan: "free",
      };
    }

    // Check if any subscription is valid
    const validSubscription = subscriptions.find((subscription: any) => {
      return (
        subscription.status === "active" &&
        new Date(subscription.current_period_end) > new Date()
      );
    });

    return {
      subscriptions: validSubscription ? [validSubscription] : [],
      isValid: !!validSubscription,
      plan: validSubscription ? validSubscription.plan : "free",
    };
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
};
