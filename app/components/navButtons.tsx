import React from "react";

interface NavButtonsProps {
  currPage: string;
  setCurrPage: any;
}

const NavButtons: React.FC<NavButtonsProps> = ({ currPage, setCurrPage }) => {
  const buttonClass = (page: string): string => `
    px-2 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base w-full md:w-auto text-center whitespace-nowrap
    ${
      currPage === page
        ? "bg-button-green text-primary-text"
        : "bg-secondary-bg text-secondary-text hover:bg-secondary-bg-hover"
    }
  `;

  return (
    <div className="flex flex-row gap-2 md:gap-4 mb-6 py-2 pr-2 md:py-4 md:pr-4 bg-primary-bg rounded-lg overflow-x-auto">
      <button onClick={() => setCurrPage("EV")} className={buttonClass("EV")}>
        +EV Bets
      </button>
      <button onClick={() => setCurrPage("ARB")} className={buttonClass("ARB")}>
        Arbitrage
      </button>
      <button
        onClick={() => setCurrPage("PROMOS")}
        className={buttonClass("PROMOS")}
      >
        Promotions
      </button>
    </div>
  );
};

export default NavButtons;
