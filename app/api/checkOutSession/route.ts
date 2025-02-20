import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type SuccessResponse = {
  clientSecret?: string;
  status?: string;
  customer_email?: string;
};

type ErrorResponse = {
  error: {
    message: string;
    statusCode: number;
  };
};

// Main handler function
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.priceId || !body.userId || !body.userEmail || !body) {
      return Response.json(
        { error: { message: "Missing required parameters", statusCode: 400 } },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: `${req.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (err) {
    const error = err as Stripe.errors.StripeError;
    return Response.json(
      {
        error: { message: error.message, statusCode: error.statusCode || 500 },
      },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json(
        { error: { message: "Missing session_id parameter", statusCode: 400 } },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return Response.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    });
  } catch (err) {
    const error = err as Stripe.errors.StripeError;
    return Response.json(
      {
        error: { message: error.message, statusCode: error.statusCode || 500 },
      },
      { status: error.statusCode || 500 }
    );
  }
}

// Handle unsupported methods
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST",
      "Access-Control-Allow-Methods": "GET, POST",
    },
  });
}
