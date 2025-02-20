import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Create new headers object
  const headers = new Headers();
  
  // Copy all headers from the request
  for (const [key, value] of request.headers.entries()) {
    headers.set(key, value);
  }
  
  return new NextResponse(null, {
    status: 200,
    headers: headers,
  });
}