import React, { useState } from "react";
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
} from "@/components/ui/dialog";

interface MarketOdds {
  link: string;
  decimal: number;
  american: number;
}

interface MarketData {
  over?: {
    odds: {
      [key: string]: MarketOdds;
    };
  };
  under?: {
    odds: {
      [key: string]: MarketOdds;
    };
  };
}

interface HistoricalDataEntry {
  timestamp: string;
  market_data: MarketData;
  [key: string]: any;
}

interface ProcessedDataEntry {
  timestamp: string;
  [key: string]: string | number;
}

interface OddsHistoryGraphProps {
  data: HistoricalDataEntry[];
  isOpen: boolean;
  onClose: () => void;
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
  data,
  isOpen,
  onClose,
}) => {
  const [visibleLines, setVisibleLines] = useState<VisibleLines>({});

  const processData = (
    rawData: HistoricalDataEntry[]
  ): ProcessedDataEntry[] => {
    if (!rawData || !rawData.length) return [];

    return rawData.map((entry) => {
      const timestamp = new Date(entry.timestamp);
      const formattedTime = timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const processedEntry: ProcessedDataEntry = {
        timestamp: formattedTime,
      };

      // Add over odds for each bookmaker
      if (entry.market_data?.over?.odds) {
        Object.entries(entry.market_data.over.odds).forEach(
          ([bookmaker, data]) => {
            const key = `${bookmaker}_over`;
            processedEntry[key] = data.american;
            if (visibleLines[key] === undefined) {
              setVisibleLines((prev) => ({ ...prev, [key]: true }));
            }
          }
        );
      }

      // Add under odds for each bookmaker
      if (entry.market_data?.under?.odds) {
        Object.entries(entry.market_data.under.odds).forEach(
          ([bookmaker, data]) => {
            const key = `${bookmaker}_under`;
            processedEntry[key] = data.american;
            if (visibleLines[key] === undefined) {
              setVisibleLines((prev) => ({ ...prev, [key]: true }));
            }
          }
        );
      }

      return processedEntry;
    });
  };

  const processedData = processData(data);

  const getLines = (type: "over" | "under"): string[] => {
    if (!processedData.length) return [];

    const lines = new Set<string>();
    const firstEntry = processedData[0];

    Object.keys(firstEntry).forEach((key) => {
      if (key !== "timestamp" && key.includes(`_${type}`)) {
        lines.add(key);
      }
    });

    return Array.from(lines);
  };

  const getLineColor = (index: number): string => {
    const colors = [
      "#2563eb",
      "#dc2626",
      "#16a34a",
      "#9333ea",
      "#ea580c",
      "#0891b2",
      "#4f46e5",
      "#be123c",
    ];
    return colors[index % colors.length];
  };

  const handleLegendClick = (entry: LegendEntry): void => {
    setVisibleLines((prev) => ({
      ...prev,
      [entry.dataKey]: !prev[entry.dataKey],
    }));
  };

  const CustomLegend: React.FC<CustomLegendProps> = ({
    payload,
    onLegendClick,
    visibleLines,
  }) => {
    if (!payload) return null;

    return (
      <ul className="flex flex-wrap gap-4 justify-center py-6">
        {payload.map((entry) => (
          <li
            key={entry.dataKey}
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
            onClick={() => onLegendClick(entry)}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full transition-opacity duration-200 ${
                visibleLines[entry.dataKey] ? "opacity-100" : "opacity-30"
              }`}
              style={{ backgroundColor: entry.color }}
            />
            <span
              className={`text-sm transition-opacity duration-200 ${
                visibleLines[entry.dataKey] ? "opacity-100" : "opacity-30"
              }`}
            >
              {entry.dataKey.split("_")[0]}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderChart = (type: "over" | "under") => (
    <div className="h-[400px] mb-8">
      <h3 className="text-lg font-medium mb-4">{type.toUpperCase()} Odds</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
            interval={0}
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Legend
            content={
              <CustomLegend
                onLegendClick={handleLegendClick}
                visibleLines={visibleLines}
              />
            }
            verticalAlign="bottom"
            height={36}
          />
          {getLines(type).map((line, index) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              name={line.split("_")[0]}
              stroke={getLineColor(index)}
              strokeOpacity={visibleLines[line] ? 1 : 0.2}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Historical Odds Movement
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto p-4">
          {renderChart("over")}
          {renderChart("under")}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OddsHistoryGraph;
