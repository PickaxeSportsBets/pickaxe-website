"use client";
import React, { useState } from "react";
import {
  Activity,
  Calendar,
  Calculator,
  Users,
  Target,
  Headphones,
  TableProperties,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/utilities/header";
import HeroImage from "@/public/images/landing/HeroImage.png";
import WhyChooseUs1 from "@/public/images/landing/WhyChooseUsBigImg.png";
import WhyChooseUs2 from "@/public/images/landing/WhyChooseUsSmallImg.png";
import Features from "@/public/images/landing/Features.png";

const LandingPage = () => {
  const router = useRouter();
  const [leftPricing, setLeftPricing] = useState("daily");
  const [rightPricing, setRightPricing] = useState("monthly");

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-gradient-to-br from-[#111928] via-[#1F2837] via-50% to-[#111928]">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - unchanged */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-text-light dark:text-white">
                Smart Betting,
                <br />
                <span className="text-emerald-500 dark:text-emerald-400">
                  Smarter
                </span>{" "}
                Profits
              </h1>
              <p className="text-xl text-secondary-text-light dark:text-gray-300 mb-8">
                Discover profitable arbitrage opportunities and +EV bets across
                multiple sports books in real-time with Pickaxe Sports.
              </p>
              <button
                onClick={() => router.push("/sign-up")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Right side - with responsive changes */}
            <div className="relative md:xl:translate-x-52 md:lg:translate-x-36 md:translate-x-24">
              {/* Gradient border - hidden on mobile */}
              <div className="hidden md:block absolute -inset-[15px] bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl"></div>

              {/* Image container - adjusted corners for mobile */}
              <div className="relative rounded-xl md:rounded-l-xl overflow-hidden">
                <Image
                  src={HeroImage}
                  alt="Pickaxe Sports Dashboard"
                  width={1920}
                  height={1440}
                  className="w-full h-auto"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="pt-16 md:pt-28 pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left side - Header and Description */}
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-primary-text-light dark:text-white">
                Why choose us?
              </h2>
              <p className="text-base md:text-lg text-secondary-text-light dark:text-gray-400">
                We get it—betting is tough. We find risk-free opportunities,
                turning odds into guaranteed profits.
              </p>
            </div>

            {/* Right side - Features */}
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-0">
              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-blue-500 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  Real-time Arbitrage
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Instantly spot profitable opportunities from multiple
                  bookmakers
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-purple-500 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <TableProperties className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  +EV Bet Finding
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Advanced algorithms to identify positive expected value bets
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-emerald-500 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  Profit Calculator
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Built-in tools to calculate potential returns and bankroll
                  monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preview Section */}
      <div className="container mx-auto px-4 md:px-0 relative">
        <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg">
          <Image
            src={Features}
            alt="Shows features of the Pickaxe Sports platform"
            width={1920}
            height={1080}
            className="w-full"
            quality={100}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      </div>

      {/* Consulting Section */}
      <div className="pt-16 md:pt-36 pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left side - Header and Description */}
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-primary-text-light dark:text-white">
                Expert consulting
              </h2>
              <p className="text-base md:text-lg text-secondary-text-light dark:text-gray-400">
                With expert consulting, guarantee profits with proven strategies
                and expert guidance.
              </p>
            </div>

            {/* Right side - Features */}
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-0">
              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-cyan-400 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <Users2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  1-on-1 Session
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Formulate risk-free strategies and make profit guarantee in
                  your 1-on-1 session
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-red-400 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  Personalized Strategy
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Custom betting plans tailored to your risk tolerance &
                  bankroll
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="bg-orange-400 p-4 rounded-lg w-14 h-14 mb-4 flex items-center justify-center">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-primary-text-light dark:text-white">
                  Ongoing Support
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-gray-400">
                  Ongoing support and optimization to ensure maximum profits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-12 md:pb-20">
        <div className="bg-slate-700/70 rounded-lg md:rounded-xl p-6 md:p-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            {/* Left side content */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">
                Ready to Start?
              </h2>
              <p className="text-gray-300 mb-4 md:mb-6 max-w-md text-base md:text-lg">
                Book your free consultation and learn how we can help you
                achieve consistent profits.
              </p>
              <button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors">
                Schedule Free Call
              </button>
            </div>

            {/* Right side - Profit display */}
            <div className="text-left md:text-right mt-6 md:mt-0">
              <div className="text-gray-300 text-sm mb-1">
                Average Monthly Profit
              </div>
              <div className="text-emerald-400 text-xl md:text-2xl font-mono">
                $1,000 - $5,000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-text-light dark:text-primary-text-dark">
            Get started
          </h2>
          <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark mb-12 max-w-2xl">
            Select the plan that best fits your betting strategy, and get
            started today.
          </p>

          {/* Pricing toggle tabs aligned with cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="flex items-center gap-2 mb-0 md:mb-4">
              <button
                onClick={() => setLeftPricing("daily")}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  leftPricing === "daily"
                    ? "text-gray-300 bg-slate-700"
                    : "text-gray-400 bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                Pay daily
              </button>
              <button
                onClick={() => setLeftPricing("weekly")}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  leftPricing === "weekly"
                    ? "text-gray-300 bg-slate-700"
                    : "text-gray-400 bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                Pay weekly
              </button>
              <button
                onClick={() => setLeftPricing("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  leftPricing === "monthly"
                    ? "text-gray-300 bg-slate-700"
                    : "text-gray-400 bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                Pay monthly
              </button>
            </div>

            {/* Right card toggles */}
            <div className="flex items-center gap-2">
              {/* <button
                onClick={() => setRightPricing("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  rightPricing === "monthly"
                    ? "text-gray-300 bg-slate-700"
                    : "text-gray-400 bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                Pay monthly
              </button>
              <button
                onClick={() => setRightPricing("yearly")}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  rightPricing === "yearly"
                    ? "text-gray-300 bg-slate-700"
                    : "text-gray-400 bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                Pay yearly
              </button> */}
            </div>
            <div className="bg-primary-bg-light dark:bg-primary-bg-dark rounded-xl p-8 shadow-lg border border-tertiary-bg-light dark:border-tertiary-bg-dark">
              <h3 className="text-2xl font-bold mb-4">Email Picks Plan</h3>
              <div className="text-3xl font-bold mb-4">
                {leftPricing === "daily"
                  ? "$10/day"
                  : leftPricing === "weekly"
                  ? "$25/week"
                  : "$50/month"}
              </div>
              <p className="text-secondary-text-light dark:text-secondary-text-dark mb-6">
                Best for beginners and casual betters.
              </p>
              <button className="w-full bg-gray-700 hover:bg-gray-600 transition-colors text-white px-6 py-3 rounded-md font-medium mb-6">
                Subscribe
              </button>
              <ul className="space-y-4">
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Daily hand-picked arbitrage opportunities
                </li>
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  EV betting opportunities
                </li>
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Weekly performance summaries
                </li>
              </ul>
            </div>
            <div className="bg-primary-bg-light dark:bg-primary-bg-dark rounded-xl p-8 shadow-lg border-2 border-accent-green-light dark:border-accent-green-dark relative">
              <div className="absolute top-4 right-4 bg-emerald-500 text-xs px-2 py-1 rounded">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Software Plan</h3>
              <div className="text-3xl font-bold mb-4">$75/month</div>
              <p className="text-secondary-text-light dark:text-secondary-text-dark mb-6">
                Best for serious and pro betters.
              </p>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-6 py-3 rounded-md font-medium mb-6">
                Subscribe
              </button>
              <ul className="space-y-4">
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Full platform access
                </li>
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Unlimited opportunities
                </li>
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Real-time alerts
                </li>
                <li className="flex items-center text-secondary-text-light dark:text-secondary-text-dark">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Personalized dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
