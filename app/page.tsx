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
const supabase = createClient();

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
  const [marketFilter, setMarketFilter] = useState("all");
  const [bookieFilter, setBookieFilter] = useState("all");
  const itemsPerPage = 100;

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
          (a, b) => (b.ev_percentage || 0) - (a.ev_percentage || 0)
        );
        setBets(sortedBets);
        setFilteredEVBets(sortedBets);
      }

      if (arbBetsData) {
        setArbLastUpdated(arbBetsData[0]?.timestamp);
        const sortedArbBets = [...arbBetsData].sort(
          (a, b) => (b.profit_percentage || 0) - (a.profit_percentage || 0)
        );
        setArbBets(sortedArbBets);
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
          console.log("User State:", data.region_code);
          setUserState(data.region_code);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchUserState();
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const currentBets = currPage === Page.EV ? bets : arbBets;
    if (!currentBets) return;

    const filtered = currentBets.filter((bet: any) => {
      return (
        bet.game?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.market_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (currPage === Page.EV) {
      setFilteredEVBets(filtered);
    } else {
      setFilteredArbBets(filtered);
    }
    setCurrentPageNumber(1);
  };

  const applyFilters = () => {
    const currentBets = currPage === Page.EV ? bets : arbBets;
    if (!currentBets) return;

    let filtered = [...currentBets];

    // Date filtering
    if (dateFilter !== "all") {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekLater = new Date(now);
      weekLater.setDate(weekLater.getDate() + 7);

      filtered = filtered.filter((bet: any) => {
        const betDate = new Date(bet.commence_time);
        switch (dateFilter) {
          case "today":
            return betDate.toDateString() === now.toDateString();
          case "tomorrow":
            return betDate.toDateString() === tomorrow.toDateString();
          case "week":
            return betDate <= weekLater;
          default:
            return true;
        }
      });
    }

    // Market type filtering
    if (marketFilter !== "all") {
      filtered = filtered.filter(
        (bet: any) =>
          bet.market_type.toLowerCase() === marketFilter.toLowerCase()
      );
    }

    // Bookmaker filtering
    if (bookieFilter !== "all") {
      filtered = filtered.filter(
        (bet: any) => bet.bookmaker.toLowerCase() === bookieFilter.toLowerCase()
      );
    }

    if (currPage === Page.EV) {
      setFilteredEVBets(filtered);
    } else {
      setFilteredArbBets(filtered);
    }
    setCurrentPageNumber(1);
  };

  useEffect(() => {
    applyFilters();
  }, [dateFilter, marketFilter, bookieFilter, currPage]);

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
            {getCurrentPageItems(filteredEVBets).map((bet: any) => (
              <EVBetCard key={bet.id} bet={bet} userState={userState} />
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
            <div className="text-secondary-text">
              No arbitrage opportunities found.
            </div>
          );
        }
        return (
          <>
            {getCurrentPageItems(filteredArbBets).map((bet: any) => (
              <ArbBetCard key={bet.id} bet={bet} userState={userState} />
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
        <div className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6">
          <NavButtons currPage={currPage} setCurrPage={setCurrPage} />

          {currPage !== Page.PROMOS && (
            <SearchAndControls
              onSearch={handleSearch}
              onRefresh={fetchData}
              onDateFilter={setDateFilter}
              onMarketFilter={setMarketFilter}
              onBookieFilter={setBookieFilter}
              loading={loading}
            />
          )}

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
