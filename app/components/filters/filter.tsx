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
import { FilterState, BetTypes, initialFilterState } from "./filterFuncs";
import BookmakerLogos from "../bets/utils";

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

  const allBetTypes = Object.values(BetTypes);
  const allBookmakers = Object.keys(BookmakerLogos);

  const handleResetAll = () => {
    updateFilters({
      ...initialFilterState,
      isFilteringEnabled: false,
    });
    setSearchTerm("");
    onSearch("");
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    // Check if all bet types and bookmakers are selected
    const updatedFilters = { ...filters, ...newFilters };

    const allBetTypesSelected =
      allBetTypes.length === updatedFilters.betTypes?.length;
    const allBookmakersSelected =
      allBookmakers.length === updatedFilters.bookmakers?.length;
    const isAllDates = updatedFilters.date === "all";

    // If everything is selected, treat it as reset all
    if (allBetTypesSelected && allBookmakersSelected && isAllDates) {
      handleResetAll();
      return;
    }

    // Otherwise, update with filtering enabled
    updateFilters({
      ...newFilters,
      isFilteringEnabled: true,
    });
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark rounded-md hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark">
              <Filter className="w-5 h-5" />
              Filters {filters.isFilteringEnabled && "(Active)"}
            </button>
          </DialogTrigger>
          <DialogContent className="bg-primary-bg-light dark:bg-primary-bg-dark max-w-2xl">
            <DialogHeader>
              <DialogTitle>Filter Options</DialogTitle>
              <Button
                variant="outline"
                onClick={handleResetAll}
                className="flex items-center gap-2 px-4 py-2"
              >
                Reset All
              </Button>
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
                        handleFilterChange({
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

              {/* Bet Types Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Bet Types</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {allBetTypes.map((betType) => (
                    <div key={betType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`betType-${betType}`}
                        checked={filters.betTypes.includes(betType)}
                        onCheckedChange={(checked) => {
                          const newBetTypes = checked
                            ? [...filters.betTypes, betType]
                            : filters.betTypes.filter((b) => b !== betType);
                          handleFilterChange({ betTypes: newBetTypes });
                        }}
                      />
                      <Label
                        htmlFor={`betType-${betType}`}
                        className="text-sm cursor-pointer"
                      >
                        {betType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookmaker Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Bookmakers</Label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {allBookmakers.map((bookie) => (
                    <div key={bookie} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bookie-${bookie}`}
                        checked={filters.bookmakers.includes(bookie)}
                        onCheckedChange={(checked) => {
                          const newBookmakers = checked
                            ? [...filters.bookmakers, bookie]
                            : filters.bookmakers.filter((b) => b !== bookie);
                          handleFilterChange({ bookmakers: newBookmakers });
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchAndControls;
