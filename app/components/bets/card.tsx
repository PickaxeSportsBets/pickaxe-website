"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
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

//TODO: Link for each bet in the expanded section, and GET current user state and show it (do in index)
const BetCard = ({
  bet,
  userState = "NY",
}: {
  bet: any;
  userState?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const processMarketData = (data: any) => {
    if (!data) return null;

    try {
      // Get unique bookmakers
      const bookmakers = Array.from(
        new Set([
          ...Object.keys(data.over.odds || {}),
          ...Object.keys(data.under.odds || {}),
        ])
      ).sort();

      return {
        bookmakers,
        over: data.over,
        under: data.under,
      };
    } catch (error) {
      console.error("Error processing market data:", error);
      return null;
    }
  };

  const formatLink = (link: string) => {
    if (!link) return "#";
    return link.replace(/{state}/g, userState.toLowerCase());
  };

  const processedData = processMarketData(bet.market_data);

  const gameDate = new Date(bet.commence_time).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const gameTime = new Date(bet.commence_time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDateTime = `${gameDate}T${gameTime}:00Z`;

  return (
    <div className="w-full py-4">
      <div className="bg-secondary-bg rounded-lg overflow-hidden">
        <div
          className="cursor-pointer hover:bg-opacity-90 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <div className="text-accent-green w-20">
                +{bet.ev_percentage?.toFixed(2)}%
              </div>
              <div>
                <div className="text-secondary-text text-sm">
                  {formattedDateTime}
                </div>
                <div className="text-primary-text">{bet.game}</div>
                <div className="text-secondary-text text-sm">{bet.sport}</div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-market-purple">{bet.market_type}</div>
                <div className="text-primary-text">
                  {bet.team} ({bet.market_point})
                </div>
                <div
                  className={
                    bet.odds > 0 ? "text-accent-green" : "text-negative-red"
                  }
                >
                  {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Image
                  src={
                    BookmakerLogos[bet.bookmaker?.toLowerCase()] ||
                    "/images/placeholder.png"
                  }
                  alt={bet.bookmaker || "Bookmaker"}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="text-primary-text">$100</span>
                <a
                  href={formatLink(bet.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-button-green hover:bg-opacity-90 px-4 py-1 rounded text-primary-text"
                >
                  BET
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Market Section */}
        {isExpanded && processedData && (
          <div className="bg-primary-bg p-4">
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div className="text-secondary-text">Selection</div>
              {processedData.bookmakers.map((bookie) => (
                <div
                  key={bookie}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <Image
                    src={
                      BookmakerLogos[bookie.toLowerCase()] ||
                      "/images/placeholder.png"
                    }
                    alt={bookie}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <div className="text-secondary-text capitalize text-sm">
                    {bookie}
                  </div>
                </div>
              ))}
            </div>

            {/* OVER odds */}
            <div className="grid grid-cols-4 gap-4 text-center mt-3">
              <div className="text-primary-text">OVER</div>
              {processedData.bookmakers.map((bookie) => {
                const odds = processedData.over.odds[bookie]?.american;
                const link = processedData.over.odds[bookie]?.link;
                return (
                  <a
                    key={bookie}
                    href={formatLink(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`cursor-pointer hover:opacity-80 ${
                      odds > 0 ? "text-accent-green" : "text-negative-red"
                    }`}
                  >
                    {odds ? (odds > 0 ? `+${odds}` : odds) : "-"}
                  </a>
                );
              })}
            </div>

            {/* UNDER odds */}
            <div className="grid grid-cols-4 gap-4 text-center mt-3">
              <div className="text-primary-text">UNDER</div>
              {processedData.bookmakers.map((bookie) => {
                const odds = processedData.under.odds[bookie]?.american;
                const link = processedData.under.odds[bookie]?.link;
                return (
                  <a
                    key={bookie}
                    href={formatLink(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`cursor-pointer hover:opacity-80 ${
                      odds > 0 ? "text-accent-green" : "text-negative-red"
                    }`}
                  >
                    {odds ? (odds > 0 ? `+${odds}` : odds) : "-"}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetCard;
