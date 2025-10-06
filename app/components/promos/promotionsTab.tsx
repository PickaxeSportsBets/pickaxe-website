"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

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
  promotionType: string;
  amount: number;
}

const PromotionCalculatorModal: React.FC<PromotionCalculatorModalProps> = ({
  isOpen,
  onClose,
  bet,
  promotionType,
  amount,
}) => {
  const [bonusOddsPlus, setBonusOddsPlus] = useState("");
  const [bonusOddsMinus, setBonusOddsMinus] = useState("");
  const [bonusBetSize, setBonusBetSize] = useState(amount.toString());
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    if (bet) {
      // Set the odds based on which team has the selected bookmaker
      const selectedBookmaker = bet.team1_book === bet.team1_book ? bet.team1_book : bet.team2_book;
      const isTeam1Selected = bet.team1_book === selectedBookmaker;
      
      if (isTeam1Selected) {
        setBonusOddsPlus(bet.team1_odds.toString());
        setBonusOddsMinus(bet.team2_odds.toString());
      } else {
        setBonusOddsPlus(bet.team2_odds.toString());
        setBonusOddsMinus(bet.team1_odds.toString());
      }
      setBonusBetSize(amount.toString());
    }
  }, [bet, amount]);

  const calculateBonus = React.useCallback(() => {
    const plusOdds = parseFloat(bonusOddsPlus);
    const minusOdds = parseFloat(bonusOddsMinus);
    const bonusSize = parseFloat(bonusBetSize);

    if (!plusOdds || !minusOdds || !bonusSize || plusOdds <= 0 || minusOdds >= 0) return;

    const plusOddsDecimal = 1 + plusOdds / 100;
    const minusOddsDecimal = 1 - 100 / minusOdds;
    const bonusBetProfit = bonusSize * plusOddsDecimal - bonusSize;
    const hedgeBet = bonusBetProfit / minusOddsDecimal;
    const guaranteedProfit = bonusSize * plusOddsDecimal - bonusSize - hedgeBet;

    setResults({
      bet1Amount: bonusSize,
      bet2Amount: hedgeBet,
      guaranteedProfit,
    });
  }, [bonusOddsPlus, bonusOddsMinus, bonusBetSize]);

  const calculateArbitrage = React.useCallback(() => {
    const odds1 = parseFloat(bonusOddsPlus);
    const odds2 = parseFloat(bonusOddsMinus);
    const totalWager = parseFloat(bonusBetSize);

    if (!odds1 || !odds2 || !totalWager) return;

    const decimal1 = odds1 > 0 ? 1 + odds1 / 100 : 1 + 100 / Math.abs(odds1);
    const decimal2 = odds2 > 0 ? 1 + odds2 / 100 : 1 + 100 / Math.abs(odds2);

    const stake1 = (totalWager * decimal2) / (decimal1 + decimal2);
    const stake2 = (totalWager * decimal1) / (decimal1 + decimal2);

    const payout1 = stake1 * decimal1;
    const payout2 = stake2 * decimal2;

    const profit1 = payout1 - totalWager;
    const profit2 = payout2 - totalWager;
    const guaranteedProfit = Math.min(profit1, profit2);
    const roi = (guaranteedProfit / totalWager) * 100;

    setResults({
      stake1,
      stake2,
      guaranteedProfit,
      roi,
    });
  }, [bonusOddsPlus, bonusOddsMinus, bonusBetSize]);

  useEffect(() => {
    if (promotionType === "bonus" || promotionType === "hedge") {
      calculateBonus();
    } else if (promotionType === "arb") {
      calculateArbitrage();
    }
  }, [promotionType, calculateBonus, calculateArbitrage]);

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
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark">
            {promotionType === "bonus" ? "Bonus Bet Calculator" : 
             promotionType === "hedge" ? "Risk-Free Bet Calculator" : 
             "Arbitrage Calculator"}
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

        {/* Calculator Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Odds 1 (+)
            </label>
            <input
              type="number"
              value={bonusOddsPlus}
              onChange={(e) => setBonusOddsPlus(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Odds 2 (-)
            </label>
            <input
              type="number"
              value={bonusOddsMinus}
              onChange={(e) => setBonusOddsMinus(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              {promotionType === "arb" ? "Total Wager ($)" : "Bet Size ($)"}
            </label>
            <input
              type="number"
              value={bonusBetSize}
              onChange={(e) => setBonusBetSize(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
        </div>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="p-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg">
            <h3 className="font-medium text-primary-text-light dark:text-primary-text-dark mb-3">
              Results
            </h3>
            <div className="space-y-2">
              {promotionType === "arb" ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      Stake 1
                    </span>
                    <span className="text-primary-text-light dark:text-primary-text-dark">
                      ${results.stake1?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      Stake 2
                    </span>
                    <span className="text-primary-text-light dark:text-primary-text-dark">
                      ${results.stake2?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      Guaranteed Profit
                    </span>
                    <span className="text-accent-green-light dark:text-accent-green-dark">
                      ${results.guaranteedProfit?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      ROI
                    </span>
                    <span className="text-accent-green-light dark:text-accent-green-dark">
                      {results.roi?.toFixed(2)}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      {promotionType === "bonus" ? "Bonus Bet" : "Risk-Free Bet"}
                    </span>
                    <span className="text-primary-text-light dark:text-primary-text-dark">
                      ${results.bet1Amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      Hedge Bet
                    </span>
                    <span className="text-primary-text-light dark:text-primary-text-dark">
                      ${results.bet2Amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">
                      Guaranteed Profit
                    </span>
                    <span className="text-accent-green-light dark:text-accent-green-dark">
                      ${results.guaranteedProfit?.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PromotionsTab = () => {
  const [selectedBookmaker, setSelectedBookmaker] = useState("");
  const [promotionType, setPromotionType] = useState("");
  const [amount, setAmount] = useState("");
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
    "William Hill",
    "Fanatics",
    "Fliff"
  ];

  const promotionTypes = [
    { value: "bonus", label: "Bonus Bet" },
    { value: "hedge", label: "Risk-Free Bet" },
    { value: "arb", label: "Pure Arbitrage" }
  ];

  const fetchPromotionBets = React.useCallback(async () => {
    if (!selectedBookmaker || !promotionType || !amount) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('arbitrage')
        .select('*')
        .or(`team1_book.eq.${selectedBookmaker},team2_book.eq.${selectedBookmaker}`)
        .gt('profit_percentage', 0)
        .order('profit_percentage', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching bets:', error);
        return;
      }

      // Filter to only show bets where the selected bookmaker has positive odds
      const filteredBets = data?.filter(bet => {
        const isTeam1Selected = bet.team1_book === selectedBookmaker;
        const selectedOdds = isTeam1Selected ? bet.team1_odds : bet.team2_odds;
        return selectedOdds > 0;
      }) || [];

      setBets(filteredBets);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBookmaker, promotionType, amount]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Bookmaker
            </label>
            <select
              value={selectedBookmaker}
              onChange={(e) => setSelectedBookmaker(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            >
              <option value="">Select Bookmaker</option>
              {bookmakers.map((bookmaker) => (
                <option key={bookmaker} value={bookmaker}>
                  {bookmaker}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Promotion Type
            </label>
            <select
              value={promotionType}
              onChange={(e) => setPromotionType(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            >
              <option value="">Select Type</option>
              {promotionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500"
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
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
              <div
                key={bet.primary_key}
                onClick={() => handleBetClick(bet)}
                className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-4 hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-primary-text-light dark:text-primary-text-dark">
                      {bet.game}
                    </h3>
                    <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                      {bet.sport} • {bet.market_type} • {formatDateTime(bet.commence_time)}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-accent-green-light dark:text-accent-green-dark font-medium">
                        {selectedTeam} ({selectedOdds > 0 ? '+' : ''}{selectedOdds}) @ {selectedBookmaker}
                      </span>
                      <span className="text-primary-text-light dark:text-primary-text-dark">
                        {otherTeam} ({otherOdds > 0 ? '+' : ''}{otherOdds}) @ {otherBook}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent-green-light dark:text-accent-green-dark font-medium">
                      +{parseFloat(bet.profit_percentage).toFixed(2)}%
                    </div>
                    <div className="text-xs text-secondary-text-light dark:text-secondary-text-dark">
                      Profit
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedBookmaker && promotionType && amount ? (
        <div className="text-center py-8">
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            No opportunities found for {selectedBookmaker} with positive odds.
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            Please select a bookmaker, promotion type, and amount to see available opportunities.
          </div>
        </div>
      )}

      {/* Modal */}
      <PromotionCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bet={selectedBet}
        promotionType={promotionType}
        amount={parseFloat(amount) || 0}
      />
    </div>
  );
};

export default PromotionsTab;
