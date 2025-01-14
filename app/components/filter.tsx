// components/filter/index.tsx
import { useState } from "react";
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
};

interface FilterControlsProps {
  onDateFilter: (value: string) => void;
  onMarketFilter: (value: string) => void;
  onBookieFilter: (value: string) => void;
}

export const FilterControls = ({
  onDateFilter,
  onMarketFilter,
  onBookieFilter,
}: FilterControlsProps) => {
  const dateOptions = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "week" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        onChange={(e) => onDateFilter(e.target.value)}
        className="bg-secondary-bg text-primary-text px-3 py-2 rounded-md"
      >
        {dateOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* <select
        onChange={(e) => onMarketFilter(e.target.value)}
        className="bg-secondary-bg text-primary-text px-3 py-2 rounded-md"
      >
        <option value="all">All Markets</option>
        {Object.entries(MarketTypeMapping).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select> */}

      <select
        onChange={(e) => onBookieFilter(e.target.value)}
        className="bg-secondary-bg text-primary-text px-3 py-2 rounded-md"
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
}

const SearchAndControls = ({
  onSearch,
  onRefresh,
  onDateFilter,
  onMarketFilter,
  onBookieFilter,
  loading,
}: SearchAndControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: any) => {
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
            className="w-full bg-secondary-bg text-primary-text px-4 py-2 rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-secondary-text" />
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-bg text-primary-text rounded-md hover:bg-opacity-80 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-bg text-primary-text rounded-md hover:bg-opacity-80"
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
        />
      )}
    </div>
  );
};

export default SearchAndControls;
