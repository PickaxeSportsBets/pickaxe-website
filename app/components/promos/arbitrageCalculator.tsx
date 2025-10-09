"use client";
import React, { useState } from "react";

interface ArbitrageInputs {
  odds1: string;
  odds2: string;
  stake1: string;
  stake2: string;
}

interface ArbitrageResult {
  stake1?: number;
  stake2?: number;
  guaranteedProfit?: number;
  roi?: number;
  payout1?: number;
  payout2?: number;
  totalStake?: number;
}

interface ArbitrageCalculatorProps {
  prefilledOdds1?: string;
  prefilledOdds2?: string;
}

const ArbitrageCalculator = ({ prefilledOdds1, prefilledOdds2 }: ArbitrageCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<ArbitrageInputs>(() => {
    // Use prefilled values if provided, otherwise load from localStorage or use defaults
    if (prefilledOdds1 && prefilledOdds2) {
      return {
        odds1: prefilledOdds1,
        odds2: prefilledOdds2,
        stake1: "",
        stake2: "",
      };
    }
    
    const savedValues = localStorage.getItem("arbitrageInputs");
    return savedValues
      ? JSON.parse(savedValues)
      : {
          odds1: "",
          odds2: "",
          stake1: "",
          stake2: "",
        };
  });

  const [results, setResults] = useState<ArbitrageResult>({});

  // Save inputs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("arbitrageInputs", JSON.stringify(inputs));
  }, [inputs]);

  const toDecimalOdds = (americanOdds: string) => {
    const odds = parseFloat(americanOdds.replace("+", ""));
    return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
  };

  const calculateArbitrageStakes = (
    stake: number,
    isFirstBet: boolean,
    odds1: string,
    odds2: string
  ) => {
    const decimal1 = toDecimalOdds(odds1);
    const decimal2 = toDecimalOdds(odds2);

    if (isFirstBet) {
      // If stake1 is provided, calculate stake2
      const calculatedStake2 = (stake * decimal1) / decimal2;
      return {
        stake1: stake,
        stake2: calculatedStake2,
      };
    } else {
      // If stake2 is provided, calculate stake1
      const calculatedStake1 = (stake * decimal2) / decimal1;
      return {
        stake1: calculatedStake1,
        stake2: stake,
      };
    }
  };

  const getPayout = (stake: number, odds: string) => {
    const decimal = toDecimalOdds(odds);
    return (stake * decimal).toFixed(2);
  };

  const calculateArbitrage = React.useCallback(() => {
    const odds1 = inputs.odds1;
    const odds2 = inputs.odds2;
    const stake1 = parseFloat(inputs.stake1);
    const stake2 = parseFloat(inputs.stake2);

    if (!odds1 || !odds2 || (!stake1 && !stake2)) {
      setResults({});
      return;
    }

    let currentStake1 = stake1;
    let currentStake2 = stake2;

    // If only one stake is provided, calculate the other
    if (stake1 && !stake2) {
      const stakes = calculateArbitrageStakes(stake1, true, odds1, odds2);
      currentStake2 = stakes.stake2;
    } else if (stake2 && !stake1) {
      const stakes = calculateArbitrageStakes(stake2, false, odds1, odds2);
      currentStake1 = stakes.stake1;
    }

    const totalStake = currentStake1 + currentStake2;
    const payout1 = parseFloat(getPayout(currentStake1, odds1));
    const payout2 = parseFloat(getPayout(currentStake2, odds2));

    // Calculate guaranteed profit (minimum of the two scenarios)
    const profit1 = payout1 - totalStake;
    const profit2 = payout2 - totalStake;
    const guaranteedProfit = Math.min(profit1, profit2);

    // Calculate ROI
    const roi = totalStake > 0 ? (guaranteedProfit / totalStake) * 100 : 0;

    setResults({
      stake1: currentStake1,
      stake2: currentStake2,
      guaranteedProfit,
      roi,
      payout1,
      payout2,
      totalStake,
    });
  }, [inputs]);

  // Calculate whenever inputs change
  React.useEffect(() => {
    calculateArbitrage();
  }, [inputs, calculateArbitrage]);

  const handleStake1Change = (value: string) => {
    setInputs(prev => ({ ...prev, stake1: value }));
    if (!isNaN(parseFloat(value)) && value !== "") {
      const stakes = calculateArbitrageStakes(
        parseFloat(value),
        true,
        inputs.odds1,
        inputs.odds2
      );
      setInputs(prev => ({ ...prev, stake2: stakes.stake2.toFixed(2) }));
    } else {
      setInputs(prev => ({ ...prev, stake2: "" }));
    }
  };

  const handleStake2Change = (value: string) => {
    setInputs(prev => ({ ...prev, stake2: value }));
    if (!isNaN(parseFloat(value)) && value !== "") {
      const stakes = calculateArbitrageStakes(
        parseFloat(value),
        false,
        inputs.odds1,
        inputs.odds2
      );
      setInputs(prev => ({ ...prev, stake1: stakes.stake1.toFixed(2) }));
    } else {
      setInputs(prev => ({ ...prev, stake1: "" }));
    }
  };

  const getColorClass = (value: number) => {
    if (value > 0) return "text-accent-green-light dark:text-accent-green-dark";
    if (value === 0) return "text-yellow-500";
    return "text-negative-red-light dark:text-negative-red-dark";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-primary-text-light dark:text-primary-text-dark text-2xl font-medium mb-2">
            Arbitrage Calculator
          </h2>
          <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
            Calculate optimal stakes for arbitrage betting opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
              Odds 1
            </label>
            <input
              type="number"
              placeholder="e.g., +150"
              value={inputs.odds1}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  odds1: e.target.value,
                }))
              }
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>

          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
              Odds 2
            </label>
            <input
              type="number"
              placeholder="e.g., -200"
              value={inputs.odds2}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  odds2: e.target.value,
                }))
              }
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
              Bet 1 Stake ($)
            </label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={inputs.stake1}
              onChange={(e) => handleStake1Change(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
              Bet 2 Stake ($)
            </label>
            <input
              type="number"
              placeholder="e.g., 200"
              value={inputs.stake2}
              onChange={(e) => handleStake2Change(e.target.value)}
              className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
            />
          </div>
        </div>

        {results.stake1 && results.stake2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bet 1 */}
            <div className="bg-primary-bg-light dark:bg-primary-bg-dark p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-primary-text-light dark:text-primary-text-dark">
                Bet 1
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Odds:
                  </span>
                  <span
                    className={
                      parseFloat(inputs.odds1) >= 0
                        ? "text-accent-green-light dark:text-accent-green-dark"
                        : "text-negative-red-light dark:text-negative-red-dark"
                    }
                  >
                    {inputs.odds1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Stake:
                  </span>
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    ${results.stake1?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Payout:
                  </span>
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    ${results.payout1?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bet 2 */}
            <div className="bg-primary-bg-light dark:bg-primary-bg-dark p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-primary-text-light dark:text-primary-text-dark">
                Bet 2
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Odds:
                  </span>
                  <span
                    className={
                      parseFloat(inputs.odds2) >= 0
                        ? "text-accent-green-light dark:text-accent-green-dark"
                        : "text-negative-red-light dark:text-negative-red-dark"
                    }
                  >
                    {inputs.odds2}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Stake:
                  </span>
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    ${results.stake2?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text-light dark:text-secondary-text-dark">
                    Payout:
                  </span>
                  <span className="text-primary-text-light dark:text-primary-text-dark">
                    ${results.payout2?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {results.guaranteedProfit !== undefined && (
          <div className="mt-6 bg-profit-green-light bg-opacity-10 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Total Stake:
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${results.totalStake?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Guaranteed Profit:
                </span>
                <span className={getColorClass(results.guaranteedProfit)}>
                  ${results.guaranteedProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  ROI:
                </span>
                <span className={getColorClass(results.roi || 0)}>
                  {(results.roi || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArbitrageCalculator;

