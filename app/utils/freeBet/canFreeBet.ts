import { createClient } from "../supabase/client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class FreeBetController {
    private COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;
    private headers: HeadersInit;

    constructor(headers: HeadersInit) {
        this.headers = headers;
    }

    private async getUserBetData(clerkUserId: string) {
        const response = await fetch(
            `${API_URL}/api/get-free-bet/${clerkUserId}`,
            {
                method: "GET",
                headers: this.headers,
            },
        );
        const data = await response.json();
        return data;
    }

    async checkStatus(clerkUserId: string, subscriptionValid: boolean) {
        try {
            if (subscriptionValid) {
                return {
                    allowed: false,
                    reason: "Subscribed Users do not get free bets",
                };
            }

            const userData = await this.getUserBetData(clerkUserId);

            // If no record exists or error response, user can place a bet
            if (userData.code === 404 || !userData.data) {
                return { allowed: true };
            }

            // Access lastRedemptionDate from the nested data object
            if (userData.data.lastRedemptionDate) {
                const timeSinceLastBet = Date.now() -
                    new Date(userData.data.lastRedemptionDate).getTime();
                const nextDate =
                    new Date(userData.data.lastRedemptionDate).getTime() +
                    this.COOLDOWN_PERIOD;
                if (timeSinceLastBet < this.COOLDOWN_PERIOD) {
                    const hoursRemaining = Math.ceil(
                        (this.COOLDOWN_PERIOD - timeSinceLastBet) /
                            (60 * 60 * 1000),
                    );
                    return {
                        allowed: false,
                        reason:
                            `Please wait ${hoursRemaining} hours before placing another free bet`,
                        nextDate: new Date(nextDate),
                    };
                }
            }

            return { allowed: true };
        } catch (error) {
            console.error("Error checking free bet eligibility:", error);
            throw new Error("Unable to verify free bet eligibility");
        }
    }

    async redeemFreeBet(clerkUserId: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/upsert-free-bet/${clerkUserId}`,
                {
                    method: "POST",
                    headers: this.headers,
                },
            );
            const data = await response.json();
            if (data.error) {
                console.error("Error placing free bet:", data.error);
                throw new Error("Unable to place free bet");
            }

            const nextDate = new Date(data.lastRedemptionDate).getTime() +
                this.COOLDOWN_PERIOD;
            return { ...data, nextDate: new Date(nextDate) };
        } catch (error) {
            console.error("Error placing free bet:", error);
            throw new Error("Unable to place free bet");
        }
    }
}
