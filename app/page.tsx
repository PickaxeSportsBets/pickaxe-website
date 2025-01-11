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
const supabase = createClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

enum Page {
  EV = "EV",
  ARB = "ARB",
  PROMOS = "PROMOS",
}

export default function Home() {
  const [bets, setBets] = useState<any>();
  const [arbBets, setArbBets] = useState<any>();
  const [userState, setUserState] = useState("NY");
  const [currPage, setCurrPage] = useState<Page>(Page.EV);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
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
      const { data: evBets } = await supabase.from("plus_ev").select();
      const { data: arbBetsData } = await supabase.from("arbitrage").select();
      if (evBets) {
        const sortedBets = [...evBets].sort(
          (a, b) => (b.ev_percentage || 0) - (a.ev_percentage || 0)
        );
        setBets(sortedBets);
      }
      if (arbBetsData) {
        const sortedArbBets = [...arbBetsData].sort(
          (a, b) => (b.profit_percentage || 0) - (a.profit_percentage || 0)
        );
        setArbBets(sortedArbBets);
        console.log(sortedArbBets.slice(0, 100));
      }
    };

    fetchUserState();
    fetchBets();
  }, []);

  const getCurrentPageItems = (items: any[]) => {
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = (items: any[]) =>
    Math.ceil(items?.length / itemsPerPage) || 1;

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
        if (!bets || bets.length === 0) {
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
        if (!arbBets || arbBets.length === 0) {
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
        return (
          <div className="text-secondary-text">
            Promotions and bonuses coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavButtons currPage={currPage} setCurrPage={setCurrPage} />
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
