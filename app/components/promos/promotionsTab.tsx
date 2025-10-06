"use client";
import React, { useState, useEffect } from "react";
import { useHeaders } from "@/lib/headersContext";
import { Calculator } from "lucide-react";
import Image from "next/image";
import ArbitrageCalculator from "./arbitrageCalculator";
import BookmakerLogos from "../bets/utils";

// Promotions tab component for filtering arbitrage bets by bookmaker

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper functions from arbCard
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

const formatTeamName = (name: string, point: string) => {
  if (!point || point === "null") return name;
  return `${name} (${point})`;
};

const formatProfitPercentage = (profit: number, hold: number) => {
  if (profit > 0) {
    return `+${profit.toFixed(2)}%`;
  } else {
    return `${profit.toFixed(2)}%`;
  }
};

interface PromotionBet {
  primary_key: string;
  opportunity_type: string;
  hold_percentage: number;
  sport: string;
  market_type: string;
  prop_description: string;
  market_point: string;
  game: string;
  commence_time: string;
  team1_name: string;
  team1_book: string;
  team1_odds: number;
  team1_point: string;
  team1_stake: number;
  team1_link: string;
  team2_name: string;
  team2_book: string;
  team2_odds: number;
  team2_point: string;
  team2_stake: number;
  team2_link: string;
  profit_percentage: string;
  timestamp: string;
  market_data: string;
  player: string;
}

interface PromotionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: PromotionBet | null;
}

