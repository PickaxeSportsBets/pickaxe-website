"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Calculator } from "lucide-react";
import BookmakerLogos from "./utils";
import CalculatorModal from "./modal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

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

const ArbBetCard = ({
  bet,
  userState = "NY",
}: {
  bet: any;
  userState?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
    return `${dayOfWeek}, ${month} ${day}, ${year} at ${time}`;
  };

  const formatLink = (link: string) => {
    if (!link && bet.bookmaker?.toLowerCase() === "fanatics") {
      return "https://sportsbook.fanatics.com/";
    }
    if (!link) return "#";
    return link.replace(/{state}/g, userState.toLowerCase());
  };

  const calculateResults = () => {
    const stake1 = bet.team1_stake;
    const stake2 = bet.team2_stake;
    const odds1 = bet.team1_odds;
    const odds2 = bet.team2_odds;

    const totalStake = 100;
    const stake1Amount = totalStake * (stake1 / 100);
    const stake2Amount = totalStake * (stake2 / 100);
    const profitPercentage = bet.profit_percentage;
    const guaranteedProfit = totalStake * (profitPercentage / 100);

    return {
      bet1Amount: stake1Amount,
      bet2Amount: stake2Amount,
      guaranteedProfit: guaranteedProfit,
      bet1Odds: odds1 >= 0 ? `+${odds1}` : `${odds1}`,
      bet2Odds: odds2 >= 0 ? `+${odds2}` : `${odds2}`,
    };
  };

  const getMarketDescription = () => {
    const baseDesc =
      bet.prop_description ||
      MarketTypeMapping[bet.market_type] ||
      bet.market_type;

    if (
      (bet.market_type.includes("total") ||
        bet.market_type.includes("Total")) &&
      bet.market_point
    ) {
      return `${baseDesc} (${bet.market_point})`;
    }

    return baseDesc;
  };

  const formatProfitPercentage = (
    percentage: number,
    hold_percentage: number
  ) => {
    if (percentage === 0) {
      return `-${hold_percentage.toFixed(2)}%`;
    }
    return `+${percentage.toFixed(2)}%`;
  };

  const formatTeamName = (name: string, point?: string) => {
    if (name.includes("(")) return name;
    return point ? `${name} (${point})` : name;
  };
  const processMarketData = (data: any) => {
    if (!data) return null;

    try {
      const marketData = typeof data === "string" ? JSON.parse(data) : data;
      const marketEntries = Object.entries(marketData);

      const allBookmakers = new Set<string>();
      marketEntries.forEach(([_, value]: [string, any]) => {
        if (value.odds) {
          Object.keys(value.odds).forEach((bookie) =>
            allBookmakers.add(bookie)
          );
        }
      });

      return {
        entries: marketEntries,
        bookmakers: Array.from(allBookmakers).sort(),
      };
    } catch (error) {
      console.error("Error processing market data:", error);
      return null;
    }
  };

  const processedData = processMarketData(bet.market_data);
  if (!processedData) return null;

  return (
    <div className="w-full py-4">
      <div
        className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg overflow-hidden hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark transition-all cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="py-4 md:px-8 px-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto px-4 md:px-0">
              <div className="flex items-center gap-2">
                {Number(bet.profit_percentage) > 0 ? (
                  <div className="text-accent-green-light dark:text-accent-green-dark w-24 text-left">
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                      Profit
                    </p>
                    {formatProfitPercentage(
                      Number(bet.profit_percentage),
                      Number(bet.hold_percentage)
                    )}
                  </div>
                ) : (
                  <div className="text-negative-red-light dark:text-negative-red-dark w-24 text-left">
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                      Profit
                    </p>
                    {formatProfitPercentage(
                      Number(bet.profit_percentage),
                      Number(bet.hold_percentage)
                    )}
                  </div>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark rounded-full transition-colors"
                  aria-label="Open calculator"
                >
                  <Calculator className="w-8 h-8 text-secondary-text-light dark:text-secondary-text-dark" />
                </button>
              </div>
              <div>
                <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm break-words md:whitespace-nowrap">
                  {formatDateTime(bet.commence_time)}
                </div>
                <div className="text-primary-text-light dark:text-primary-text-dark">
                  {bet.game}
                </div>
                <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                  {bet.sport}
                </div>
              </div>
            </div>

            <div className="text-market-purple-light dark:text-market-purple-dark font-medium px-4 md:px-0 text-left md:text-center w-full md:w-auto">
              {getMarketDescription()}
            </div>

            <div className="flex flex-col space-y-4 w-full md:w-auto">
              {/* Bet 1 */}
              <div className="flex items-center justify-between md:justify-end px-4 md:px-0 md:space-x-8">
                <div className="text-left md:text-right">
                  <div className="text-primary-text-light dark:text-primary-text-dark">
                    {formatTeamName(bet.team1_name, bet.team1_point)}
                  </div>
                  <div
                    className={
                      bet.team1_odds >= 0
                        ? "text-accent-green-light dark:text-accent-green-dark"
                        : "text-negative-red-light dark:text-negative-red-dark"
                    }
                  >
                    {bet.team1_odds >= 0
                      ? `+${bet.team1_odds}`
                      : bet.team1_odds}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-start space-x-4">
                  <Image
                    src={
                      BookmakerLogos[bet.team1_book.toLowerCase()] ||
                      "/images/placeholder.png"
                    }
                    alt={bet.team1_book}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    {bet.team1_stake.toFixed(1)}%
                  </span>
                  <a
                    href={formatLink(bet.team1_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark px-4 py-1 rounded text-primary-text-light dark:text-primary-text-dark flex items-center transition-colors"
                  >
                    BET
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 text-primary-text-light dark:text-primary-text-dark"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Bet 2 */}
              <div className="flex items-center justify-between md:justify-end px-4 md:px-0 md:space-x-8">
                <div className="text-left md:text-right">
                  <div className="text-primary-text-light dark:text-primary-text-dark">
                    {formatTeamName(bet.team2_name, bet.team2_point)}
                  </div>
                  <div
                    className={
                      bet.team2_odds >= 0
                        ? "text-accent-green-light dark:text-accent-green-dark"
                        : "text-negative-red-light dark:text-negative-red-dark"
                    }
                  >
                    {bet.team2_odds >= 0
                      ? `+${bet.team2_odds}`
                      : bet.team2_odds}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-start space-x-4">
                  <Image
                    src={
                      BookmakerLogos[bet.team2_book.toLowerCase()] ||
                      "/images/placeholder.png"
                    }
                    alt={bet.team2_book}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    {bet.team2_stake.toFixed(1)}%
                  </span>
                  <a
                    href={formatLink(bet.team2_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark px-4 py-1 rounded text-primary-text-light dark:text-primary-text-dark flex items-center transition-colors"
                  >
                    BET
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 text-primary-text-light dark:text-primary-text-dark"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Desktop expanded view - unchanged */}
        {isExpanded && processedData && (
          <div className="hidden md:block p-6 bg-secondary-bg-light dark:bg-secondary-bg-dark border-t border-gray-200 dark:border-gray-700">
            <div className="">
              <div className="min-w-max">
                <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] text-center h-16">
                  <div className="text-secondary-text-light dark:text-secondary-text-dark font-medium flex items-center justify-center">
                    Selection
                  </div>
                  {processedData.bookmakers.map((bookie) => (
                    <div
                      key={bookie}
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={
                          BookmakerLogos[bookie.toLowerCase()] ||
                          "/images/placeholder.png"
                        }
                        alt={bookie}
                        width={28}
                        height={28}
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {processedData.entries.map(([key, data]: [string, any]) => {
                    const [name, point] = key.split("_");
                    const validOdds = processedData.bookmakers
                      .map((bookie) => data.odds[bookie]?.american)
                      .filter((odds) => odds !== undefined)
                      .map((odds) => parseInt(odds));
                    const highestOdds = Math.max(...validOdds);

                    return (
                      <div
                        key={key}
                        className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] text-center h-12"
                      >
                        <div className="text-primary-text-light dark:text-primary-text-dark break-words font-medium flex items-center justify-center px-4">
                          {`${name} ${
                            point !== "None" && point ? `(${point})` : ""
                          }`}
                        </div>
                        {processedData.bookmakers.map((bookie) => {
                          const odds = data.odds[bookie]?.american;
                          const link = data.odds[bookie]?.link;
                          const isHighest = parseInt(odds) === highestOdds;

                          return (
                            <a
                              key={bookie}
                              href={formatLink(link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`cursor-pointer transition-all font-medium flex items-center justify-center
                                ${
                                  isHighest
                                    ? "bg-button-green-light dark:bg-green-900/20"
                                    : ""
                                }
                                ${
                                  odds >= 0
                                    ? "text-accent-green-light dark:text-accent-green-dark hover:text-accent-green-hover-light dark:hover:text-accent-green-hover-dark"
                                    : "text-negative-red-light dark:text-negative-red-dark hover:text-negative-red-hover-light dark:hover:text-negative-red-hover-dark"
                                }`}
                            >
                              {odds ? (odds >= 0 ? `+${odds}` : odds) : "-"}
                            </a>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Modal */}
        {isExpanded && processedData && (
          <AlertDialog open={isExpanded && window.innerWidth < 768}>
            <AlertDialogContent className="w-screen h-[90vh] max-w-[90%] m-0 rounded-t-xl p-0 bg-background">
              <AlertDialogHeader className="relative px-4 py-3 border-b">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-accent/10 rounded-full transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <AlertDialogTitle className="text-base font-semibold pr-12">
                  {bet.game}
                </AlertDialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Odds Comparison
                </p>
              </AlertDialogHeader>

              <div className="h-[calc(90vh-4.5rem)] overflow-y-auto">
                {processedData.entries.map(([key, data]: any) => {
                  const [name, point] = key.split("_");
                  const validOdds = processedData.bookmakers
                    .map((bookie) => data.odds[bookie]?.american)
                    .filter((odds): odds is string => odds !== undefined)
                    .map((odds) => parseInt(odds));
                  const highestOdds = Math.max(...validOdds);

                  return (
                    <div key={key} className="border-b last:border-b-0">
                      <div className="px-4 py-3 bg-muted/30">
                        <div className="font-medium">
                          {`${name} ${
                            point !== "None" && point ? `(${point})` : ""
                          }`}
                        </div>
                      </div>
                      <div className="divide-y">
                        {processedData.bookmakers.map((bookie) => {
                          const odds = data.odds[bookie]?.american;
                          const link = data.odds[bookie]?.link;
                          const isHighest =
                            odds && parseInt(odds) === highestOdds;

                          return (
                            <a
                              key={bookie}
                              href={formatLink(link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-between p-4 hover:bg-accent/10 transition-colors
                          ${
                            isHighest ? "bg-green-100 dark:bg-green-900/20" : ""
                          }`}
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    BookmakerLogos[bookie.toLowerCase()] ||
                                    "/images/placeholder.png"
                                  }
                                  alt={bookie}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {bookie}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-medium
                            ${
                              odds
                                ? parseInt(odds) >= 0
                                  ? "text-accent-green-light dark:text-accent-green-dark"
                                  : "text-negative-red-light dark:text-negative-red-dark"
                                : "text-muted-foreground"
                            }`}
                              >
                                {odds
                                  ? parseInt(odds) >= 0
                                    ? `+${odds}`
                                    : odds
                                  : "-"}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <CalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={calculateResults()}
        type="bonus"
        gameTitle={bet.game}
      />
    </div>
  );
};

export default ArbBetCard;
export { BookmakerLogos };
