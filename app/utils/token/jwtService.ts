import { SignJWT, jwtVerify } from 'jose';
import { SubscriptionData } from './subscription';
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Token durations in seconds
const TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours
const REFRESH_THRESHOLD = 60 * 60; // 1 hour

export async function generateToken(userId: string, subscription: SubscriptionData) {
  try {
    const now = Math.floor(Date.now() / 1000);
    return await new SignJWT({
      userId,
      isSubscribed: subscription.isValid,
      subscriptionStatus: subscription.status,
      activePlans: subscription.activePlans,
      iat: now,
      exp: now + TOKEN_EXPIRY,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function shouldRefreshToken(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token);
    if (!payload) return true;

    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);
    
    // Return true if token will expire within REFRESH_THRESHOLD
    return exp - now < REFRESH_THRESHOLD;
  } catch {
    return true;
  }
}