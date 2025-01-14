"use client";
import { useState, useEffect } from "react";
import { Search, RefreshCw, Filter } from "lucide-react";

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

export const MarketTypeMapping: { [key: string]: string } = {
  h2h: "Head to Head",
  h2h_q1: "Quarter 1 Head to Head",
  h2h_q2: "Quarter 2 Head to Head",
  h2h_q3: "Quarter 3 Head to Head",
  h2h_q4: "Quarter 4 Head to Head",
  h2h_h1: "Half 1 Head to Head",
  h2h_h2: "Half 2 Head to Head",
  spreads: "Spread",
  spreads_q1: "Quarter 1 Spread",
  spreads_q2: "Quarter 2 Spread",
  spreads_q3: "Quarter 3 Spread",
  spreads_q4: "Quarter 4 Spread",
  spreads_h1: "Half 1 Spread",
  spreads_h2: "Half 2 Spread",
  totals: "Total Points",
  totals_q1: "Quarter 1 Total Points",
  totals_q2: "Quarter 2 Total Points",
  totals_q3: "Quarter 3 Total Points",
  totals_q4: "Quarter 4 Total Points",
  totals_h1: "Half 1 Total Points",
  totals_h2: "Half 2 Total Points",
  alternate_spreads: "Alternate Spread",
  alternate_spreads_q1: "Quarter 1 Alternate Spread",
  alternate_totals: "Alternate Total",
  alternate_totals_q1: "Quarter 1 Alternate Total",
  player_prop: "Player Prop",
  "Player Prop - Receptions": "Player Prop - Receptions",
};

// Create a reverse mapping for market types
const ReverseMarketMapping: { [key: string]: string } = Object.entries(
  MarketTypeMapping
).reduce((acc, [key, value]) => ({ ...acc, [value.toLowerCase()]: key }), {});

interface FilterControlsProps {
  onDateFilter: (value: string) => void;
  onMarketFilter: (value: string) => void;
  onBookieFilter: (value: string) => void;
  isArbPage: boolean;
}
export const FilterControls = ({
  onDateFilter,
  onMarketFilter,
  onBookieFilter,
  isArbPage,
}: FilterControlsProps) => {
  const dateOptions = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "week" },
  ];

  const selectClassName =
    "bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark px-3 py-2 rounded-md";

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        onChange={(e) => onDateFilter(e.target.value)}
        className={selectClassName}
      >
        {dateOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onMarketFilter(e.target.value)}
        className={selectClassName}
      >
        <option value="all">All Markets</option>
        {Object.entries(MarketTypeMapping).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onBookieFilter(e.target.value)}
        className={selectClassName}
      >
        <option value="all">All Bookmakers</option>
        {Object.keys(BookmakerLogos).map((bookie) => (
          <option key={bookie} value={bookie}>
            {bookie.charAt(0).toUpperCase() + bookie.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

interface SearchAndControlsProps {
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onDateFilter: (value: string) => void;
  onMarketFilter: (value: string) => void;
  onBookieFilter: (value: string) => void;
  loading: boolean;
  isArbPage: boolean;
}

const SearchAndControls = ({
  onSearch,
  onRefresh,
  onDateFilter,
  onMarketFilter,
  onBookieFilter,
  loading,
  isArbPage,
}: SearchAndControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

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

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark rounded-md hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <FilterControls
          onDateFilter={onDateFilter}
          onMarketFilter={onMarketFilter}
          onBookieFilter={onBookieFilter}
          isArbPage={isArbPage}
        />
      )}
    </div>
  );
};

export default SearchAndControls;
