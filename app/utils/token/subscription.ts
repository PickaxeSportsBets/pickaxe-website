import { createClient } from '../supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient();

export type SubscriptionPlan = {
  name: string;
  id: string;
  status: string;
  periodEnd: string;
};

export type SubscriptionData = {
  isValid: boolean;
  status: string;
  current_period_end: string;
  plans: SubscriptionPlan[];
  activePlans: string[];
};

export async function checkSubscription(userId: string): Promise<SubscriptionData> {
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", userId)
      .neq("status", "cancelled");

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return getDefaultSubscriptionData();
    }

    const plans: SubscriptionPlan[] = [];
    const activePlans: string[] = [];

    for (const sub of subscriptions) {
      const stripeSubscription = await stripe.subscriptions.retrieve(sub.subscription_id, {
        expand: ['items.data.price.product']
      });
      
      if (stripeSubscription.items.data[0]?.price?.product) {
        const product = stripeSubscription.items.data[0].price.product as Stripe.Product;
        const plan = {
          name: product.name,
          id: sub.subscription_id,
          status: sub.status,
          periodEnd: sub.current_period_end
        };
        
        plans.push(plan);

        if (sub.status === 'active' && new Date(sub.current_period_end) > new Date()) {
          activePlans.push(sub.subscription_id);
        }
      }
    }

    const activeSubscriptions = subscriptions.filter(sub => 
      sub.status === 'active' && new Date(sub.current_period_end) > new Date()
    );

    const latestActive = activeSubscriptions.reduce((latest, current) => {
      return !latest || new Date(current.current_period_end) > new Date(latest.current_period_end)
        ? current
        : latest;
    }, null);

    const subscriptionData: SubscriptionData = {
      isValid: !!latestActive,
      status: latestActive ? 'active' : 'inactive',
      current_period_end: latestActive ? latestActive.current_period_end : '',
      plans,
      activePlans
    };

    return subscriptionData;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return getDefaultSubscriptionData();
  }
}

function getDefaultSubscriptionData(): SubscriptionData {
  return {
    isValid: false,
    status: 'no_subscription',
    current_period_end: '',
    plans: [],
    activePlans: []
  };
}