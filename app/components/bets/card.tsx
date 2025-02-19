"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/app/utils/supabase/client";
import OddsHistoryGraph from "./graph";
import BookmakerLogos from "./utils";
import { LineChart, X, Loader2 } from "lucide-react";
const supabase = createClient();
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

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
  const [isOpen, setIsGraphOpen] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);

  const fetchData = async () => {
    setIsLoadingGraph(true);
    try {
      const { data, error } = await supabase
        .from("ev_graph")
        .select("*")
        .eq("game", bet.game)
        .eq("market_type", bet.market_type)
        .eq("team", bet.team)
        .eq("market_point", bet.market_point)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching historical data:", error);
      } else {
        setHistoricalData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingGraph(false);
    }
  };

  const handleGraphOpen = async () => {
    setIsGraphOpen(true);
    if (!historicalData) {
      await fetchData();
    }
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

  const formatLink = (link: string) => {
    if (!link && bet.bookmaker?.toLowerCase() === "fanatics") {
      return "https://sportsbook.fanatics.com/";
    }
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
    <div className="w-full py-4">
      <div className="rounded-lg overflow-hidden shadow-sm">
        <div
          className="cursor-pointer bg-secondary-bg-light dark:bg-secondary-bg-dark hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Card header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
            {/* Left side content stays the same */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
              <div className="text-accent-green-light dark:text-accent-green-dark w-full md:w-24 text-center">
                <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mb-1">
                  Profit
                </p>
                +{bet.ev_percentage?.toFixed(2)}%
              </div>
              <div className="text-center md:text-left space-y-1">
                <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm break-words md:whitespace-nowrap">
                  {formatDateTime(bet.commence_time)}
                </div>
                <div className="text-primary-text-light dark:text-primary-text-dark font-medium">
                  {bet.game}
                </div>
                <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                  {bet.sport}
                </div>
              </div>
            </div>

            {/* Right side with buttons */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
              <div className="text-center md:text-right w-full md:w-auto space-y-1">
                <div className="text-market-purple-light dark:text-market-purple-dark font-medium">
                  {bet.player ? (
                    <>
                      {bet.player} {" - "}
                      {bet.market_type
                        ?.split("_")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </>
                  ) : (
                    bet.market_type
                      ?.split("_")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
                  )}
                </div>
                <div className="text-primary-text-light dark:text-primary-text-dark">
                  {bet.team} {bet.market_point && `(${bet.market_point})`}
                </div>
              </div>
              <div
                className={`text-lg font-medium ${
                  bet.odds >= 0
                    ? "text-accent-green-light dark:text-accent-green-dark"
                    : "text-negative-red-light dark:text-negative-red-dark"
                }`}
              >
                {bet.odds >= 0 ? `+${bet.odds}` : bet.odds}
              </div>

              <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-6">
                <Image
                  src={
                    BookmakerLogos[bet.bookmaker?.toLowerCase()] ||
                    "/images/placeholder.png"
                  }
                  alt={bet.bookmaker || "Bookmaker"}
                  width={28}
                  height={28}
                  className="rounded mr-[36.81px] md:mr-0"
                />
                <div className="flex items-center gap-2">
                  {/* Graph Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGraphOpen();
                    }}
                    className="bg-tertiary-bg-light dark:bg-tertiary-bg-dark hover:bg-tertiary-bg-hover-light dark:hover:bg-tertiary-bg-hover-dark transition-all px-4 py-2 rounded text-primary-text-light dark:text-primary-text-dark flex items-center font-medium"
                  >
                    <LineChart className="h-5 w-5" />
                  </button>

                  {/* Bet Button */}
                  <Link
                    href={formatLink(bet.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark transition-all px-6 py-2 rounded text-primary-text-light dark:text-primary-text-dark flex items-center font-medium"
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
                  </Link>
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
      {/* Add this just before the final closing div */}
      <OddsHistoryGraph
        data={historicalData}
        isOpen={isOpen}
        onClose={() => {
          setIsGraphOpen(false);
          setHistoricalData(null);
        }}
        isLoading={isLoadingGraph}
      />
    </div>
  );
};

export default EVBetCard;
