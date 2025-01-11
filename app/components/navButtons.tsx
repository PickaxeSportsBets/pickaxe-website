import React from "react";

interface NavButtonsProps {
  currPage: string;
  setCurrPage: any;
}

const NavButtons: React.FC<NavButtonsProps> = ({ currPage, setCurrPage }) => {
  const buttonClass = (page: string): string => `
    px-4 py-2 rounded-lg font-medium transition-all duration-200
    ${
      currPage === page
        ? "bg-button-green text-primary-text"
        : "bg-secondary-bg text-secondary-text hover:bg-opacity-80"
    }
  `;

  return (
    <div className="flex gap-4 mb-6 py-4 bg-primary-bg rounded-lg">
      <button onClick={() => setCurrPage("EV")} className={buttonClass("EV")}>
        EV Bets
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
