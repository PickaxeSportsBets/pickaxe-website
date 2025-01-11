"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import betmgm from "@/public/images/betmgm-logo.png";
import betRivers from "@/public/images/betrivers-logo.png";
import caesars from "@/public/images/caesars-logo.png";
import dk from "@/public/images/draftkings-logo.png";
import espn from "@/public/images/espnbet-logo.png";
import fanduel from "@/public/images/fanduel-logo.png";
import hardrockBet from "@/public/images/hardrockbet-logo.png";
import pinnacle from "@/public/images/pinnacle-logo.png";
import underDog from "@/public/images/underdog-logo.png";

const BOOKMAKERS_PER_PAGE = 3;

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

const EVBetCard = ({
  bet,
  userState = "NY",
}: {
  bet: any;
  userState?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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

  const formatLink = (link: string) => {
    if (!link) return "#";
    return link.replace(/{state}/g, userState.toLowerCase());
  };

  const processedData = processMarketData(bet.market_data);
  if (!processedData) return null;

  const totalPages = Math.ceil(
    processedData.bookmakers.length / BOOKMAKERS_PER_PAGE
  );
  const startIdx = currentPage * BOOKMAKERS_PER_PAGE;
  const visibleBookmakers = processedData.bookmakers.slice(
    startIdx,
    startIdx + BOOKMAKERS_PER_PAGE
  );

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

  return (
    <div className="w-full py-4">
      <div className="bg-secondary-bg rounded-lg overflow-hidden">
        <div
          className="cursor-pointer hover:bg-opacity-90 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <div className="text-accent-green w-20 text-center">
                <p className="text-secondary-text text-sm">Profit</p>+
                {bet.ev_percentage?.toFixed(2)}%
              </div>
              <div>
                <div className="text-secondary-text text-sm whitespace-nowrap">
                  {formatDateTime(bet.commence_time)}
                </div>
                <div className="text-primary-text">{bet.game}</div>
                <div className="text-secondary-text text-sm">{bet.sport}</div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-market-purple">{bet.market_type}</div>
                <div className="text-primary-text">
                  {bet.team} {bet.market_point && `(${bet.market_point})`}
                </div>
                <div
                  className={
                    bet.odds >= 0 ? "text-accent-green" : "text-negative-red"
                  }
                >
                  {bet.odds >= 0 ? `+${bet.odds}` : bet.odds}
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
                  className="bg-button-green hover:bg-opacity-90 px-4 py-1 rounded text-primary-text flex items-center"
                >
                  BET
                </a>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && processedData && (
          <div className="bg-primary-bg p-4">
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div className="text-secondary-text">Selection</div>
              {visibleBookmakers.map((bookie) => (
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

            {processedData.entries.map(([key, data]: [string, any]) => {
              const [name, point] = key.split("_");
              return (
                <div
                  key={key}
                  className="grid grid-cols-4 gap-4 text-center mt-3"
                >
                  <div className="text-primary-text">
                    {name} {point !== "None" && point && `(${point})`}
                  </div>
                  {visibleBookmakers.map((bookie) => {
                    const odds = data.odds[bookie]?.american;
                    const link = data.odds[bookie]?.link;
                    return (
                      <a
                        key={bookie}
                        href={formatLink(link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`cursor-pointer hover:opacity-80 ${
                          odds >= 0 ? "text-accent-green" : "text-negative-red"
                        }`}
                      >
                        {odds ? (odds >= 0 ? `+${odds}` : odds) : "-"}
                      </a>
                    );
                  })}
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentPage === 0}
                  className="p-1 rounded hover:bg-secondary-bg disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-secondary-text">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage((prev) =>
                      Math.min(totalPages - 1, prev + 1)
                    );
                  }}
                  disabled={currentPage === totalPages - 1}
                  className="p-1 rounded hover:bg-secondary-bg disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EVBetCard;
