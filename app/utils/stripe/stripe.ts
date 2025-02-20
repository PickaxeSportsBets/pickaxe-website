export const createCheckoutSession = async (
  priceId: string,
  user_id: string,
  email: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_id: priceId,
          clerk_user_id: user_id,
          email: email,
        }),
      }
    );

    const data = await response.json();
    window.open(data.url, "_blank");
  } catch (error) {
    console.error("Error:", error);
  }
};
