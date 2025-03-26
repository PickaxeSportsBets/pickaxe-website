import { NextRequest, NextResponse } from 'next/server';
import  { Stripe } from 'stripe';
import { verifyToken } from '@/app/utils/token/jwtService';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
    try{
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
        const token = authHeader.split('Bearer ')[1];
        interface Payload {
            activePlans: string[];
        }
        const payload = await verifyToken(token) as Payload | null;
        if (!payload) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
        if (!payload.activePlans || payload.activePlans.length === 0) {
            
            return NextResponse.json({error: 'No active plans found'}, {status: 404})
        }
        
        const subscriptionID = payload.activePlans[0]


        const session = await stripe.subscriptions.retrieve(subscriptionID)

        return NextResponse.json(session, {status: 200})

    }
    catch(e) {
        return NextResponse.json({error: e}, {status: 500})
    }
}
