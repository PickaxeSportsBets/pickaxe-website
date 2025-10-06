"use client";
import React, { useState } from "react";
import ArbitrageCalculator from "./arbitrageCalculator";

interface CalculatorResult {
  bonusValue?: number;
  bet1Amount?: number;
  bet2Amount?: number;
  profitBet1Wins?: number;
  profitBet2Wins?: number;
  guaranteedProfit?: number;
}

interface CalculatorProps {
  title: string;
  description?: string;
  className?: string;
}

interface RiskFreeInputs {
  odds1: string;
  odds2: string;
  bonusAmount: string;
  estimatedBonusValue: string;
}

interface BonusInputs {
  bonusOddsPlus: string;
  bonusOddsMinus: string;
  bonusBetSize: string;
}

const CalculatorCard: React.FC<React.PropsWithChildren<CalculatorProps>> = ({
  title,
  description,
  children,
  className,
}) => (
  <div
    className={`bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6 ${className}`}
  >
    <div className="mb-6">
      <h2 className="text-primary-text-light dark:text-primary-text-dark text-xl font-medium mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

const Input = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="mb-4">
    <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
      {label}
    </label>
    <input
      className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark focus:outline-none focus:border-accent-green-light dark:focus:border-accent-green-dark"
      {...props}
    />
  </div>
);

const ResultsPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 p-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg space-y-3">
    {children}
  </div>
);

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-secondary-text-light dark:text-secondary-text-dark">
      {label}
    </span>
    <span className="text-primary-text-light dark:text-primary-text-dark">
      {value}
    </span>
  </div>
);

