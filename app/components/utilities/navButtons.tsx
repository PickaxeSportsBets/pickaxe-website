import React from "react";

interface NavButtonsProps {
  currPage: string;
  setCurrPage: any;
  admin?: boolean;
  resetPageNumber: any;
}

const NavButtons: React.FC<NavButtonsProps> = ({
  currPage,
  setCurrPage,
  admin,
  resetPageNumber,
}) => {
  const buttonClass = (page: string): string => `
    px-2 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base w-full md:w-auto text-center whitespace-nowrap
    ${
      currPage === page
        ? "bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark"
        : "bg-secondary-bg-light dark:bg-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark"
    }
  `;

  return (
    <div className="flex flex-row gap-2 md:gap-4 mb-6 py-2 pr-2 md:py-4 md:pr-4 bg-primary-bg-light dark:bg-primary-bg-dark rounded-lg overflow-x-auto">
      <button
        onClick={() => {
          setCurrPage("EV");
          resetPageNumber();
        }}
        className={buttonClass("EV")}
      >
        +EV Bets
      </button>
      <button
        onClick={() => {
          setCurrPage("ARB");
          resetPageNumber();
        }}
        className={buttonClass("ARB")}
      >
        Arbitrage
      </button>

      {admin && (
        <button
          onClick={() => {
            setCurrPage("PROMOS");
            resetPageNumber();
          }}
          className={buttonClass("PROMOS")}
        >
          Calculator
        </button>
      )}
    </div>
  );
};

export default NavButtons;
