import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface MarketOdds {
  link: string;
  decimal: number;
  american: number;
}

interface OddsData {
  [key: string]: MarketOdds;
}

interface MarketSide {
  odds: OddsData;
}

interface MarketData {
  over?: MarketSide;
  under?: MarketSide;
}

interface HistoricalDataEntry {
  timestamp: string;
  market_data: MarketData;
  team: string;
  market_point: number;
  odds?: number;
  [key: string]: any;
}

interface ProcessedDataEntry {
  timestamp: string;
  [bookmaker: string]: string | number;
}

interface OddsHistoryGraphProps {
  data: HistoricalDataEntry[];
  isOpen: boolean;
  onClose: () => void;
  side?: "over" | "under";
  isLoading?: boolean;
}

interface VisibleLines {
  [key: string]: boolean;
}

interface LegendEntry {
  dataKey: string;
  color: string;
  value: string;
  payload: {
    stroke: string;
  };
}

interface CustomLegendProps {
  payload?: LegendEntry[];
  onLegendClick: (entry: LegendEntry) => void;
  visibleLines: VisibleLines;
}

const OddsHistoryGraph: React.FC<OddsHistoryGraphProps> = ({
  data: rawData,
  isOpen,
  onClose,
  side = "over",
  isLoading = false,
}) => {
  const [visibleLines, setVisibleLines] = useState<VisibleLines>({});

  // Process data for the graph
  const processedData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];

    try {
      // Group data by full timestamp
      const groupedByTimestamp = rawData.reduce(
        (acc: { [key: string]: any }, entry) => {
          const timestamp = new Date(entry.timestamp);
          // Format with date and time
          const formattedTime = timestamp.toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          if (!acc[formattedTime]) {
            acc[formattedTime] = {};
          }

          // Add odds for this bookmaker at this timestamp
          acc[formattedTime][entry.bookmaker] = entry.odds;

          return acc;
        },
        {}
      );

      // Convert grouped data to array format for Recharts
      const timeSeriesData = Object.entries(groupedByTimestamp).map(
        ([timestamp, odds]) => ({
          timestamp,
          ...odds,
        })
      );

      // Sort by full timestamp
      return timeSeriesData.sort((a, b) => {
        // Parse the formatted timestamps back to Date objects for proper sorting
        const [monthA, dayA, timeA] = a.timestamp.split(/[\/\s]/);
        const [monthB, dayB, timeB] = b.timestamp.split(/[\/\s]/);

        const dateA = new Date(
          2025,
          parseInt(monthA) - 1,
          parseInt(dayA),
          ...timeA
            .replace(/(AM|PM)/, "")
            .trim()
            .split(":")
            .map((n: string) => parseInt(n))
        );
        if (timeA.includes("PM")) dateA.setHours(dateA.getHours() + 12);

        const dateB = new Date(
          2025,
          parseInt(monthB) - 1,
          parseInt(dayB),
          ...timeB
            .replace(/(AM|PM)/, "")
            .trim()
            .split(":")
            .map((n: string) => parseInt(n))
        );
        if (timeB.includes("PM")) dateB.setHours(dateB.getHours() + 12);

        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error("Error processing odds data:", error);
      return [];
    }
  }, [rawData]);

  // Get unique bookmakers for legend
  const availableBookmakers = useMemo(() => {
    if (!processedData.length) return [];

    const bookmakers = new Set<string>();
    processedData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "timestamp") {
          bookmakers.add(key);
          // Initialize visibility state for this bookmaker
          if (visibleLines[key] === undefined) {
            setVisibleLines((prev) => ({ ...prev, [key]: true }));
          }
        }
      });
    });

    return Array.from(bookmakers);
  }, [processedData, visibleLines]);

  // Calculate Y-axis domain based on all odds values
  const yAxisDomain = useMemo(() => {
    if (!processedData.length) return [-130, -100];

    let min = Infinity;
    let max = -Infinity;

    processedData.forEach((entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        if (key !== "timestamp" && typeof value === "number") {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [processedData]);

  // Handle loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="h-[calc(90vh-100px)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-secondary-text-light dark:text-secondary-text-dark" />
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Loading historical odds data...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle invalid data cases
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Data Available</DialogTitle>
            <DialogDescription>
              There is no historical odds data available for this selection.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const getLineColor = (bookmaker: string): string => {
    const colors: { [key: string]: string } = {
      betmgm: "hsl(var(--chart-1))",
      caesars: "hsl(var(--chart-2))",
      fanduel: "hsl(var(--chart-3))",
      pinnacle: "hsl(var(--chart-4))",
      betrivers: "hsl(var(--chart-5))",
      draftkings: "hsl(var(--chart-10))", // Reuse first color if needed
      "hard rock bet": "hsl(var(--chart-6))",
      "espn bet": "hsl(var(--chart-7))",
      fliff: "hsl(var(--chart-8))",
      fanatics: "hsl(var(--chart-9))",
    };
    return colors[bookmaker.toLowerCase()] || "hsl(var(--muted-foreground))";
  };

  const handleLegendClick = (entry: LegendEntry): void => {
    if (!entry?.dataKey) return;

    try {
      setVisibleLines((prev) => ({
        ...prev,
        [entry.dataKey]: !prev[entry.dataKey],
      }));
    } catch (error) {
      console.error("Error handling legend click:", error);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-primary-bg-light dark:bg-primary-bg-dark border border-border rounded-lg shadow-lg p-3">
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm font-medium mb-2">
          {label}
        </p>
        {payload
          .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))
          .map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 py-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm capitalize text-secondary-text-light dark:text-secondary-text-dark">
                {entry.name}:
              </span>
              <span
                className={`text-sm font-medium ${
                  entry.value >= 0
                    ? "text-accent-green-light dark:text-accent-green-dark"
                    : "text-negative-red-light dark:text-negative-red-dark"
                }`}
              >
                {entry.value >= 0 ? "+" : ""}
                {entry.value}
              </span>
            </div>
          ))}
      </div>
    );
  };

  const CustomLegend: React.FC<CustomLegendProps> = ({
    payload,
    onLegendClick,
    visibleLines,
  }) => {
    if (!payload) return null;

    return (
      <div className="flex flex-wrap gap-4 justify-center py-6">
        {payload.map((entry) => (
          <button
            key={entry.dataKey}
            onClick={() => onLegendClick(entry)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 
              ${
                visibleLines[entry.dataKey]
                  ? "bg-secondary-bg-light dark:bg-secondary-bg-dark hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark"
                  : "opacity-50 hover:opacity-75 bg-muted"
              }`}
          >
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium capitalize text-primary-text-light dark:text-primary-text-dark">
              {entry.dataKey}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {`${rawData[0]?.game} - ${rawData[0]?.market_type} ${rawData[0]?.market_point} Odds Movement`}
          </DialogTitle>
        </DialogHeader>

        <div className="h-[calc(90vh-100px)] bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                opacity={0.1}
              />
              <XAxis
                dataKey="timestamp"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-secondary-text-light dark:text-secondary-text-dark"
              />
              <YAxis
                domain={yAxisDomain}
                fontSize={12}
                stroke="currentColor"
                className="text-secondary-text-light dark:text-secondary-text-dark"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={
                  <CustomLegend
                    onLegendClick={handleLegendClick}
                    visibleLines={visibleLines}
                  />
                }
                verticalAlign="bottom"
                height={120}
              />
              {availableBookmakers.map((bookmaker) => (
                <Line
                  key={bookmaker}
                  type="monotone"
                  dataKey={bookmaker}
                  name={bookmaker}
                  stroke={getLineColor(bookmaker)}
                  strokeWidth={2}
                  dot={false}
                  opacity={visibleLines[bookmaker] ? 1 : 0.2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OddsHistoryGraph;