const PromosCalculator = () => {
  // Initial Risk-Free Calculator State
  const [riskFreeInputs, setRiskFreeInputs] = useState<RiskFreeInputs>(() => {
    // Load saved values from localStorage or use defaults
    const savedValues = localStorage.getItem("riskFreeInputs");
    return savedValues
      ? JSON.parse(savedValues)
      : {
          odds1: "",
          odds2: "",
          bonusAmount: "",
          estimatedBonusValue: "",
        };
  });
  const [riskFreeResults, setRiskFreeResults] = useState<CalculatorResult>({});

  // Bonus Bet Calculator State
  const [bonusInputs, setBonusInputs] = useState<BonusInputs>(() => {
    // Load saved values from localStorage or use defaults
    const savedValues = localStorage.getItem("bonusInputs");
    return savedValues
      ? JSON.parse(savedValues)
      : {
          bonusOddsPlus: "",
          bonusOddsMinus: "",
          bonusBetSize: "",
        };
  });
  const [bonusResults, setBonusResults] = useState<CalculatorResult>({});

  // Save risk-free inputs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("riskFreeInputs", JSON.stringify(riskFreeInputs));
  }, [riskFreeInputs]);

  // Save bonus inputs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("bonusInputs", JSON.stringify(bonusInputs));
  }, [bonusInputs]);

  const calculateRiskFree = () => {
    const odds1 = parseFloat(riskFreeInputs.odds1);
    const odds2 = parseFloat(riskFreeInputs.odds2);
    const bonusAmount = parseFloat(riskFreeInputs.bonusAmount);
    const estimatedBonusValue = parseFloat(riskFreeInputs.estimatedBonusValue);

    if (!odds1 || !odds2 || !bonusAmount || !estimatedBonusValue) return;

    const bonusValueDollars = (bonusAmount * estimatedBonusValue) / 100;
    const bet1Amount = bonusAmount;
    const bet1Payout = bet1Amount * (1 + odds1 / 100);
    const bet2Amount = (bet1Payout - bonusValueDollars) / (1 - 100 / odds2);
    const bet2TotalPayout = bet2Amount * (1 - 100 / odds2);
    const profitIfBet1Wins = bet1Payout - bet1Amount - bet2Amount;
    const profitIfBet2Wins =
      bet2TotalPayout - bet2Amount - bet1Amount + bonusValueDollars;

    setRiskFreeResults({
      bonusValue: bonusValueDollars,
      bet1Amount,
      bet2Amount,
      profitBet1Wins: profitIfBet1Wins,
      profitBet2Wins: profitIfBet2Wins,
    });
  };

  const calculateBonus = () => {
    const plusOdds = parseFloat(bonusInputs.bonusOddsPlus);
    const minusOdds = parseFloat(bonusInputs.bonusOddsMinus);
    const bonusSize = parseFloat(bonusInputs.bonusBetSize);

    if (
      !plusOdds ||
      !minusOdds ||
      !bonusSize ||
      plusOdds <= 0 ||
      minusOdds >= 0
    )
      return;

    const plusOddsDecimal = 1 + plusOdds / 100;
    const minusOddsDecimal = 1 - 100 / minusOdds;
    const bonusBetProfit = bonusSize * plusOddsDecimal - bonusSize;
    const hedgeBet = bonusBetProfit / minusOddsDecimal;
    const guaranteedProfit = bonusSize * plusOddsDecimal - bonusSize - hedgeBet;

    setBonusResults({
      bet1Amount: bonusSize,
      bet2Amount: hedgeBet,
      guaranteedProfit,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
        {/* Initial Risk-Free Bet Calculator */}
        <CalculatorCard
          title="Initial Risk-Free Bet Hedge"
          description="Calculate optimal hedge for risk-free bet promotions"
        >
          <div className="space-y-4">
            <Input
              label="Odds 1 (+)"
              type="number"
              placeholder="e.g., 200"
              value={riskFreeInputs.odds1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRiskFreeInputs((prev: RiskFreeInputs) => ({
                  ...prev,
                  odds1: e.target.value,
                }))
              }
            />
            <Input
              label="Odds 2 (-)"
              type="number"
              placeholder="e.g., -200"
              value={riskFreeInputs.odds2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRiskFreeInputs((prev: RiskFreeInputs) => ({
                  ...prev,
                  odds2: e.target.value,
                }))
              }
            />
            <Input
              label="Bonus Amount ($)"
              type="number"
              placeholder="e.g., 500"
              value={riskFreeInputs.bonusAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRiskFreeInputs((prev: RiskFreeInputs) => ({
                  ...prev,
                  bonusAmount: e.target.value,
                }))
              }
            />
            <Input
              label="Estimated Bonus Value (%)"
              type="number"
              placeholder="e.g., 60"
              value={riskFreeInputs.estimatedBonusValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRiskFreeInputs((prev: RiskFreeInputs) => ({
                  ...prev,
                  estimatedBonusValue: e.target.value,
                }))
              }
            />

            <button
              onClick={calculateRiskFree}
              className="w-full bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark text-primary-text-light dark:text-primary-text-dark py-3 px-4 rounded transition-colors"
            >
              Calculate Initial Hedge
            </button>

            {Object.keys(riskFreeResults).length > 0 && (
              <ResultsPanel>
                <ResultRow
                  label="Estimated Bonus Value"
                  value={`$${riskFreeResults.bonusValue?.toFixed(2)}`}
                />
                <ResultRow
                  label="Bet Amount 1"
                  value={`$${riskFreeResults.bet1Amount?.toFixed(2)}`}
                />
                <ResultRow
                  label="Bet Amount 2"
                  value={`$${riskFreeResults.bet2Amount?.toFixed(2)}`}
                />
                <div className="mt-4 pt-4 border-t border-secondary-text-light dark:border-secondary-text-dark">
                  <div className="text-primary-text-light dark:text-primary-text-dark font-medium mb-3">
                    Profit Scenarios
                  </div>
                  <ResultRow
                    label={`If Bet 1 (+${riskFreeInputs.odds1}) wins`}
                    value={`$${riskFreeResults.profitBet1Wins?.toFixed(2)}`}
                  />
                  <ResultRow
                    label={`If Bet 2 (${riskFreeInputs.odds2}) wins`}
                    value={`$${riskFreeResults.profitBet2Wins?.toFixed(2)}`}
                  />
                </div>
              </ResultsPanel>
            )}
          </div>
        </CalculatorCard>

        {/* Bonus Bet Calculator */}
        <CalculatorCard
          title="Bonus Bet Hedge"
          description="Calculate optimal hedge for bonus bet promotions"
        >
          <div className="space-y-4 flex flex-col justify-around">
            <Input
              label="Odds 1 (+)"
              type="number"
              placeholder="e.g., 200"
              value={bonusInputs.bonusOddsPlus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBonusInputs((prev: BonusInputs) => ({
                  ...prev,
                  bonusOddsPlus: e.target.value,
                }))
              }
            />
            <Input
              label="Odds 2 (-)"
              type="number"
              placeholder="e.g., -200"
              value={bonusInputs.bonusOddsMinus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBonusInputs((prev: BonusInputs) => ({
                  ...prev,
                  bonusOddsMinus: e.target.value,
                }))
              }
            />
            <Input
              label="Bonus Bet Size ($)"
              type="number"
              placeholder="e.g., 500"
              value={bonusInputs.bonusBetSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBonusInputs((prev: BonusInputs) => ({
                  ...prev,
                  bonusBetSize: e.target.value,
                }))
              }
            />

            <button
              onClick={calculateBonus}
              className="w-full bg-button-green-light dark:bg-button-green-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark text-primary-text-light dark:text-primary-text-dark py-3 px-4 rounded transition-colors"
            >
              Calculate Bonus Bet Hedge
            </button>

            {Object.keys(bonusResults).length > 0 && (
              <ResultsPanel>
                <ResultRow
                  label={`Place bonus bet of (${bonusInputs.bonusOddsPlus})`}
                  value={`$${bonusResults.bet1Amount?.toFixed(2)}`}
                />
                <ResultRow
                  label={`Place hedge bet of (${bonusInputs.bonusOddsMinus})`}
                  value={`$${bonusResults.bet2Amount?.toFixed(2)}`}
                />
                <div className="mt-4 pt-4 border-t border-secondary-text-light dark:border-secondary-text-dark">
                  <ResultRow
                    label="Guaranteed Profit"
                    value={`$${bonusResults.guaranteedProfit?.toFixed(2)}`}
                  />
                </div>
              </ResultsPanel>
            )}
          </div>
        </CalculatorCard>

        {/* Arbitrage Calculator */}
        <CalculatorCard
          title="Arbitrage Calculator"
          description="Calculate optimal stakes for arbitrage opportunities"
          className="lg:col-span-1"
        >
          <ArbitrageCalculator />
        </CalculatorCard>
      </div>
    </div>
  );
};

export default PromosCalculator;
