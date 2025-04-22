"use client";
import React, { useState } from "react";
import {
  Activity,
  Calendar,
  DollarSign,
  Users,
  Target,
  Headphones,
  TableProperties,
  Users2,
  CheckCheck,
  Zap, 
  BarChart2,
  Award, 
  MessageSquare, 
  Briefcase, 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/utilities/header"
import HeroImage from "@/public/images/landing/HeroImage.png";
import FeaturesGraphic from "@/public/images/landing/Features.png";

const LandingPage = () => {
  const router = useRouter();
  const [emailPlanFrequency, setEmailPlanFrequency] = useState("monthly"); 

  const emailPlanPricing = {
    daily: { price: 10, unit: "day" },
    weekly: { price: 25, unit: "week" },
    monthly: { price: 50, unit: "month" },
  };

  const handleScheduleCall = () => {
    window.open("https://calendar.app.google/4dNj6An4JqBhCVYx9", "_blank");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-gradient-to-br from-[#111928] via-[#1F2837] via-60% to-[#111928] text-primary-text-light dark:text-primary-text-dark antialiased">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="z-10 relative text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 !leading-tight">
                Smart Betting,
                <br />
                <span className="text-accent-green-light dark:text-accent-green-dark">
                  Smarter
                </span>{" "}
                Profits.
              </h1>
              <p className="text-lg md:text-xl text-secondary-text-light dark:text-secondary-text-dark mb-10 max-w-lg mx-auto md:mx-0">
                Unlock profitable arbitrage opportunities and +EV bets in
                real-time across multiple sportsbooks with Pickaxe.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <button
                  onClick={handleScheduleCall}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-100 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                  Schedule a Demo
                </button>
                <button
                  onClick={handleSignUp}
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent-green-light dark:bg-accent-green-dark hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  <Users2 className="w-5 h-5 mr-2 flex-shrink-0" />
                  Go to Software
                </button>
              </div>
            </div>

            {/* Right side - Image (Preserving structure) */}
            <div className="relative md:xl:translate-x-52 md:lg:translate-x-36 md:translate-x-24">
              {/* Gradient border - hidden on mobile */}
              <div className="hidden md:block absolute -inset-4 bg-gradient-to-br from-blue-500 via-emerald-500 to-purple-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
              <div className="hidden md:block absolute -inset-3 bg-gradient-to-br from-blue-500 via-emerald-500 to-purple-600 rounded-2xl opacity-80 dark:opacity-70"></div>

              {/* Image container - adjusted corners for mobile */}
              <div className="relative rounded-xl md:rounded-l-xl overflow-hidden shadow-2xl">
                <Image
                  src={HeroImage}
                  alt="Pickaxe Sports Dashboard showing arbitrage opportunities"
                  width={1920}
                  height={1440}
                  className="w-full h-auto"
                  priority
                  quality={90} // Slightly reduced quality for performance if needed
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw" // Adjusted sizes
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section ("Why Choose Us?") */}
      <section className="py-16 md:py-24 bg-gray-100 dark:bg-[#1F2837]/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">
            {/* Left side - Header and Description */}
            <div className="lg:w-1/3 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Pickaxe?
              </h2>
              <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark">
                We analyze millions of odds points, finding you risk-managed
                opportunities to turn betting from a gamble into an investment.
              </p>
            </div>

            {/* Right side - Features Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
              {[
                {
                  icon: Zap,
                  title: "Real-time Arbitrage",
                  desc: "Instantly spot risk-free profit opportunities across dozens of bookmakers.",
                  color: "blue",
                },
                {
                  icon: BarChart2,
                  title: "+EV Betting Feed",
                  desc: "Access curated bets with positive expected value, identified by our algorithms.",
                  color: "purple",
                },
                {
                  icon: DollarSign,
                  title: "Integrated Tools",
                  desc: "Use built-in calculators and trackers to manage bets and maximize returns.",
                  color: "emerald",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-6 bg-primary-bg-light dark:bg-tertiary-bg-dark rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className={`p-3 rounded-full mb-4 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 inline-block`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Pickaxe in Action
          </h2>
          <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark mb-12 max-w-2xl mx-auto">
            Explore our intuitive dashboard designed for efficient betting and
            clear analysis.
          </p>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50 max-w-6xl mx-auto">
            <Image
              src={FeaturesGraphic} // Use the renamed import
              alt="Screenshot of the Pickaxe Sports platform dashboard showing features"
              width={1920}
              height={1080}
              className="w-full h-auto"
              quality={90}
              // priority // Only prioritize above-the-fold images
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px" // Example sizes
            />
          </div>
        </div>
      </section>

      {/* Consulting Section */}
      <section className="py-16 md:py-24 bg-gray-100 dark:bg-[#1F2837]/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">
            {/* Left side - Header and Description */}
            <div className="lg:w-1/3 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Expert Consulting Available
              </h2>
              <p className="text-lg text-secondary-text-light dark:text-secondary-text-dark">
                Go beyond the software. Get personalized, 1-on-1 guidance to
                develop guaranteed profit strategies tailored to you.
              </p>
              <button
                onClick={handleScheduleCall}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-accent-green-light dark:bg-accent-green-dark hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition-colors duration-300"
              >
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                Book a Consultation
              </button>
            </div>

            {/* Right side - Consulting Features Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
              {[
                {
                  icon: MessageSquare,
                  title: "1-on-1 Strategy Session",
                  desc: "Deep dive into risk-free strategies designed for your bankroll and goals.",
                  color: "cyan",
                },
                {
                  icon: Briefcase,
                  title: "Personalized Betting Plan",
                  desc: "Receive a custom betting roadmap tailored to your risk tolerance & objectives.",
                  color: "red",
                },
                {
                  icon: Headphones,
                  title: "Dedicated Ongoing Support",
                  desc: "Continuous guidance and optimization to ensure you stay profitable long-term.",
                  color: "orange",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-6 bg-primary-bg-light dark:bg-tertiary-bg-dark rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className={`p-3 rounded-full mb-4 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 inline-block`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Simplified & Merged with Consulting) */}
      {/* We already added a CTA button in the Consulting section, making this one potentially redundant or it can be repurposed */}
      {/* Example: Repurpose as a final reassurance / social proof element if needed */}
      {/* <div className="container mx-auto px-4 py-16 md:py-20"> ... </div> */}

      {/* Pricing Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-secondary-text-light dark:text-secondary-text-dark">
              Choose the plan that aligns with your betting goals. Start turning
              odds into opportunities today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Email Picks Plan Card */}
            <div className="bg-primary-bg-light dark:bg-tertiary-bg-dark rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700/50 flex flex-col transition-shadow hover:shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Email Picks Plan
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark mb-6 text-center flex-grow">
                Ideal for beginners and casual bettors wanting curated picks
                delivered.
              </p>

              {/* Frequency Toggle */}
              <div className="flex justify-center space-x-1 mb-6 bg-gray-200 dark:bg-slate-800 rounded-full p-1">
                {Object.keys(emailPlanPricing).map((planKey) => (
                  <button
                    key={planKey}
                    onClick={() => setEmailPlanFrequency(planKey)}
                    className={`w-full px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${
                      emailPlanFrequency === planKey
                        ? "bg-accent-green-light text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {planKey.charAt(0).toUpperCase() + planKey.slice(1)}
                  </button>
                ))}
              </div>
              <div className="text-4xl font-extrabold mb-6 text-center">
                ${emailPlanPricing[emailPlanFrequency as keyof typeof emailPlanPricing].price}
                <span className="text-base font-medium text-secondary-text-light dark:text-secondary-text-dark ml-1">
                  /
                  {emailPlanFrequency === "daily"
                    ? "day"
                    : emailPlanFrequency === "weekly"
                    ? "week"
                    : "mo"}
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "Hand-picked arbitrage opportunities",
                  "Top +EV betting opportunities",
                  "Delivered daily or weekly",
                  "Basic performance summaries",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-secondary-text-light dark:text-secondary-text-dark"
                  >
                    <CheckCheck className="w-5 h-5 text-accent-green-light dark:text-accent-green-dark mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-auto bg-gray-700 hover:bg-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors text-white px-6 py-3 rounded-lg font-medium"
                onClick={handleSignUp}
              >
                Subscribe to Email Picks
              </button>
            </div>

            {/* Software Plan Card (Highlighted) */}
            <div className="bg-primary-bg-light dark:bg-tertiary-bg-dark rounded-xl p-8 shadow-lg border-2 border-accent-green-light dark:border-accent-green-dark relative flex flex-col transition-shadow hover:shadow-2xl">
              <div className="absolute -top-3 -right-3 bg-accent-green-light dark:bg-accent-green-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-6">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Software Plan
              </h3>
              <p className="text-secondary-text-light dark:text-secondary-text-dark mb-6 text-center flex-grow">
                Full platform access for serious bettors seeking real-time data
                and tools.
              </p>

              {/* Static Price Display */}
              <div className="text-4xl font-extrabold mb-6 text-center">
                $75
                <span className="text-base font-medium text-secondary-text-light dark:text-secondary-text-dark ml-1">
                  /month
                </span>
              </div>
              <p className="text-xs text-center text-secondary-text-light dark:text-secondary-text-dark mb-6">
                (Billed monthly, cancel anytime)
              </p>

              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "Full Platform Access 24/7",
                  "Real-time Arbitrage Feed",
                  "Live +EV Betting Feed",
                  "Integrated Bet Calculators",
                  "Bankroll Tracking Tools",
                  "Customizable Filters & Alerts",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-secondary-text-light dark:text-secondary-text-dark"
                  >
                    <CheckCheck className="w-5 h-5 text-accent-green-light dark:text-accent-green-dark mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-auto bg-accent-green-light dark:bg-accent-green-dark hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors text-white px-6 py-3 rounded-lg font-medium"
                onClick={handleSignUp}
              >
                Get Full Access Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default LandingPage;
