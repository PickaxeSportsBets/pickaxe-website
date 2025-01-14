import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalculatorResult {
  bonusValue?: number;
  bet1Amount?: number;
  bet2Amount?: number;
  profitBet1Wins?: number;
  profitBet2Wins?: number;
  guaranteedProfit?: number;
  bet1Odds?: string;
  bet2Odds?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculatorResult;
  type: "risk-free" | "bonus";
  gameTitle?: string;
}

const CalculatorModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  result,
  type,
  gameTitle,
}) => {
  const [activeTab, setActiveTab] = useState("total");
  const [totalStake, setTotalStake] = useState("100");
  const [stake1, setStake1] = useState("");
  const [stake2, setStake2] = useState("");

  const calculatePayout = (stake: number, odds: number): number => {
    if (!stake || !odds) return 0;
    const decimalOdds = odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
    return stake * decimalOdds;
  };

  const calculateFromTotal = (total: number) => {
    if (type === "bonus") {
      const stake1 = result.bet1Amount || 0;
      const stake2 = result.bet2Amount || 0;
      const ratio = stake1 / (stake1 + stake2);
      return {
        stake1: (total * ratio).toFixed(2),
        stake2: (total * (1 - ratio)).toFixed(2),
      };
    }
    const totalAmount = (result.bet1Amount || 0) + (result.bet2Amount || 0);
    const ratio = (result.bet1Amount || 0) / totalAmount;
    return {
      stake1: (total * ratio).toFixed(2),
      stake2: (total * (1 - ratio)).toFixed(2),
    };
  };

  const handleTotalStakeChange = (value: string) => {
    setTotalStake(value);
    if (!isNaN(parseFloat(value))) {
      const { stake1, stake2 } = calculateFromTotal(parseFloat(value));
      setStake1(stake1);
      setStake2(stake2);
    }
  };

  const getPayout = (stake: any, odds: any) => {
    const numericOdds = parseInt(odds.replace("+", ""));
    const decimalOdds =
      numericOdds > 0 ? 1 + numericOdds / 100 : 1 + 100 / Math.abs(numericOdds);
    return (parseFloat(stake) * decimalOdds).toFixed(2);
  };

  // Calculate current stakes and profits
  const currentStake1 = parseFloat(stake1) || result.bet1Amount || 0;
  const currentStake2 = parseFloat(stake2) || result.bet2Amount || 0;
  const totalCurrentStake = currentStake1 + currentStake2;

  const payout1 = getPayout(currentStake1, result.bet1Odds);
  const payout2 = getPayout(currentStake2, result.bet2Odds);

  // Calculate guaranteed profit (minimum of the two scenarios)
  const profit1 = parseFloat(payout1) - totalCurrentStake;
  const profit2 = parseFloat(payout2) - totalCurrentStake;
  const guaranteedProfit = Math.min(profit1, profit2);
  const getColorClass = (value: number) => {
    if (value > 0) return "text-accent-green-light dark:text-accent-green-dark";
    if (value === 0) return "text-yellow-500";
    return "text-negative-red-light dark:text-negative-red-dark";
  };

  // Calculate ROI
  const roi =
    totalCurrentStake > 0 ? (guaranteedProfit / totalCurrentStake) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark">
            {gameTitle || "Calculator"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="total" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary-bg-light dark:bg-primary-bg-dark">
            <TabsTrigger value="total" onClick={() => setActiveTab("total")}>
              Total Stake
            </TabsTrigger>
            <TabsTrigger
              value="individual"
              onClick={() => setActiveTab("individual")}
            >
              Individual Stakes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="total" className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
                  Total Stake ($)
                </label>
                <input
                  type="number"
                  value={totalStake}
                  onChange={(e) => handleTotalStakeChange(e.target.value)}
                  className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="individual" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
                  Bet 1 Stake ($)
                </label>
                <input
                  type="number"
                  value={stake1}
                  onChange={(e) => setStake1(e.target.value)}
                  className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark"
                />
              </div>
              <div>
                <label className="block text-secondary-text-light dark:text-secondary-text-dark text-sm mb-2">
                  Bet 2 Stake ($)
                </label>
                <input
                  type="number"
                  value={stake2}
                  onChange={(e) => setStake2(e.target.value)}
                  className="w-full bg-primary-bg-light dark:bg-primary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded border border-secondary-text-light dark:border-secondary-text-dark"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-2 gap-6">
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
                    result.bet1Odds && parseInt(result.bet1Odds) >= 0
                      ? "text-accent-green-light dark:text-accent-green-dark"
                      : "text-negative-red-light dark:text-negative-red-dark"
                  }
                >
                  {result.bet1Odds}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Stake:
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${stake1 || result.bet1Amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Payout:
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${payout1}
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
                    result.bet2Odds && parseInt(result.bet2Odds) >= 0
                      ? "text-accent-green-light dark:text-accent-green-dark"
                      : "text-negative-red-light dark:text-negative-red-dark"
                  }
                >
                  {result.bet2Odds}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Stake:
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${stake2 || result.bet2Amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text-light dark:text-secondary-text-dark">
                  Payout:
                </span>
                <span className="text-primary-text-light dark:text-primary-text-dark">
                  ${payout2}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-profit-green-light bg-opacity-10 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Total Stake:
              </span>
              <span className="text-primary-text-light dark:text-primary-text-dark">
                ${totalCurrentStake.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                Guaranteed Profit:
              </span>
              <span className={getColorClass(guaranteedProfit)}>
                ${guaranteedProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-text-light dark:text-secondary-text-dark">
                ROI:
              </span>
              <span className={getColorClass(roi)}>{roi.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CalculatorCard = ({
  children,
  ...props
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
}>) => (
  <div
    className={`bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg p-6 ${props.className} cursor-pointer hover:bg-opacity-90`}
    onClick={props.onClick}
  >
    <div className="mb-6">
      <h2 className="text-primary-text-light dark:text-primary-text-dark text-xl font-medium mb-2">
        {props.title}
      </h2>
      {props.description && (
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
          {props.description}
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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCalculator, setCurrentCalculator] = useState<
    "risk-free" | "bonus"
  >("risk-free");
  const [currentResults, setCurrentResults] = useState<CalculatorResult>({});

  // Risk-Free Calculator State
  const [riskFreeInputs, setRiskFreeInputs] = useState({
    odds1: "",
    odds2: "",
    bonusAmount: "",
    estimatedBonusValue: "",
  });

  // Bonus Calculator State
  const [bonusInputs, setBonusInputs] = useState({
    bonusOddsPlus: "",
    bonusOddsMinus: "",
    bonusBetSize: "",
  });

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

    const results = {
      bonusValue: bonusValueDollars,
      bet1Amount,
      bet2Amount,
      profitBet1Wins: profitIfBet1Wins,
      profitBet2Wins: profitIfBet2Wins,
      guaranteedProfit: Math.min(profitIfBet1Wins, profitIfBet2Wins),
      bet1Odds: `${odds1 >= 0 ? "+" : ""}${odds1}`,
      bet2Odds: `${odds2}`,
    };

    setCurrentResults(results);
    setCurrentCalculator("risk-free");
    setModalOpen(true);
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

    const results = {
      bet1Amount: bonusSize,
      bet2Amount: hedgeBet,
      guaranteedProfit,
      bet1Odds: `+${plusOdds}`,
      bet2Odds: `${minusOdds}`,
    };

    setCurrentResults(results);
    setCurrentCalculator("bonus");
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
        {/* Initial Risk-Free Bet Calculator */}
        <CalculatorCard
          title="Initial Risk-Free Bet Hedge"
          description="Calculate optimal hedge for risk-free bet promotions"
          onClick={() => {
            if (Object.keys(currentResults).length > 0) {
              setCurrentCalculator("risk-free");
              setModalOpen(true);
            }
          }}
        >
          <div className="space-y-4">
            <Input
              label="Odds 1 (+)"
              type="number"
              placeholder="e.g., 200"
              value={riskFreeInputs.odds1}
              onChange={(e) =>
                setRiskFreeInputs((prev) => ({
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
              onChange={(e) =>
                setRiskFreeInputs((prev) => ({
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
              onChange={(e) =>
                setRiskFreeInputs((prev) => ({
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
              onChange={(e) =>
                setRiskFreeInputs((prev) => ({
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
          </div>
        </CalculatorCard>

        {/* Bonus Bet Calculator */}
        <CalculatorCard
          title="Bonus Bet Hedge"
          description="Calculate optimal hedge for bonus bet promotions"
          onClick={() => {
            if (Object.keys(currentResults).length > 0) {
              setCurrentCalculator("bonus");
              setModalOpen(true);
            }
          }}
        >
          <div className="space-y-4">
            <Input
              label="Odds 1 (+)"
              type="number"
              placeholder="e.g., 200"
              value={bonusInputs.bonusOddsPlus}
              onChange={(e) =>
                setBonusInputs((prev) => ({
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
              onChange={(e) =>
                setBonusInputs((prev) => ({
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
              onChange={(e) =>
                setBonusInputs((prev) => ({
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
          </div>
        </CalculatorCard>
      </div>

      <CalculatorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={currentResults}
        type={currentCalculator}
      />
    </div>
  );
};

export default CalculatorModal;
