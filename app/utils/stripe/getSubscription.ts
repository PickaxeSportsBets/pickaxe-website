import { createClient } from "../supabase/client";
import { useHeaders } from "@/lib/headersContext";
const supabase = createClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GetSubscription(userId: string) {
  const { getAuthHeaders, loading } = useHeaders();

  // If headers are still loading, return null or a loading state
  if (loading) {
    return {
      isLoading: true,
      data: null,
      error: null,
    };
  }

  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`/api/subscription-details/${userId}`, {
      headers,
    });

    const data = await response.json();
    return {
      isLoading: false,
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return {
      isLoading: false,
      data: null,
      error,
    };
  }
}
