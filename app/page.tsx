"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EVBetCard from "./components/bets/card";
import NavButtons from "./components/navButtons";
import ArbBetCard from "./components/bets/arbCard";
import { createClient } from "./utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import PromosCalculator from "./components/promos/promo";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

enum Page {
  EV = "EV",
  ARB = "ARB",
  PROMOS = "PROMOS",
}

const LoadingSkeleton = () => {
  return Array(10)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="w-full py-4">
        <div className="rounded-lg overflow-hidden">
          <div className="bg-secondary-bg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left side */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="w-full md:w-20 text-center">
                  <Skeleton className="h-4 w-16 mx-auto mb-1" />
                  <Skeleton className="h-5 w-20 mx-auto" />
                </div>
                <div className="text-center md:text-left">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="text-center md:text-right w-full md:w-auto">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
};

export default function Home() {
  const [bets, setBets] = useState<any>();
  const [arbBets, setArbBets] = useState<any>();
  const [userState, setUserState] = useState("NY");
  const [currPage, setCurrPage] = useState<Page>(Page.EV);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [evLastUpdated, setEvLastUpdated] = useState("");
  const [arbLastUpdated, setArbLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchUserState = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.region_code) {
          console.log("User State:", data.region_code);
          setUserState(data.region_code);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    const fetchBets = async () => {
      try {
        setLoading(true);
        const { data: evBets } = await supabase
          .from("plus_ev")
          .select()
          .order("timestamp", { ascending: false });
        const { data: arbBetsData } = await supabase
          .from("arbitrage")
          .select()
          .order("timestamp", { ascending: false });

        if (evBets) {
          setEvLastUpdated(evBets[0]?.timestamp);
          const sortedBets = [...evBets].sort(
            (a, b) => (b.ev_percentage || 0) - (a.ev_percentage || 0)
          );
          setBets(sortedBets);
        }

        if (arbBetsData) {
          setArbLastUpdated(arbBetsData[0]?.timestamp);
          const sortedArbBets = [...arbBetsData].sort(
            (a, b) => (b.profit_percentage || 0) - (a.profit_percentage || 0)
          );
          setArbBets(sortedArbBets);
        }
      } catch (error) {
        console.error("Error fetching bets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserState();
    fetchBets();
  }, []);

  const getCurrentPageItems = (items: any[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      return items;
    }
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = (items: any[]) =>
    Math.ceil((items?.length || 0) / itemsPerPage) || 1;

  const renderPagination = (items: any[]) => {
    const total = totalPages(items);
    return (
      <div className="flex justify-center space-x-4 mt-8 mb-4">
        <button
          onClick={() => setCurrentPageNumber((curr) => Math.max(1, curr - 1))}
          disabled={currentPageNumber === 1}
          className="px-4 py-2 rounded bg-secondary-bg text-primary-text disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-primary-text">
          Page {currentPageNumber} of {total}
        </span>
        <button
          onClick={() =>
            setCurrentPageNumber((curr) => Math.min(total, curr + 1))
          }
          disabled={currentPageNumber === total}
          className="px-4 py-2 rounded bg-secondary-bg text-primary-text disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currPage) {
      case Page.EV:
        if (loading) {
          return <LoadingSkeleton />;
        }
        if ((!bets || bets.length === 0) && !loading) {
          return <div className="text-secondary-text">No bets found.</div>;
        }
        return (
          <>
            {getCurrentPageItems(bets).map((bet: any) => (
              <EVBetCard key={bet.id} bet={bet} userState={userState} />
            ))}
            {renderPagination(bets)}
          </>
        );
      case Page.ARB:
        if (loading) {
          return <LoadingSkeleton />;
        }
        if ((!arbBets || arbBets.length === 0) && !loading) {
          return (
            <div className="text-secondary-text">
              No arbitrage opportunities found.
            </div>
          );
        }
        return (
          <>
            {getCurrentPageItems(arbBets).map((bet: any) => (
              <ArbBetCard key={bet.id} bet={bet} userState={userState} />
            ))}
            {renderPagination(arbBets)}
          </>
        );
      case Page.PROMOS:
        return <PromosCalculator />;
      default:
        return null;
    }
  };

  const getLastUpdated = () => {
    if (currPage === Page.EV) {
      return evLastUpdated ? new Date(evLastUpdated) : null;
    } else if (currPage === Page.ARB) {
      return arbLastUpdated ? new Date(arbLastUpdated) : null;
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavButtons currPage={currPage} setCurrPage={setCurrPage} />
          {currPage !== Page.PROMOS && !loading && getLastUpdated() && (
            <p className="text-secondary-text text-sm">
              Updated {formatDistanceToNow(getLastUpdated()!)} ago
            </p>
          )}
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
