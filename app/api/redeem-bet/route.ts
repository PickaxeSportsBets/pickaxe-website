import { NextRequest, NextResponse } from 'next/server';
import { FreeBetController } from '@/app/utils/freeBet/canFreeBet';
// import { auth } from '@clerk/nextjs/dist/types/server';
import { verifyToken } from '@/app/utils/token/jwtService';
import { useUser } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
    try{
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No bearer token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        const payload = await verifyToken(token)
        if (!payload){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const freeBetController = new FreeBetController()
        const inPeriod = await freeBetController.canPlaceBet(String(payload.userId), Boolean(payload.isSubscribed))
        if (!inPeriod.allowed){
            return NextResponse.json(inPeriod, {status: 200})
        }
        const placedBet = await freeBetController.placeFreeBet(String(payload.userId))
        return NextResponse.json(placedBet, {status: 200})
    } catch (error){
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}