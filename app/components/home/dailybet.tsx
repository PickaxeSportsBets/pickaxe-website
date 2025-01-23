"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Gift, AlertTriangle } from "lucide-react";

const FreeBetComponent = ({
  subscriptionStatus,
}: {
  subscriptionStatus: any;
}) => {
  const [freeBetStatus, setFreeBetStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showBetDialog, setShowBetDialog] = useState(false);
  const [freeBet, setFreeBet] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const fetchFreeBetStatus = async () => {
    try {
      const response = await fetch("/api/free-bet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setFreeBetStatus(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching free bet status:", error);
      setLoading(false);
    }
  };

  const fetchRandomArbitrageBet = async () => {
    try {
      const { data, error } = await supabase
        .from("arbitrage")
        .select("*")
        .gt("profit_percentage", 0)
        .limit(10);

      if (error) throw error;
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setFreeBet(data[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching arbitrage bet:", error);
    }
  };

  useEffect(() => {
    if (!subscriptionStatus?.isSubscribed) {
      fetchFreeBetStatus();
    }
  }, [subscriptionStatus]);

  useEffect(() => {
    if (freeBetStatus?.nextDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const nextDate = new Date(freeBetStatus.nextDate).getTime();
        const distance = nextDate - now;

        if (distance < 0) {
          setTimeRemaining("Available Now!");
          clearInterval(interval);
        } else {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [freeBetStatus]);

  const handleShowBet = async () => {
    if (freeBetStatus?.allowed) {
      await fetchRandomArbitrageBet();
      setShowBetDialog(true);
      await fetchFreeBetStatus(); // Refresh status after showing bet
    } else {
      toast({
        title: "Not Available",
        description:
          freeBetStatus?.reason || "Please wait for your next free bet",
        className: "bg-secondary-bg-light dark:bg-secondary-bg-dark",
      });
    }
  };

  if (loading || subscriptionStatus?.isSubscribed) return null;

  return (
    <div className="mb-6">
      <Card className="p-6 bg-secondary-bg-light dark:bg-secondary-bg-dark border border-tertiary-bg-light dark:border-tertiary-bg-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gift className="h-6 w-6 text-accent-green-light dark:text-accent-green-dark" />
            <div>
              <h3 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark">
                Your Daily Free Bet
              </h3>
              <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                {freeBetStatus?.allowed
                  ? "Available Now!"
                  : `Next bet available in: ${timeRemaining}`}
              </p>
            </div>
          </div>
          <Button
            onClick={handleShowBet}
            disabled={!freeBetStatus?.allowed}
            className="bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark text-primary-text-light dark:text-primary-text-dark"
          >
            View Free Bet
          </Button>
        </div>
      </Card>

      <Dialog open={showBetDialog} onOpenChange={setShowBetDialog}>
        <DialogContent className="bg-primary-bg-light dark:bg-primary-bg-dark">
          <DialogHeader>
            <DialogTitle className="text-primary-text-light dark:text-primary-text-dark">
              Your Free Arbitrage Bet
            </DialogTitle>
            <DialogDescription className="text-secondary-text-light dark:text-secondary-text-dark">
              Here's your daily arbitrage opportunity
            </DialogDescription>
          </DialogHeader>

          {freeBet && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary-bg-light dark:bg-secondary-bg-dark">
                <h4 className="font-semibold text-primary-text-light dark:text-primary-text-dark mb-2">
                  {freeBet.game}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                    <span className="font-medium">Book 1:</span> {freeBet.book1}{" "}
                    ({freeBet.team1_name} @ {freeBet.odds1})
                  </p>
                  <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                    <span className="font-medium">Book 2:</span> {freeBet.book2}{" "}
                    ({freeBet.team2_name} @ {freeBet.odds2})
                  </p>
                  <p className="text-sm font-medium text-profit-green-light dark:text-profit-green-dark">
                    Potential Profit: {freeBet.profit_percentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              <Alert className="bg-tertiary-bg-light dark:bg-tertiary-bg-dark border-accent-green-light dark:border-accent-green-dark">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  Disclaimer: Betting lines may shift rapidly. This opportunity
                  may no longer be available or profitable. Please verify all
                  odds before placing any bets. Always gamble responsibly.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreeBetComponent;
