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
import LoadingSkeleton from "./components/loadingSkeleton";
import SearchAndControls from "./components/filter";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SubscriptionBanner from "./components/home/banner";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const supabase = createClient();
import {
  initialFilterState,
  filterArbBets,
  filterEvBets,
} from "./components/filterFuncs";
import { FilterState } from "./components/filterFuncs";
enum Page {
  EV = "EV",
  ARB = "ARB",
  PROMOS = "PROMOS",
}

export default function Home() {
  const [bets, setBets] = useState<any>();
  const [filteredEVBets, setFilteredEVBets] = useState<any>();
  const [filteredArbBets, setFilteredArbBets] = useState<any>();
  const [arbBets, setArbBets] = useState<any>();
  const [userState, setUserState] = useState("NY");
  const [currPage, setCurrPage] = useState<Page>(Page.EV);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [evLastUpdated, setEvLastUpdated] = useState("");
  const [arbLastUpdated, setArbLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [marketFilters, setMarketFilters] = useState<string[]>([]);
  const [bookieFilters, setBookieFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const itemsPerPage = 100;
  const { toast } = useToast();

  const onRefresh = async () => {
    toast({
      title: "Updating Data",
      description: "Fetching the latest betting information...",
      className:
        "bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark",
    });
    setLoading(true);

    try {
      await fetch(
        "https://backend-production-adcb.up.railway.app/api/v1/db/update_dbV2",
        {
          method: "POST",
        }
      );
      await fetchData();
      toast({
        title: "Update Complete",
        description: "Betting data has been successfully updated",
        className:
          "bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Update Failed",
        description: "There was an error updating the betting data",
        variant: "destructive",
        className:
          "bg-negative-red-light dark:bg-negative-red-dark text-primary-text-light dark:text-primary-text-dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
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
          (a, b) =>
            (Number(b.ev_percentage) || 0) - (Number(a.ev_percentage) || 0)
        );
        setBets(sortedBets);
        console.log(sortedBets.slice(0, 50));
        setFilteredEVBets(sortedBets);
      }

      if (arbBetsData) {
        setArbLastUpdated(arbBetsData[0]?.timestamp);
        const sortedArbBets = [...arbBetsData].sort((a, b) => {
          const profitA = Number(a.profit_percentage) || 0;
          const profitB = Number(b.profit_percentage) || 0;

          if (profitA === 0 && profitB === 0) {
            const holdA = Number(a.hold_percentage) || 0;
            const holdB = Number(b.hold_percentage) || 0;
            return holdA - holdB;
          }

          return profitB - profitA;
        });

        setArbBets(sortedArbBets);
        console.log(sortedArbBets.slice(0, 50));
        setFilteredArbBets(sortedArbBets);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserState = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.region_code) {
          setUserState(data.region_code);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchUserState();
    fetchData();
  }, []);
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Apply filters effect
  useEffect(() => {
    if (currPage === Page.EV) {
      const filteredBets = filterEvBets(bets || [], filters);
      setFilteredEVBets(filteredBets);
    } else {
      const filteredBets = filterArbBets(arbBets || [], filters);
      setFilteredArbBets(filteredBets);
    }
  }, [filters, currPage, bets, arbBets]);

  const handleSearch = (searchTerm: string) => {
    const currentBets = currPage === Page.EV ? bets : arbBets;
    if (!currentBets) return;

    const filtered = currentBets.filter((bet: any) => {
      const searchTermLower = searchTerm.toLowerCase();
      const gameMatch =
        bet.game?.toLowerCase().includes(searchTermLower) || false;
      const marketMatch =
        bet.market_type?.toLowerCase().includes(searchTermLower) || false;
      const propMatch =
        bet.prop_description?.toLowerCase().includes(searchTermLower) || false;

      if (currPage === Page.EV) {
        const teamMatch =
          bet.team?.toLowerCase().includes(searchTermLower) || false;
        return gameMatch || marketMatch || teamMatch || propMatch;
      } else {
        const team1Match =
          bet.team1_name?.toLowerCase().includes(searchTermLower) || false;
        const team2Match =
          bet.team2_name?.toLowerCase().includes(searchTermLower) || false;
        return (
          gameMatch || marketMatch || team1Match || team2Match || propMatch
        );
      }
    });

    if (currPage === Page.EV) {
      setFilteredEVBets(filtered);
    } else {
      setFilteredArbBets(filtered);
    }
    setCurrentPageNumber(1);
  };

  const getCurrentPageItems = (items: any[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = (items: any[]) =>
    Math.ceil((items?.length || 0) / itemsPerPage) || 1;

  const getLastUpdated = () => {
    if (currPage === Page.EV) {
      return evLastUpdated ? new Date(evLastUpdated) : null;
    } else if (currPage === Page.ARB) {
      return arbLastUpdated ? new Date(arbLastUpdated) : null;
    }
    return null;
  };

  const renderPagination = (items: any[]) => {
    const total = totalPages(items);
    return (
      <div className="flex justify-center space-x-4 mt-8 mb-4">
        <button
          onClick={() => setCurrentPageNumber((curr) => Math.max(1, curr - 1))}
          disabled={currentPageNumber === 1}
          className="px-4 py-2 rounded bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark disabled:opacity-50 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-primary-text-light dark:text-primary-text-dark">
          Page {currentPageNumber} of {total}
        </span>
        <button
          onClick={() =>
            setCurrentPageNumber((curr) => Math.min(total, curr + 1))
          }
          disabled={currentPageNumber === total}
          className="px-4 py-2 rounded bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark disabled:opacity-50 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark"
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
          return (
            <div className="text-secondary-text-light dark:text-secondary-text-dark">
              No bets found.
            </div>
          );
        }
        return (
          <>
            {getCurrentPageItems(filteredEVBets).map((bet: any) => (
              <EVBetCard
                key={bet.primary_key || bet.id}
                bet={bet}
                userState={userState}
              />
            ))}
            {renderPagination(filteredEVBets)}
          </>
        );
      case Page.ARB:
        if (loading) {
          return <LoadingSkeleton />;
        }
        if ((!arbBets || arbBets.length === 0) && !loading) {
          return (
            <div className="text-secondary-text-light dark:text-secondary-text-dark">
              No arbitrage opportunities found.
            </div>
          );
        }
        return (
          <>
            {getCurrentPageItems(filteredArbBets).map((bet: any) => (
              <ArbBetCard
                key={bet.primary_key || bet.id}
                bet={bet}
                userState={userState}
              />
            ))}
            {renderPagination(filteredArbBets)}
          </>
        );
      case Page.PROMOS:
        return <PromosCalculator />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <SubscriptionBanner />
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark">
        <div className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6">
          <NavButtons currPage={currPage} setCurrPage={setCurrPage} />

          {currPage !== Page.PROMOS && (
            <SearchAndControls
              onSearch={handleSearch}
              onRefresh={onRefresh}
              filters={filters}
              updateFilters={updateFilters}
              loading={loading}
              isArbPage={currPage === Page.ARB}
            />
          )}

          {currPage !== Page.PROMOS && !loading && getLastUpdated() && (
            <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
              Updated {formatDistanceToNow(getLastUpdated()!)} ago
            </p>
          )}

          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
