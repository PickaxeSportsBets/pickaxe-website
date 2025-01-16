export interface FilterState {
  date: "all" | "today" | "tomorrow" | "week";
  bookmakers: string[];
  marketTypes: string[];
}

const initialFilterState: FilterState = {
  date: "all",
  bookmakers: [],
  marketTypes: [],
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

    // Market type filtering
    if (
      filters.marketTypes.length > 0 &&
      !filters.marketTypes.includes(bet.market_type)
    ) {
      return false;
    }

    // Bookmaker filtering
    if (filters.bookmakers.length > 0) {
      const mainBookmaker = bet.bookmaker?.toLowerCase();
      if (!filters.bookmakers.includes(mainBookmaker)) {
        // Check market_data for other bookmakers
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

    // Market type filtering
    if (
      filters.marketTypes.length > 0 &&
      !filters.marketTypes.includes(bet.market_type)
    ) {
      return false;
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
