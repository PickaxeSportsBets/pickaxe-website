"use client";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/utilities/header";
import Head from "next/head";
//TODO 2: Make the routing so if you are not logged in, it will show you this page at /, and if you are logged in, it will show the dashboard (Middle ware, add this to the catchall routes thing)
export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-primary-text-light dark:text-primary-text-dark mb-6">
                Smart Betting,{" "}
                <span className="text-accent-green-light dark:text-accent-green-dark">
                  Smarter Profits
                </span>
              </h1>
              <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark max-w-2xl mx-auto mb-8">
                Discover profitable arbitrage opportunities and +EV bets across
                multiple sportsbooks in real-time.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 rounded-lg bg-button-green-light dark:bg-button-green-dark text-primary-text-light dark:text-primary-text-dark hover:bg-button-green-hover-light dark:hover:bg-button-green-hover-dark transition-colors font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary-bg-light dark:bg-secondary-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-primary-text-light dark:text-primary-text-dark mb-12">
              Why Choose Our Platform
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl bg-tertiary-bg-light dark:bg-tertiary-bg-dark">
                <div className="h-12 w-12 rounded-lg bg-accent-green-light dark:bg-accent-green-dark mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-2">
                  Real-Time Arbitrage
                </h3>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  Instantly spot profitable betting opportunities across
                  multiple sportsbooks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl bg-tertiary-bg-light dark:bg-tertiary-bg-dark">
                <div className="h-12 w-12 rounded-lg bg-market-purple-light dark:bg-market-purple-dark mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v4m-6-4v4m6-11v3m-6-3v3m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-2">
                  +EV Bet Finding
                </h3>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  Advanced algorithms to identify positive expected value bets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl bg-tertiary-bg-light dark:bg-tertiary-bg-dark">
                <div className="h-12 w-12 rounded-lg bg-profit-green-light dark:bg-profit-green-dark mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-2">
                  Profit Calculator
                </h3>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  Built-in tools to calculate potential returns and optimal bet
                  sizing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consulting Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-bg-light dark:bg-primary-bg-dark">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-primary-text-light dark:text-primary-text-dark">
                  Guaranteed Profits with Expert Consulting
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-accent-green-light dark:text-accent-green-dark"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark">
                      <span className="font-semibold text-primary-text-light dark:text-primary-text-dark">
                        Risk-Free Arbitrage:
                      </span>{" "}
                      We identify and execute guaranteed profit opportunities
                      across multiple sportsbooks
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-accent-green-light dark:text-accent-green-dark"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark">
                      <span className="font-semibold text-primary-text-light dark:text-primary-text-dark">
                        Data-Driven Approach:
                      </span>{" "}
                      All bets are backed by real-time data and mathematical
                      models
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-accent-green-light dark:text-accent-green-dark"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark">
                      <span className="font-semibold text-primary-text-light dark:text-primary-text-dark">
                        Personalized Strategy:
                      </span>{" "}
                      Custom betting plans tailored to your bankroll and risk
                      tolerance
                    </p>
                  </div>
                </div>
                <div className="bg-tertiary-bg-light dark:bg-tertiary-bg-dark p-6 rounded-xl mt-8">
                  <p className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-2">
                    What you'll get:
                  </p>
                  <ul className="space-y-2 text-secondary-text-light dark:text-secondary-text-dark">
                    <li>• 1-on-1 strategy session</li>
                    <li>• Personalized betting portfolio</li>
                    <li>• Ongoing support and optimization</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6 text-center md:text-left">
                <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark mb-4">
                    Book Your Free Strategy Call
                  </h3>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark mb-6">
                    Learn how we can help you generate consistent profits
                    through sports arbitrage betting.
                  </p>
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-profit-green-light dark:text-profit-green-dark">
                      Average client profit: $1,000 - $5,000 monthly
                    </p>
                    <Link
                      href="https://calendar.app.google/jFLtuY647wa5Z1Vh9"
                      target="_blank"
                      className="inline-block w-full px-8 py-4 rounded-lg bg-accent-green-light dark:bg-accent-green-dark text-white hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark transition-colors font-semibold"
                    >
                      Schedule Free Consultation
                    </Link>
                    <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                      Limited spots available. No obligation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-bg-light dark:bg-secondary-bg-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary-text-light dark:text-primary-text-dark mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark">
                Select the plan that best fits your betting strategy
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Email Plan */}
              <div className="bg-primary-bg-light dark:bg-primary-bg-dark rounded-xl p-8 shadow-lg border border-tertiary-bg-light dark:border-tertiary-bg-dark">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark mb-2">
                    Email Picks Plan
                  </h3>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark mb-4">
                    Daily handpicked opportunities
                  </p>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">
                      $10<span className="text-lg font-normal">/day</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">
                      $25<span className="text-lg font-normal">/week</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">
                      $50<span className="text-lg font-normal">/month</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Daily handpicked arbitrage opportunities
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    EV betting opportunities
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Weekly performance summary
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Direct email delivery
                  </li>
                </ul>
                <Link
                  href="/subscribe?plan=email"
                  className="block w-full py-3 px-4 text-center rounded-lg bg-secondary-bg-light dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark hover:bg-secondary-bg-hover-light dark:hover:bg-secondary-bg-hover-dark transition-colors font-semibold"
                >
                  Subscribe
                </Link>
              </div>

              {/* Software Plan */}
              <div className="bg-primary-bg-light dark:bg-primary-bg-dark rounded-xl p-8 shadow-lg border-2 border-accent-green-light dark:border-accent-green-dark relative">
                <div className="absolute top-0 right-0 bg-accent-green-light dark:bg-accent-green-dark text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                  RECOMMENDED
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark mb-2">
                    Software Plan (Standard)
                  </h3>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark mb-4">
                    Full platform access
                  </p>
                  <div className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark mb-2">
                    $75<span className="text-lg font-normal">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Full platform access
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlimited opportunities
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Real-time alerts
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Advanced filtering
                  </li>
                  <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                    <svg
                      className="w-5 h-5 mr-3 text-accent-green-light dark:text-accent-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personalized dashboard
                  </li>
                </ul>
                <Link
                  href="/subscribe?plan=software"
                  className="block w-full py-3 px-4 text-center rounded-lg bg-accent-green-light dark:bg-accent-green-dark text-white hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark transition-colors font-semibold"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark mb-8">
              Join thousands of smart bettors who are already maximizing their
              profits.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 rounded-lg bg-accent-green-light dark:bg-accent-green-dark text-white hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
