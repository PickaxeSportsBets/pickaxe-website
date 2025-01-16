"use client";
import { useState } from "react";
import { Search, RefreshCw, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const BookmakerLogos: { [key: string]: any } = {
  betmgm: "betmgm",
  betrivers: "betRivers",
  caesars: "caesars",
  draftkings: "dk",
  espnbet: "espn",
  fanduel: "fanduel",
  hardrock: "hardrockBet",
  pinnacle: "pinnacle",
  underdog: "underDog",
};

// Combined market types from both EV and Arb data
const MarketTypes = [
  "h2h",
  "h2h_q1",
  "h2h_q2",
  "h2h_q3",
  "h2h_q4",
  "h2h_h1",
  "h2h_h2",
  "spreads",
  "spreads_q1",
  "spreads_q2",
  "spreads_q3",
  "spreads_q4",
  "spreads_h1",
  "spreads_h2",
  "totals",
  "totals_q1",
  "totals_q2",
  "totals_q3",
  "totals_q4",
  "totals_h1",
  "totals_h2",
  "player_prop",
  "alternate_spreads",
  "alternate_spreads_q1",
  "alternate_totals",
  "alternate_totals_q1",
];

const formatMarketType = (marketType: string) => {
  return marketType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("H2h", "Head to Head")
    .replace("Q", "Quarter ")
    .replace("H", "Half ");
};

interface FilterState {
  date: "all" | "today" | "tomorrow" | "week";
  bookmakers: string[];
  marketTypes: string[];
}

interface SearchAndControlsProps {
  onSearch: (value: string) => void;
  onRefresh: () => void;
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
  loading: boolean;
  isArbPage: boolean;
}

const SearchAndControls = ({
  onSearch,
  onRefresh,
  filters,
  updateFilters,
  loading,
  isArbPage,
}: SearchAndControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const dateOptions = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "week" },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark px-4 py-2 rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark rounded-md hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark rounded-md hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </DialogTrigger>
          <DialogContent className="bg-primary-bg-light dark:bg-primary-bg-dark max-w-2xl">
            <DialogHeader>
              <DialogTitle>Filter Options</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-base">Date Range</Label>
                <div className="grid grid-cols-4 gap-2">
                  {dateOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.date === option.value ? "default" : "outline"
                      }
                      onClick={() =>
                        updateFilters({
                          date: option.value as FilterState["date"],
                        })
                      }
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bookmaker Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Bookmakers</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ bookmakers: [] })}
                  >
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(BookmakerLogos).map((bookie) => (
                    <div key={bookie} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bookie-${bookie}`}
                        checked={filters.bookmakers.includes(bookie)}
                        onCheckedChange={(checked) => {
                          const newBookmakers = checked
                            ? [...filters.bookmakers, bookie]
                            : filters.bookmakers.filter((b) => b !== bookie);
                          updateFilters({ bookmakers: newBookmakers });
                        }}
                      />
                      <Label
                        htmlFor={`bookie-${bookie}`}
                        className="text-sm cursor-pointer"
                      >
                        {bookie.charAt(0).toUpperCase() + bookie.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Type Filter REACTIVATE WHEN FIXED*/}
              {/* <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Market Types</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ marketTypes: [] })}
                  >
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {MarketTypes.map((market) => (
                    <div key={market} className="flex items-center space-x-2">
                      <Checkbox
                        id={`market-${market}`}
                        checked={filters.marketTypes.includes(market)}
                        onCheckedChange={(checked) => {
                          const newMarkets = checked
                            ? [...filters.marketTypes, market]
                            : filters.marketTypes.filter((m) => m !== market);
                          updateFilters({ marketTypes: newMarkets });
                        }}
                      />
                      <Label
                        htmlFor={`market-${market}`}
                        className="text-sm cursor-pointer"
                      >
                        {formatMarketType(market)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchAndControls;
