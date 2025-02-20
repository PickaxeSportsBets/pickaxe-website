"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Gift, AlertTriangle, Calculator } from "lucide-react";
import CalculatorModal from "../bets/modal";
import BookmakerLogos from "../bets/utils";
const MarketTypeMapping: { [key: string]: string } = {
  h2h: "Head to Head",
  h2h_q1: "Quarter 1 Head to Head",
  h2h_q2: "Quarter 2 Head to Head",
  h2h_q3: "Quarter 3 Head to Head",
  h2h_q4: "Quarter 4 Head to Head",
  h2h_h1: "Half 1 Head to Head",
  h2h_h2: "Half 2 Head to Head",
  spreads: "Spread",
  spreads_q1: "Quarter 1 Spread",
  spreads_q2: "Quarter 2 Spread",
  spreads_q3: "Quarter 3 Spread",
  spreads_q4: "Quarter 4 Spread",
  spreads_h1: "Half 1 Spread",
  spreads_h2: "Half 2 Spread",
  totals: "Total Points",
  totals_q1: "Quarter 1 Total Points",
  totals_q2: "Quarter 2 Total Points",
  totals_q3: "Quarter 3 Total Points",
  totals_q4: "Quarter 4 Total Points",
  totals_h1: "Half 1 Total Points",
  totals_h2: "Half 2 Total Points",
  alternate_spreads: "Alternate Spread",
  alternate_spreads_q1: "Quarter 1 Alternate Spread",
  alternate_totals: "Alternate Total",
  alternate_totals_q1: "Quarter 1 Alternate Total",
  player_prop: "Player Prop",
};

