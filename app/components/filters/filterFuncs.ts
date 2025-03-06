import BookmakerLogos from "../bets/utils";
export interface FilterState {
  date: "all" | "today" | "tomorrow" | "week";
  bookmakers: string[];
  betTypes: string[];
  isFilteringEnabled: boolean; // New flag to track if filtering is active
}

export const BetTypes = {
  PLAYER_PROPS: "Player Props",
  MONEYLINES: "Moneylines",
  SPREADS: "Spreads",
  TOTALS: "Totals",
  // ALTERNATE_LINES: "Alternate Lines",
} as const;



// Initialize with no filtering active
export const initialFilterState: FilterState = {
  date: "all",
  bookmakers: Object.keys(BookmakerLogos),
  betTypes: Object.values(BetTypes),
  isFilteringEnabled: false,
};

const matchesMarketType = (marketType: string, betType: string): boolean => {
  const marketTypeLower = marketType.toLowerCase();

  switch (betType) {
    case BetTypes.PLAYER_PROPS:
      return marketTypeLower.includes("player");
    case BetTypes.MONEYLINES:
      return marketTypeLower.includes("h2h");
    case BetTypes.SPREADS:
      return marketTypeLower.includes("spread");
    case BetTypes.TOTALS:
      return marketTypeLower.includes("total");
    // case BetTypes.ALTERNATE_LINES:
    //   return marketTypeLower.includes("alternate");
    default:
      return false;
  }
};

// Filter functions for EV bets
export const filterEvBets = (bets: any[], filters: FilterState) => {
  // If filtering is not enabled, return all bets
  if (!filters.isFilteringEnabled) {
    return bets;
  }

  return bets.filter((bet) => {
    // Date filtering
    if (filters.date !== "all") {
      const now = new Date();
      const betDate = new Date(bet.commence_time);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekLater = new Date(now);
      weekLater.setDate(weekLater.getDate() + 7);

      if (
        filters.date === "today" &&
        betDate.toDateString() !== now.toDateString()
      ) {
        return false;
      }
      if (
        filters.date === "tomorrow" &&
        betDate.toDateString() !== tomorrow.toDateString()
      ) {
        return false;
      }
      if (filters.date === "week" && betDate > weekLater) {
        return false;
      }
    }

    // Bet type filtering
    const marketType = bet.market_type || "";
    if (
      !filters.betTypes.some((betType) =>
        matchesMarketType(marketType, betType)
      )
    ) {
      return false;
    }

    // Bookmaker filtering
    const mainBookmaker = bet.bookmaker?.toLowerCase();
    if (!filters.bookmakers.includes(mainBookmaker)) {
      return false;
    }

    return true;
  });
};

// Filter functions for arbitrage bets
export const filterArbBets = (bets: any[], filters: FilterState) => {
  // If filtering is not enabled, return all bets
  if (!filters.isFilteringEnabled) {
    return bets;
  }

  return bets.filter((bet) => {
    // Date filtering
    if (filters.date !== "all") {
      const now = new Date();
      const betDate = new Date(bet.commence_time);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekLater = new Date(now);
      weekLater.setDate(weekLater.getDate() + 7);

      if (
        filters.date === "today" &&
        betDate.toDateString() !== now.toDateString()
      ) {
        return false;
      }
      if (
        filters.date === "tomorrow" &&
        betDate.toDateString() !== tomorrow.toDateString()
      ) {
        return false;
      }
      if (filters.date === "week" && betDate > weekLater) {
        return false;
      }
    }

    // Bet type filtering
    const marketType = bet.market_type || "";
    if (
      !filters.betTypes.some((betType) =>
        matchesMarketType(marketType, betType)
      )
    ) {
      return false;
    }

    // Bookmaker filtering
    const team1Book = bet.team1_book?.toLowerCase();
    const team2Book = bet.team2_book?.toLowerCase();

    // If only one bookmaker is selected, show all bets where that bookmaker appears
    if (filters.bookmakers.length === 1) {
      const selectedBookmaker = filters.bookmakers[0];
      return team1Book === selectedBookmaker || team2Book === selectedBookmaker;
    }

    // If multiple bookmakers are selected, both bookmakers must be from the selected list
    return filters.bookmakers.includes(team1Book) && filters.bookmakers.includes(team2Book);
  });
};
