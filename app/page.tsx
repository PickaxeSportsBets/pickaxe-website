"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BetCard from "./components/bets/card";
import { createClient } from "./utils/supabase/client";
const supabase = createClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Home() {
  const [bets, setBets] = useState<any>();
  useEffect(() => {
    const fetchBets = async () => {
      const { data: betsData } = await supabase.from("plus_ev").select();
      // .order("ev_percent", { ascending: false });
      console.log("data");
      console.log(betsData);
      setBets(betsData);
    };

    fetchBets();
  }, []);
  return (
    <>
      <Header />
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 justify-between items-center py-4">
            {bets && bets.length > 0 ? (
              <>
                {bets.map((bet: any) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </>
            ) : (
              <div>No bets found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
