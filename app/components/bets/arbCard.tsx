"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon
import betmgm from "@/public/images/betmgm-logo.png";
import betRivers from "@/public/images/betrivers-logo.png";
import caesars from "@/public/images/caesars-logo.png";
import dk from "@/public/images/draftkings-logo.png";
import espn from "@/public/images/espnbet-logo.png";
import fanduel from "@/public/images/fanduel-logo.png";
import hardrockBet from "@/public/images/hardrockbet-logo.png";
import pinnacle from "@/public/images/pinnacle-logo.png";
import underDog from "@/public/images/underdog-logo.png";

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

//Add expansion
const ArbBetCard = ({
  bet,
  userState = "NY",
}: {
  bet: any;
  userState?: string;
}) => {
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

  const getMarketDescription = () => {
    const baseDesc =
      bet.prop_description ||
      MarketTypeMapping[bet.market_type] ||
      bet.market_type;

    // If it's a total points market and has a market point, include the total
    if (
      (bet.market_type.includes("total") ||
        bet.market_type.includes("Total")) &&
      bet.market_point
    ) {
      return `${baseDesc} (${bet.market_point})`;
    }

    return baseDesc;
  };

  const formatProfitPercentage = (percentage: number) => {
    if (percentage === 0) return "No Hold";
    return `+${percentage.toFixed(2)}%`;
  };

  const formatTeamName = (name: string, point?: string) => {
    if (name.includes("(")) return name;
    return point ? `${name} (${point})` : name;
  };

  return (
    <div className="w-full py-4">
      <div className="bg-secondary-bg rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-accent-green w-24 items-center text-center">
                <p className="text-secondary-text text-sm">Profit</p>
                {formatProfitPercentage(Number(bet.profit_percentage))}
              </div>
              <div>
                <div className="text-secondary-text text-sm whitespace-nowrap">
                  {formatDateTime(bet.commence_time)}
                </div>
                <div className="text-primary-text">{bet.game}</div>
                <div className="text-secondary-text text-sm">{bet.sport}</div>
              </div>
            </div>
            <div className="text-market-purple text-center font-medium">
              {getMarketDescription()}
            </div>

            <div className="flex flex-col space-y-4">
              {/* Market Description */}

              {/* Bet 1 */}
              <div className="flex items-center justify-end space-x-8">
                <div className="text-right">
                  <div className="text-primary-text">
                    {formatTeamName(bet.team1_name, bet.team1_point)}
                  </div>
                  <div
                    className={
                      bet.team1_odds >= 0
                        ? "text-accent-green"
                        : "text-negative-red"
                    }
                  >
                    {bet.team1_odds >= 0
                      ? `+${bet.team1_odds}`
                      : bet.team1_odds}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
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
                  <span className="text-primary-text">
                    {bet.team1_stake.toFixed(1)}%
                  </span>
                  <a
                    href={formatLink(bet.team1_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button-green hover:bg-opacity-90 px-4 py-1 rounded text-primary-text flex items-center"
                  >
                    BET
                  </a>
                </div>
              </div>

              {/* Bet 2 */}
              <div className="flex items-center justify-end space-x-8">
                <div className="text-right">
                  <div className="text-primary-text">
                    {formatTeamName(bet.team2_name, bet.team2_point)}
                  </div>
                  <div
                    className={
                      bet.team2_odds >= 0
                        ? "text-accent-green"
                        : "text-negative-red"
                    }
                  >
                    {bet.team2_odds >= 0
                      ? `+${bet.team2_odds}`
                      : bet.team2_odds}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
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
                  <span className="text-primary-text">
                    {bet.team2_stake.toFixed(1)}%
                  </span>
                  <a
                    href={formatLink(bet.team2_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button-green hover:bg-opacity-90 px-4 py-1 rounded text-primary-text flex items-center"
                  >
                    BET
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbBetCard;
