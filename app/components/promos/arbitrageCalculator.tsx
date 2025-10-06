"use client";
import React, { useState } from "react";

interface ArbitrageInputs {
  odds1: string;
  odds2: string;
  totalWager: string;
}

interface ArbitrageResult {
  stake1?: number;
  stake2?: number;
  guaranteedProfit?: number;
  roi?: number;
}

const ArbitrageCalculator = () => {
  const [inputs, setInputs] = useState<ArbitrageInputs>(() => {
    // Load saved values from localStorage or use defaults
    const savedValues = localStorage.getItem("arbitrageInputs");
    return savedValues
      ? JSON.parse(savedValues)
      : {
          odds1: "",
          odds2: "",
          totalWager: "",
        };
  });

  const [results, setResults] = useState<ArbitrageResult>({});

  // Save inputs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("arbitrageInputs", JSON.stringify(inputs));
  }, [inputs]);

  const calculateArbitrage = () => {
    const odds1 = parseFloat(inputs.odds1);
    const odds2 = parseFloat(inputs.odds2);
    const totalWager = parseFloat(inputs.totalWager);

    if (!odds1 || !odds2 || !totalWager) {
      setResults({});
      return;
    }

    // Convert American odds to decimal odds
    const decimal1 = odds1 > 0 ? 1 + odds1 / 100 : 1 + 100 / Math.abs(odds1);
    const decimal2 = odds2 > 0 ? 1 + odds2 / 100 : 1 + 100 / Math.abs(odds2);

    // Calculate stakes for equal profit
    const stake1 = (totalWager * decimal2) / (decimal1 + decimal2);
    const stake2 = (totalWager * decimal1) / (decimal1 + decimal2);

    // Calculate payouts
    const payout1 = stake1 * decimal1;
    const payout2 = stake2 * decimal2;

    // Calculate guaranteed profit (minimum of the two scenarios)
    const profit1 = payout1 - totalWager;
    const profit2 = payout2 - totalWager;
    const guaranteedProfit = Math.min(profit1, profit2);

    // Calculate ROI
    const roi = (guaranteedProfit / totalWager) * 100;

    setResults({
      stake1,
      stake2,
      guaranteedProfit,
      roi,
    });
  };

  // Calculate whenever inputs change
  React.useEffect(() => {
    calculateArbitrage();
  }, [inputs]);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
              Total Wager ($)
            </label>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.totalWager}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  totalWager: e.target.value,
                }))
              }
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
                    ${((results.stake1 || 0) * (parseFloat(inputs.odds1) > 0 ? 1 + parseFloat(inputs.odds1) / 100 : 1 + 100 / Math.abs(parseFloat(inputs.odds1)))).toFixed(2)}
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
                    ${((results.stake2 || 0) * (parseFloat(inputs.odds2) > 0 ? 1 + parseFloat(inputs.odds2) / 100 : 1 + 100 / Math.abs(parseFloat(inputs.odds2)))).toFixed(2)}
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
                  ${parseFloat(inputs.totalWager || "0").toFixed(2)}
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

