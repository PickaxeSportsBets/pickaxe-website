"use client";
import React from "react";
import {
  Activity,
  Calendar,
  Calculator,
  Users,
  Target,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/utilities/header";
import HeroImage from "@/public/images/landing/HeroImage.png";
import WhyChooseUs1 from "@/public/images/landing/WhyChooseUsBigImg.png";
import WhyChooseUs2 from "@/public/images/landing/WhyChooseUsSmallImg.png";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-text-light dark:text-primary-text-dark">
              Smart Betting,
              <br />
              <span className="text-accent-green-light dark:text-accent-green-dark">
                Smarter
              </span>{" "}
              Profits
            </h1>
            <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark mb-8">
              Discover profitable arbitrage opportunities and EV bets across
              multiple sports books in real-time with our platform.
            </p>
            <button
              onClick={() => router.push("/sign-up")}
              className="bg-accent-green-light dark:bg-accent-green-dark hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Get Started
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-accent-green-light/20 dark:border-accent-green-dark/20 shadow-xl">
            <Image
              src={HeroImage}
              alt="Hero Image"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary-text-light dark:text-primary-text-dark text-center">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-market-purple-light dark:bg-market-purple-dark p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                Real-time Arbitrage
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Instantly spot profitable opportunities across betting
                platforms.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-purple-500 p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                EV Bet Finding
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Advanced algorithms to identify positive expected value bets.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-emerald-500 p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                Profit Calculator
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Built-in tools to calculate potential returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preview Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="relative">
          <Image
            src={WhyChooseUs1}
            alt="Platform Interface"
            className="w-full rounded-xl shadow-2xl"
          />
          <div className="absolute -right-4 -bottom-4 md:right-12 md:top-1/4 w-full max-w-sm">
            <Image
              src={WhyChooseUs2}
              alt="Platform Detail"
              className="rounded-xl shadow-xl border-4 border-primary-bg-light dark:border-primary-bg-dark"
            />
          </div>
        </div>
      </div>

      {/* Consulting Section */}
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary-text-light dark:text-primary-text-dark text-center">
            Expert Consulting
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-cyan-500 p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                1-on-1 Session
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Immediate risk-free strategies in our expert session.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-red-500 p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                Personalized Strategy
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Custom betting plans tailored to your risk tolerance.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-primary-bg-light dark:bg-primary-bg-dark shadow-lg">
              <div className="bg-orange-500 p-4 rounded-lg w-14 h-14 mb-6 flex items-center justify-center">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-text-light dark:text-primary-text-dark">
                Ongoing Support
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark">
                Regular support and monitoring to ensure reliability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-tertiary-bg-light dark:bg-tertiary-bg-dark rounded-xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-text-light dark:text-primary-text-dark">
            Ready to Start?
          </h2>
          <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark mb-8">
            Book your free consultation and learn how we can help you achieve
            consistent profits.
          </p>
          <button className="bg-accent-green-light dark:bg-accent-green-dark hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark text-white px-8 py-4 rounded-lg font-medium text-lg mb-8 transition-colors">
            Schedule Free Call
          </button>
          <div className="text-secondary-text-light dark:text-secondary-text-dark">
            Average Monthly Profit
            <div className="text-profit-green-light dark:text-profit-green-dark text-2xl font-bold mt-2">
              $1,000 - $5,000
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-text-light dark:text-primary-text-dark text-center">
            Choose Your Plan
          </h2>
          <p className="text-xl text-secondary-text-light dark:text-secondary-text-dark mb-12 text-center max-w-2xl mx-auto">
            Select the plan that best fits your betting strategy, and get
            started today.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-primary-bg-light dark:bg-primary-bg-dark rounded-xl p-8 shadow-lg border border-tertiary-bg-light dark:border-tertiary-bg-dark">
              <h3 className="text-2xl font-bold mb-4">Email Picks Plan</h3>
              <div className="text-3xl font-bold mb-4">$10/day</div>
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
