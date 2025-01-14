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

// Number of bookmakers to show per row
const BOOKMAKERS_PER_ROW = {
  sm: 1,
  md: 2,
  lg: 3,
};

const EVBetCard = ({
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
    return `${dayOfWeek}, ${month} ${day}, ${year} @ ${time}`;
  };

  // Split bookmakers into rows of 3 (or less for smaller screens)
  const splitIntoRows = (bookmakers: string[]) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];

    bookmakers.forEach((bookie) => {
      if (currentRow.length === BOOKMAKERS_PER_ROW.lg) {
        rows.push(currentRow);
        currentRow = [];
      }
      currentRow.push(bookie);
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const bookmakerRows = splitIntoRows(processedData.bookmakers);

  return (
    <div className="w-full py-2">
      <div className="rounded-lg overflow-hidden">
        <div
          className="cursor-pointer bg-secondary-bg hover:bg-secondary-bg-hover transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="text-accent-green w-full md:w-20 text-center">
                <p className="text-secondary-text text-sm">Profit</p>+
                {bet.ev_percentage?.toFixed(2)}%
              </div>
              <div className="text-center md:text-left">
                <div className="text-secondary-text text-sm break-words md:whitespace-nowrap">
                  {formatDateTime(bet.commence_time)}
                </div>
                <div className="text-primary-text">{bet.game}</div>
                <div className="text-secondary-text text-sm">{bet.sport}</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8">
              <div className="text-center md:text-right w-full md:w-auto">
                <div className="text-market-purple">{bet.market_type}</div>
                <div className="text-primary-text">
                  {bet.team} {bet.market_point && `(${bet.market_point})`}
                </div>
              </div>
              <div
                className={
                  bet.odds >= 0 ? "text-accent-green" : "text-negative-red"
                }
              >
                {bet.odds >= 0 ? `+${bet.odds}` : bet.odds}
              </div>

              <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
                <Image
                  src={
                    BookmakerLogos[bet.bookmaker?.toLowerCase()] ||
                    "/images/placeholder.png"
                  }
                  alt={bet.bookmaker || "Bookmaker"}
                  width={24}
                  height={24}
                  className="rounded mr-[36.81px] md:mr-0"
                />
                <p className="text-primary-text text-center justify-center">
                  $100
                </p>
                <a
                  href={formatLink(bet.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-button-green hover:bg-button-green-hover transition-all px-4 py-1 rounded text-primary-text flex items-center"
                >
                  BET
                </a>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && processedData && (
          <div className="p-4">
            {bookmakerRows.map((bookmakerRow, rowIndex) => (
              <div key={rowIndex} className={rowIndex > 0 ? "mt-8" : ""}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center mb-4">
                  <div className="text-secondary-text">Selection</div>
                  {bookmakerRow.map((bookie) => (
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
                      key={`${key}-${rowIndex}`}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center mt-3"
                    >
                      <div className="text-primary-text break-words">
                        {`${name} ${
                          point !== "None" && point ? `(${point})` : ""
                        }`}
                      </div>
                      {bookmakerRow.map((bookie) => {
                        const odds = data.odds[bookie]?.american;
                        const link = data.odds[bookie]?.link;
                        return (
                          <a
                            key={bookie}
                            href={formatLink(link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`cursor-pointer transition-all ${
                              odds >= 0
                                ? "text-accent-green hover:text-accent-green-hover"
                                : "text-negative-red hover:text-negative-red-hover"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EVBetCard;
