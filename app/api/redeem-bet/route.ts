import { NextRequest, NextResponse } from 'next/server';
import { FreeBetController } from '@/app/utils/freeBet/canFreeBet';
import { verifyToken } from '@/app/utils/token/jwtService';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No bearer token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const freeBetController = new FreeBetController()

        // Check if this is a redeem request
        const { redeem } = await request.json().catch(() => ({ redeem: false }));

        if (redeem) {
            // Verify eligibility before redeeming
            const status = await freeBetController.checkStatus(String(payload.userId), Boolean(payload.isSubscribed));
            if (!status.allowed) {
                return NextResponse.json(status, { status: 403 });
            }
            // Redeem the bet
            const placedBet = await freeBetController.redeemFreeBet(String(payload.userId));
            return NextResponse.json(placedBet, { status: 200 });
        } else {
            // Just check status
            const status = await freeBetController.checkStatus(String(payload.userId), Boolean(payload.isSubscribed));
            return NextResponse.json(status, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}