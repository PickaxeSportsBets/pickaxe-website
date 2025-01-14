"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Calculator } from "lucide-react";
import betmgm from "@/public/images/betmgm-logo.png";
import betRivers from "@/public/images/betrivers-logo.png";
import caesars from "@/public/images/caesars-logo.png";
import dk from "@/public/images/draftkings-logo.png";
import espn from "@/public/images/espnbet-logo.png";
import fanduel from "@/public/images/fanduel-logo.png";
import hardrockBet from "@/public/images/hardrockbet-logo.png";
import pinnacle from "@/public/images/pinnacle-logo.png";
import underDog from "@/public/images/underdog-logo.png";
import CalculatorModal from "./modal";
const BookmakerLogos: { [key: string]: any } = {
  betmgm: betmgm,
  betrivers: betRivers,
  caesars: caesars,
  draftkings: dk,
  espnbet: espn,
  fanduel: fanduel,
  hardrock: hardrockBet,
  pinnacle: pinnacle,
  underdog: underDog,
};

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

  return (
    <div className="w-full py-4">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg overflow-hidden">
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
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