const FreeBetComponent = ({
  subscriptionStatus,
  userState = "NY",
}: {
  subscriptionStatus: any;
  userState?: string;
}) => {
  const [freeBetStatus, setFreeBetStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showBetDialog, setShowBetDialog] = useState(false);
  const [freeBet, setFreeBet] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const fetchFreeBetStatus = async () => {
    try {
      const headers = new Headers();
      const currentHeaders = await fetch("/api/headers").then(
        (res) => res.headers
      );
      for (const [key, value] of currentHeaders.entries()) {
        headers.set(key, value);
      }
      headers.set("Content-Type", "application/json");

      const response = await fetch("/api/redeem-bet", {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify({ redeem: false }),
      });
      const data = await response.json();
      setFreeBetStatus(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching free bet status:", error);
      setLoading(false);
    }
  };

  const redeemFreeBet = async () => {
    try {
      // Check for available bets first
      const { data, error } = await supabase
        .from("arbitrage")
        .select("*")
        .gt("profit_percentage", 0)
        .eq("opportunity_type", "Arbitrage")
        .limit(10);

      if (error) throw error;
      if (!data || data.length === 0) {
        toast({
          title: "No Bets Available",
          description:
            "There are no arbitrage opportunities available right now. Please try again later.",
          className: "bg-secondary-bg-light dark:bg-secondary-bg-dark",
        });
        return;
      }

      const headers = new Headers();
      const currentHeaders = await fetch("/api/headers").then(
        (res) => res.headers
      );
      for (const [key, value] of currentHeaders.entries()) {
        headers.set(key, value);
      }
      headers.set("Content-Type", "application/json");

      const response = await fetch("/api/redeem-bet", {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify({ redeem: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to redeem bet");
      }

      const redemptionData = await response.json();
      setFreeBetStatus(redemptionData);

      // Set the random bet from our pre-checked data
      const randomIndex = Math.floor(Math.random() * data.length);
      setFreeBet(data[randomIndex]);
      setShowBetDialog(true);
    } catch (error) {
      console.error("Error redeeming free bet:", error);
      toast({
        title: "Error",
        description: "Failed to redeem free bet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowBet = async () => {
    if (freeBetStatus?.allowed) {
      await redeemFreeBet();
    } else {
      toast({
        title: "Not Available",
        description:
          freeBetStatus?.reason || "Please wait for your next free bet",
        className: "bg-secondary-bg-light dark:bg-secondary-bg-dark",
      });
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

  const calculateResults = () => {
    if (!freeBet) {
      return {
        bet1Amount: 0,
        bet2Amount: 0,
        guaranteedProfit: 0,
        bet1Odds: "",
        bet2Odds: "",
      };
    }

    const stake1 = freeBet.team1_stake;
    const stake2 = freeBet.team2_stake;
    const odds1 = freeBet.team1_odds;
    const odds2 = freeBet.team2_odds;

    const totalStake = 100;
    const stake1Amount = totalStake * (stake1 / 100);
    const stake2Amount = totalStake * (stake2 / 100);
    const profitPercentage = freeBet.profit_percentage;
    const guaranteedProfit = totalStake * (profitPercentage / 100);

    return {
      bet1Amount: stake1Amount,
      bet2Amount: stake2Amount,
      guaranteedProfit: guaranteedProfit,
      bet1Odds: odds1 >= 0 ? `+${odds1}` : `${odds1}`,
      bet2Odds: odds2 >= 0 ? `+${odds2}` : `${odds2}`,
    };
  };
  const getMarketDescription = (freeBet: any) => {
    const baseDesc =
      freeBet.prop_description ||
      MarketTypeMapping[freeBet.market_type] ||
      freeBet.market_type;

    if (
      (freeBet.market_type.includes("total") ||
        freeBet.market_type.includes("Total")) &&
      freeBet.market_point
    ) {
      return `${baseDesc} (${freeBet.market_point})`;
    }

    return baseDesc;
  };
  const formatTeamName = (name: string, point?: string) => {
    if (name.includes("(")) return name;
    return point ? `${name} (${point})` : name;
  };

  const getBookmakerLogo = (bookmaker: string) => {
    if (!bookmaker) return "/images/placeholder.png";
    const key = bookmaker.toLowerCase().replace(/[^a-z]/g, "");
    return BookmakerLogos[key] || "/images/placeholder.png";
  };

  if (loading || subscriptionStatus?.isSubscribed) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-button-green-light dark:bg-button-green-dark">
                <Gift className="h-5 w-5 text-accent-green-light dark:text-accent-green-dark" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark">
                  Daily Free Arbitrage Bet
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  {freeBetStatus?.allowed
                    ? "Available Now - Click to reveal today's opportunity!"
                    : `Next bet available in: ${timeRemaining}`}
                </p>
              </div>
            </div>
            <Button
              onClick={handleShowBet}
              disabled={!freeBetStatus?.allowed}
              className="bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark text-primary-text-light dark:text-primary-text-dark border-none"
            >
              {freeBetStatus?.allowed ? "Reveal Free Bet" : "Locked"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showBetDialog} onOpenChange={setShowBetDialog}>
        <DialogContent className="bg-primary-bg-light dark:bg-primary-bg-dark">
          <DialogHeader>
            <DialogTitle className="text-primary-text-light dark:text-primary-text-dark">
              Your Free Arbitrage Bet
            </DialogTitle>
            <DialogDescription className="text-secondary-text-light dark:text-secondary-text-dark">
              Today&apos;s arbitrage opportunity
            </DialogDescription>
          </DialogHeader>

          {freeBet && (
            <div className="space-y-4">
              <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-profit-green-light dark:text-profit-green-dark">
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                      Profit
                    </p>
                    +{freeBet.profit_percentage}%
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark rounded-full transition-colors"
                    aria-label="Open calculator"
                  >
                    <Calculator className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-primary-text-light dark:text-primary-text-dark text-lg font-medium mb-2">
                      {freeBet.game}
                    </div>
                    <div className="text-secondary-text-light dark:text-secondary-text-dark text-md font-medium mb-2">
                      {getMarketDescription(freeBet)}
                    </div>

                    <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                      {freeBet.sport}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-primary-text-light dark:text-primary-text-dark">
                          {formatTeamName(
                            freeBet.team1_name,
                            freeBet.team1_point
                          )}
                        </div>
                        <div
                          className={
                            freeBet.team1_odds >= 0
                              ? "text-accent-green-light dark:text-accent-green-dark"
                              : "text-negative-red-light dark:text-negative-red-dark"
                          }
                        >
                          {freeBet.team1_odds >= 0
                            ? `+${freeBet.team1_odds}`
                            : freeBet.team1_odds}
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() =>
                          window.open(
                            freeBet.team1_link.replace("{state}", userState),
                            "_blank"
                          )
                        }
                      >
                        <Image
                          src={getBookmakerLogo(freeBet.team1_book)}
                          alt={freeBet.team1_book}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="text-primary-text-light dark:text-primary-text-dark">
                          {freeBet.team1_stake}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-primary-text-light dark:text-primary-text-dark">
                          {formatTeamName(
                            freeBet.team2_name,
                            freeBet.team2_point
                          )}
                        </div>
                        <div
                          className={
                            freeBet.team2_odds >= 0
                              ? "text-accent-green-light dark:text-accent-green-dark"
                              : "text-negative-red-light dark:text-negative-red-dark"
                          }
                        >
                          {freeBet.team2_odds >= 0
                            ? `+${freeBet.team2_odds}`
                            : freeBet.team2_odds}
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() =>
                          window.open(
                            freeBet.team2_link.replace("{state}", userState),
                            "_blank"
                          )
                        }
                      >
                        <Image
                          src={getBookmakerLogo(freeBet.team2_book)}
                          alt={freeBet.team2_book}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="text-primary-text-light dark:text-primary-text-dark">
                          {freeBet.team2_stake}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-tertiary-bg-light dark:bg-tertiary-bg-dark border-accent-green-light dark:border-accent-green-dark">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  Betting lines may shift rapidly. This opportunity may no
                  longer be available or profitable. Please verify all odds
                  before placing any bets. Once you exit out, you will not see
                  this bet again. Always gamble responsibly.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {freeBet && (
        <CalculatorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          result={calculateResults()}
          type="bonus"
          gameTitle={freeBet.game}
        />
      )}
    </div>
  );
};

export default FreeBetComponent;
