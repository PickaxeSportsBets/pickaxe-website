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

//TODO: FIx expansion, add linking

const BetCard = ({ bet }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const processMarketData = (data: any) => {
    if (!data) return null;

    try {
      const marketData =
        typeof data === "string"
          ? JSON.parse(data.replace(/None/g, "null").replace(/'/g, '"'))
          : data;

      const bookmakers = new Set<string>();
      Object.values(marketData).forEach((market: any) => {
        if (market.odds) {
          Object.keys(market.odds).forEach((bookie) => bookmakers.add(bookie));
        }
      });

      const bookmakersList = Array.from(bookmakers).sort();

      const teamOdds = Object.entries(marketData).map(
        ([key, value]: [string, any]) => ({
          team: key.split("_")[0],
          line: key.split("_")[1],
          odds: value.odds || {},
        })
      );

      return {
        bookmakers: bookmakersList,
        teamOdds: teamOdds,
      };
    } catch (error) {
      console.error("Error processing market data:", error);
      return null;
    }
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
                <button className="bg-button-green hover:bg-opacity-90 px-4 py-1 rounded text-primary-text">
                  BET
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Market Section */}
        {isExpanded && processedData && (
          <div className="bg-primary-bg p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
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

            {processedData.teamOdds.map((team, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-4 text-center mt-3"
              >
                <div className="text-primary-text">
                  {team.team} ({team.line})
                </div>
                {processedData.bookmakers.map((bookie) => {
                  const odds = team.odds[bookie]?.american;
                  return (
                    <div
                      key={bookie}
                      className={
                        odds > 0 ? "text-accent-green" : "text-negative-red"
                      }
                    >
                      {odds ? (odds > 0 ? `+${odds}` : odds) : "-"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetCard;
