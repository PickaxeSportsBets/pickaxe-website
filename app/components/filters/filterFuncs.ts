// filterFuncs.ts
export interface FilterState {
  date: "all" | "today" | "tomorrow" | "week";
  bookmakers: string[];
  marketTypes: string[];
  betTypes: string[];
}

const initialFilterState: FilterState = {
  date: "all",
  bookmakers: [],
  marketTypes: [],
  betTypes: [],
};

export const BetTypes = {
  PLAYER_PROPS: "Player Props",
  TEAM_TOTALS: "Team Totals",
  MONEY_LINES: "Money Lines",
  ALT_LINES: "Alternate Lines",
  SPREADS: "Spreads",
} as const;

const matchesMarketType = (marketType: string, betType: string): boolean => {
  const marketTypeLower = marketType.toLowerCase();
  switch (betType) {
    case BetTypes.PLAYER_PROPS:
      return marketTypeLower.includes("player prop");
    case BetTypes.TEAM_TOTALS:
      return marketTypeLower.includes("team_totals");
    case BetTypes.MONEY_LINES:
      return marketTypeLower.includes("h2h");
    case BetTypes.ALT_LINES:
      return marketTypeLower.includes("alternate");
    case BetTypes.SPREADS:
      return marketTypeLower.includes("spreads");
    default:
      return false;
  }
};

// Filter functions
const filterEvBets = (bets: any[], filters: FilterState) => {
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
    if (filters.betTypes.length > 0) {
      const marketType = bet.market_type || "";
      if (
        !filters.betTypes.some((betType) =>
          matchesMarketType(marketType, betType)
        )
      ) {
        return false;
      }
    }

    // Bookmaker filtering
    if (filters.bookmakers.length > 0) {
      const mainBookmaker = bet.bookmaker?.toLowerCase();
      if (!filters.bookmakers.includes(mainBookmaker)) {
        const marketData = bet.market_data || {};
        const hasMatchingBookmaker = Object.values(marketData).some(
          (side: any) => {
            const odds = side?.odds || {};
            return Object.keys(odds).some((bookie) =>
              filters.bookmakers.includes(bookie.toLowerCase())
            );
          }
        );
        if (!hasMatchingBookmaker) {
          return false;
        }
      }
    }

    return true;
  });
};

const filterArbBets = (bets: any[], filters: FilterState) => {
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
    if (filters.betTypes.length > 0) {
      const marketType = bet.market_type || "";
      if (
        !filters.betTypes.some((betType) =>
          matchesMarketType(marketType, betType)
        )
      ) {
        return false;
      }
    }

    // Bookmaker filtering
    if (filters.bookmakers.length > 0) {
      const team1Book = bet.team1_book?.toLowerCase();
      const team2Book = bet.team2_book?.toLowerCase();
      if (
        !filters.bookmakers.includes(team1Book) &&
        !filters.bookmakers.includes(team2Book)
      ) {
        return false;
      }
    }

    return true;
  });
};

export { initialFilterState, filterEvBets, filterArbBets };