const PromotionCalculatorModal: React.FC<PromotionCalculatorModalProps> = ({
  isOpen,
  onClose,
  bet,
}) => {
  const [activeTab, setActiveTab] = useState("arbitrage");

  if (!isOpen || !bet) return null;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark">
            Calculators
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark"
          >
            ✕
          </button>
        </div>

        {/* Bet Information */}
        <div className="mb-6 p-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg">
          <h3 className="font-medium text-primary-text-light dark:text-primary-text-dark mb-2">
            {bet.game}
          </h3>
          <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
            {bet.sport} • {bet.market_type} • {formatDateTime(bet.commence_time)}
          </p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-primary-text-light dark:text-primary-text-dark">
              {bet.team1_name} ({bet.team1_odds}) @ {bet.team1_book}
            </span>
            <span className="text-primary-text-light dark:text-primary-text-dark">
              {bet.team2_name} ({bet.team2_odds}) @ {bet.team2_book}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg p-1">
          <button
            onClick={() => setActiveTab("arbitrage")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "arbitrage"
                ? "bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark"
                : "text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark"
            }`}
          >
            Arbitrage
          </button>
          <button
            onClick={() => setActiveTab("bonus")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "bonus"
                ? "bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark"
                : "text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark"
            }`}
          >
            Bonus Bet
          </button>
          <button
            onClick={() => setActiveTab("hedge")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "hedge"
                ? "bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark"
                : "text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark"
            }`}
          >
            Risk-Free Bet
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "arbitrage" && (
            <div>
              <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                Arbitrage Calculator
              </h3>
              <ArbitrageCalculator 
                prefilledOdds1={bet.team1_odds.toString()}
                prefilledOdds2={bet.team2_odds.toString()}
              />
            </div>
          )}
          
          {activeTab === "bonus" && (
            <div>
              <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                Bonus Bet Calculator
              </h3>
              <BonusBetCalculator bet={bet} />
            </div>
          )}
          
          {activeTab === "hedge" && (
            <div>
              <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                Risk-Free Bet Calculator
              </h3>
              <RiskFreeBetCalculator bet={bet} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Bonus Bet Calculator Component
const BonusBetCalculator = ({ bet }: { bet: PromotionBet }) => {
  const [inputs, setInputs] = useState({
    bonusOddsPlus: "",
    bonusOddsMinus: "",
    bonusBetSize: "",
  });
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    if (bet) {
      const isTeam1Selected = bet.team1_book === bet.team1_book; // This will be determined by the selected bookmaker
      setInputs({
        bonusOddsPlus: bet.team1_odds.toString(),
        bonusOddsMinus: bet.team2_odds.toString(),
        bonusBetSize: "", // No default amount
      });
    }
  }, [bet]);

  const calculateBonus = React.useCallback(() => {
    const plusOdds = parseFloat(inputs.bonusOddsPlus);
    const minusOdds = parseFloat(inputs.bonusOddsMinus);
    const bonusSize = parseFloat(inputs.bonusBetSize);

    if (!plusOdds || !minusOdds || !bonusSize || plusOdds <= 0 || minusOdds >= 0) return;

    const plusOddsDecimal = 1 + plusOdds / 100;
    const minusOddsDecimal = 1 - 100 / minusOdds;
    const bonusBetProfit = bonusSize * plusOddsDecimal - bonusSize;
    const hedgeBet = bonusBetProfit / minusOddsDecimal;
    const guaranteedProfit = bonusSize * plusOddsDecimal - bonusSize - hedgeBet;

    const bet1Payout = bonusSize * plusOddsDecimal;
    const bet2Payout = hedgeBet * minusOddsDecimal;

    setResults({
      bet1Amount: bonusSize,
      bet2Amount: hedgeBet,
      bet1Payout,
      bet2Payout,
      guaranteedProfit,
    });
  }, [inputs]);

  useEffect(() => {
    calculateBonus();
  }, [calculateBonus]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Odds 1 (+)
        </label>
        <input
          type="number"
          value={inputs.bonusOddsPlus}
          onChange={(e) => setInputs(prev => ({ ...prev, bonusOddsPlus: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Odds 2 (-)
        </label>
        <input
          type="number"
          value={inputs.bonusOddsMinus}
          onChange={(e) => setInputs(prev => ({ ...prev, bonusOddsMinus: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Bonus Bet Size ($)
        </label>
        <input
          type="number"
          value={inputs.bonusBetSize}
          onChange={(e) => setInputs(prev => ({ ...prev, bonusBetSize: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>

      {Object.keys(results).length > 0 && (
        <div className="p-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg">
          <h4 className="font-medium text-primary-text-light dark:text-primary-text-dark mb-3">
            Results
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bonus Bet Wager
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet1Amount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bonus Bet Payout
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet1Payout?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Hedge Bet Wager
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet2Amount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Hedge Bet Payout
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet2Payout?.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-text-light dark:border-secondary-text-dark">
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Guaranteed Profit
                </span>
                <span className="text-accent-green-light dark:text-accent-green-dark">
                  ${results.guaranteedProfit?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Risk-Free Bet Calculator Component
const RiskFreeBetCalculator = ({ bet }: { bet: PromotionBet }) => {
  const [inputs, setInputs] = useState({
    odds1: "",
    odds2: "",
    bonusAmount: "",
    estimatedBonusValue: "",
  });
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    if (bet) {
      setInputs({
        odds1: bet.team1_odds.toString(),
        odds2: bet.team2_odds.toString(),
        bonusAmount: "", // No default amount
        estimatedBonusValue: "60", // Default percentage
      });
    }
  }, [bet]);

  const calculateRiskFree = React.useCallback(() => {
    const odds1 = parseFloat(inputs.odds1);
    const odds2 = parseFloat(inputs.odds2);
    const bonusAmount = parseFloat(inputs.bonusAmount);
    const estimatedBonusValue = parseFloat(inputs.estimatedBonusValue);

    if (!odds1 || !odds2 || !bonusAmount || !estimatedBonusValue) return;

    const bonusValueDollars = (bonusAmount * estimatedBonusValue) / 100;
    const bet1Amount = bonusAmount;
    const bet1Payout = bet1Amount * (1 + odds1 / 100);
    const bet2Amount = (bet1Payout - bonusValueDollars) / (1 - 100 / odds2);
    const bet2TotalPayout = bet2Amount * (1 - 100 / odds2);
    const profitIfBet1Wins = bet1Payout - bet1Amount - bet2Amount;
    const profitIfBet2Wins = bet2TotalPayout - bet2Amount - bet1Amount + bonusValueDollars;

    const bet1PayoutValue = bet1Payout;
    const bet2PayoutValue = bet2TotalPayout;

    setResults({
      bonusValue: bonusValueDollars,
      bet1Amount,
      bet2Amount,
      bet1Payout: bet1PayoutValue,
      bet2Payout: bet2PayoutValue,
      profitBet1Wins: profitIfBet1Wins,
      profitBet2Wins: profitIfBet2Wins,
    });
  }, [inputs]);

  useEffect(() => {
    calculateRiskFree();
  }, [calculateRiskFree]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Odds 1 (+)
        </label>
        <input
          type="number"
          value={inputs.odds1}
          onChange={(e) => setInputs(prev => ({ ...prev, odds1: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Odds 2 (-)
        </label>
        <input
          type="number"
          value={inputs.odds2}
          onChange={(e) => setInputs(prev => ({ ...prev, odds2: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Bonus Amount ($)
        </label>
        <input
          type="number"
          value={inputs.bonusAmount}
          onChange={(e) => setInputs(prev => ({ ...prev, bonusAmount: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
          Estimated Bonus Value (%)
        </label>
        <input
          type="number"
          value={inputs.estimatedBonusValue}
          onChange={(e) => setInputs(prev => ({ ...prev, estimatedBonusValue: e.target.value }))}
          className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
        />
      </div>

      {Object.keys(results).length > 0 && (
        <div className="p-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg">
          <h4 className="font-medium text-primary-text-light dark:text-primary-text-dark mb-3">
            Results
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Estimated Bonus Value
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bonusValue?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bet 1 Wager
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet1Amount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bet 1 Payout
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet1Payout?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bet 2 Wager
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet2Amount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Bet 2 Payout
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${results.bet2Payout?.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-text-light dark:border-secondary-text-dark">
              <div className="text-primary-text-light dark:text-primary-text-dark font-medium mb-3">
                Profit Scenarios
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  If Bet 1 (+{inputs.odds1}) wins
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${results.profitBet1Wins?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  If Bet 2 ({inputs.odds2}) wins
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${results.profitBet2Wins?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PromotionsTab = () => {
  const { getAuthHeaders, loading: headersLoading } = useHeaders();
  const [selectedBookmaker, setSelectedBookmaker] = useState("");
  const [bets, setBets] = useState<PromotionBet[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBet, setSelectedBet] = useState<PromotionBet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookmakers = [
    "DraftKings",
    "FanDuel", 
    "BetMGM",
    "Caesars",
    "BetRivers",
    "Pinnacle",
    "ESPN Bet",
    "Hard Rock Bet",
    "Fanatics",
    "Fliff"
  ];


  const fetchPromotionBets = React.useCallback(async () => {
    if (!selectedBookmaker || headersLoading) return;

    setLoading(true);
    try {
      // Get authentication headers
      const headers = await getAuthHeaders();

      // Use the same API endpoint as the dashboard
      const response = await fetch(`${API_URL}/api/v1/db/arbitrageBets`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        console.error('Error fetching bets:', response.statusText);
        return;
      }

      const data = await response.json();

      // Filter to only show bets where the selected bookmaker has positive odds
      const filteredBets = data?.filter((bet: any) => {
        const isTeam1Selected = bet.team1_book === selectedBookmaker;
        const isTeam2Selected = bet.team2_book === selectedBookmaker;
        
        // Check if the selected bookmaker is in either team
        if (!isTeam1Selected && !isTeam2Selected) return false;
        
        // Get the odds for the selected bookmaker
        const selectedOdds = isTeam1Selected ? bet.team1_odds : bet.team2_odds;
        
        // Only include if the selected bookmaker has positive odds
        return selectedOdds > 0;
      }) || [];

      console.log(`Found ${data?.length || 0} total arbitrage bets`);
      console.log(`Found ${filteredBets.length} bets for ${selectedBookmaker} with positive odds`);

      setBets(filteredBets);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBookmaker, headersLoading, getAuthHeaders]);

  useEffect(() => {
    fetchPromotionBets();
  }, [fetchPromotionBets]);

  const handleBetClick = (bet: PromotionBet) => {
    setSelectedBet(bet);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark mb-6">
          Promotions Calculator
        </h1>
        
        {/* Filters */}
        <div className="mb-6">
          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Bookmaker
            </label>
            <select
              value={selectedBookmaker}
              onChange={(e) => setSelectedBookmaker(e.target.value)}
              className="w-full max-w-md bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            >
              <option value="">Select Bookmaker</option>
              {bookmakers.map((bookmaker) => (
                <option key={bookmaker} value={bookmaker}>
                  {bookmaker}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            Loading bets...
          </div>
        </div>
      ) : bets.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark">
            Available Opportunities ({bets.length})
          </h2>
          {bets.map((bet) => {
            const isTeam1Selected = bet.team1_book === selectedBookmaker;
            const selectedOdds = isTeam1Selected ? bet.team1_odds : bet.team2_odds;
            const selectedTeam = isTeam1Selected ? bet.team1_name : bet.team2_name;
            const otherOdds = isTeam1Selected ? bet.team2_odds : bet.team1_odds;
            const otherTeam = isTeam1Selected ? bet.team2_name : bet.team1_name;
            const otherBook = isTeam1Selected ? bet.team2_book : bet.team1_book;

            return (
              <div key={bet.primary_key} className="w-full py-4">
                <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg overflow-hidden hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark transition-all cursor-pointer">
                  <div className="py-4 md:px-8 px-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto px-4 md:px-0">
                        <div className="flex items-center gap-2">
                          {Number(bet.profit_percentage) > 0 ? (
                            <div className="text-accent-green-light dark:text-accent-green-dark w-24 text-left">
                              <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                                Profit
                              </p>
                              {formatProfitPercentage(
                                Number(bet.profit_percentage),
                                Number(bet.hold_percentage)
                              )}
                            </div>
                          ) : (
                            <div className="text-negative-red-light dark:text-negative-red-dark w-24 text-left">
                              <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                                Profit
                              </p>
                              {formatProfitPercentage(
                                Number(bet.profit_percentage),
                                Number(bet.hold_percentage)
                              )}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBetClick(bet);
                            }}
                            className="p-2 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark rounded-full transition-colors"
                            aria-label="Open calculator"
                          >
                            <Calculator className="w-8 h-8 text-secondary-text-light dark:text-secondary-text-dark" />
                          </button>
                        </div>
                        <div>
                          <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm break-words md:whitespace-nowrap">
                            {formatDateTime(bet.commence_time)}
                          </div>
                          <div className="text-primary-text-light dark:text-primary-text-dark">
                            {bet.game}
                          </div>
                          <div className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                            {bet.sport}
                          </div>
                        </div>
                      </div>

                      <div className="text-market-purple-light dark:text-market-purple-dark font-medium px-4 md:px-0 text-left md:text-center w-full md:w-auto">
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

                      <div className="flex flex-col space-y-4 w-full md:w-auto">
                        {/* Selected Bookmaker Bet */}
                        <div className="flex items-center justify-between md:justify-end px-4 md:px-0 md:space-x-8">
                          <div className="text-left md:text-right">
                            <div className="text-primary-text-light dark:text-primary-text-dark">
                              {formatTeamName(selectedTeam, isTeam1Selected ? bet.team1_point : bet.team2_point)}
                            </div>
                            <div className="flex items-center gap-2 text-accent-green-light dark:text-accent-green-dark">
                              {selectedOdds > 0 ? '+' : ''}{selectedOdds}
                              <Image
                                src={
                                  BookmakerLogos[selectedBookmaker.toLowerCase().replace(/[^a-z]/g, "")] ||
                                  "/images/placeholder.png"
                                }
                                alt={selectedBookmaker}
                                width={20}
                                height={20}
                                className="rounded"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Other Bookmaker Bet */}
                        <div className="flex items-center justify-between md:justify-end px-4 md:px-0 md:space-x-8">
                          <div className="text-left md:text-right">
                            <div className="text-primary-text-light dark:text-primary-text-dark">
                              {formatTeamName(otherTeam, isTeam1Selected ? bet.team2_point : bet.team1_point)}
                            </div>
                            <div className={`flex items-center gap-2 ${
                              otherOdds >= 0
                                ? "text-accent-green-light dark:text-accent-green-dark"
                                : "text-negative-red-light dark:text-negative-red-dark"
                            }`}>
                              {otherOdds > 0 ? '+' : ''}{otherOdds}
                              <Image
                                src={
                                  BookmakerLogos[otherBook.toLowerCase().replace(/[^a-z]/g, "")] ||
                                  "/images/placeholder.png"
                                }
                                alt={otherBook}
                                width={20}
                                height={20}
                                className="rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedBookmaker ? (
        <div className="text-center py-8">
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            No opportunities found for {selectedBookmaker} with positive odds.
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            Please select a bookmaker to see available opportunities.
          </div>
        </div>
      )}

      {/* Modal */}
      <PromotionCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bet={selectedBet}
      />
    </div>
  );
};

export default PromotionsTab;
