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

interface HistoricalDataPoint {
  odds: number;
  team: string;
  bookmaker: string;
  timestamp: string;
  market_point: number;
}

interface HistoricalDataEntry {
  past_data: HistoricalDataPoint[];
  game: string;
  market_type: string;
  market_point: string | number;
  team: string;
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
      // Collect all timestamps and bookmakers
      const allTimestamps = new Set<string>();
      const bookmakers = new Set<string>();

      // Collect all past data points
      const allPastData: HistoricalDataPoint[] = [];
      rawData.forEach((entry) => {
        if (entry.past_data) {
          entry.past_data.forEach((point) => {
            allPastData.push(point);
            allTimestamps.add(point.timestamp);
            if (point.bookmaker) bookmakers.add(point.bookmaker);
          });
        }
      });

      // Sort timestamps chronologically
      const sortedTimestamps = Array.from(allTimestamps).sort();

      // Create data points for each timestamp
      const timeSeriesData = sortedTimestamps.map((timestamp) => {
        const dataPoint: any = {
          timestamp: new Date(timestamp).toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        };

        // Add odds for each bookmaker at this timestamp
        Array.from(bookmakers).forEach((bookmaker) => {
          const point = allPastData.find(
            (p) => p.timestamp === timestamp && p.bookmaker === bookmaker
          );
          if (point) {
            dataPoint[point.bookmaker] = point.odds;
          }
        });

        return dataPoint;
      });

      // Initialize visibility state for bookmakers
      Array.from(bookmakers).forEach((bookmaker) => {
        if (visibleLines[bookmaker] === undefined) {
          setVisibleLines((prev) => ({ ...prev, [bookmaker]: true }));
        }
      });

      return timeSeriesData;
    } catch (error) {
      console.error("Error processing odds data:", error);
      return [];
    }
  }, [rawData, visibleLines]);

  const availableBookmakers = useMemo(() => {
    if (!processedData.length) return [];
    const bookmakers = new Set<string>();
    processedData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "timestamp") {
          bookmakers.add(key);
        }
      });
    });
    return Array.from(bookmakers);
  }, [processedData]);

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

  const colors: { [key: string]: string } = {
    betmgm: "#D9A440", // Gold
    caesars: "#2F7ABF", // Blue
    fanduel: "#1493FF", // Light blue
    pinnacle: "#0E3042", // Dark blue
    betrivers: "#F60B0E", // Red
    draftkings: "#3CAC3B", // Green
    "hard rock bet": "#CD1332", // Red
    "espn bet": "#FF0000", // Red
    fliff: "#FF6B00", // Orange
    fanatics: "#041E42", // Navy blue
  };

  // Helper function to ensure color contrast
  const getLineColor = (bookmaker: string) => {
    const defaultColor = "#666666"; // Fallback color
    const color = colors[bookmaker.toLowerCase()] || defaultColor;

    // For dark colors, we can add some opacity to make them more visible
    if (color === "#000000" || color === "#041E42" || color === "#0E3042") {
      return `${color}CC`; // Add 80% opacity
    }

    return color;
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
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
              <span
                className={`text-sm font-medium ${
                  entry.value >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {entry.value >= 0 ? `+${entry.value}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
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
            {`${rawData[0]?.game} - ${rawData[0]?.market_type} ${rawData[0]?.market_point} ${rawData[0]?.team} Odds Movement`}
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
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: getLineColor(bookmaker),
                    stroke: getLineColor(bookmaker),
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: getLineColor(bookmaker),
                    stroke: "white",
                  }}
                  opacity={visibleLines[bookmaker] ? 1 : 0.2}
                  connectNulls={false}
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
