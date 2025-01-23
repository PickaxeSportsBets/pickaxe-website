import { createClient } from "../supabase/client";

export class FreeBetController{
    private supabase: any
    private COOLDOWN_PERIOD = 24 * 60 * 60 * 1000
    constructor(){
        this.supabase = createClient()
    }
    private async getUserBetData(clerkUserId: string){
        const { data, error } = await this.supabase
            .from('free_bet')
            .select('*')
            .eq('clerk_id', clerkUserId)
            .single();
        if (error) {
            console.error('Error fetching user bet data:', error);
            return null;
        }
        return data;
    }

    async canPlaceBet(clerkUserId: string, subscriptionValid: boolean){
        try{
            if (subscriptionValid){
                return{
                    allowed: false,
                    reason: "Subscribed Users do not get free bets"
                }
            }
        
        const userData = await this.getUserBetData(clerkUserId);
            
        // If no record exists, user can place a bet
        if (!userData) {
            return { allowed: true };
        }

        if (userData.lastRedemptionDate) {
            const timeSinceLastBet = Date.now() - new Date(userData.lastRedemptionDate).getTime();
            const nextDate = new Date(userData.lastRedemptionDate).getTime() + this.COOLDOWN_PERIOD;
            if (timeSinceLastBet < this.COOLDOWN_PERIOD) {
                const hoursRemaining = Math.ceil((this.COOLDOWN_PERIOD - timeSinceLastBet) / (60 * 60 * 1000));
                return {
                    allowed: false,
                    reason: `Please wait ${hoursRemaining} hours before placing another free bet`,
                    nextDate: new Date(nextDate)
                };
            }
        }

        return { allowed: true };
    } catch (error) {
        console.error('Error checking free bet eligibility:', error);
        throw new Error('Unable to verify free bet eligibility');
    }
    }
    async placeFreeBet(clerkUserId: string){
        try{
            const { data, error } = await this.supabase
            .from('free_bet')
            .upsert({ clerk_id: clerkUserId, lastRedemptionDate: new Date() }, { onConflict: 'clerk_id' }).select().single()
            if (error) {
                console.error('Error placing free bet:', error);
                throw new Error('Unable to place free bet');
            }
            const nextDate = new Date(data.lastRedemptionDate).getTime() + this.COOLDOWN_PERIOD;

            return {...data, nextDate: new Date(nextDate)};
        } catch (error) {
            console.error('Error placing free bet:', error);
            throw new Error('Unable to place free bet');
        }

    }

}