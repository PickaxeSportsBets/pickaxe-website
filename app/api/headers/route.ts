import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Return all headers as they are
  const headers = new Headers(request.headers);
  
  return new NextResponse(null, {
    status: 200,
    headers: headers,
  });
}