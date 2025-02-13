import React from 'react';
import { Activity, Calendar, Calculator, Users, Target, Headphones } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-cyan-500">P</div>
        <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors px-4 py-2 rounded-md">Login</button>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Betting,
              <br />
              <span className="text-emerald-500">Smarter</span> Profits
            </h1>
            <p className="text-gray-400 mb-8">
              Discover profitable arbitrage opportunities and EV bets across
              multiple sports books in real-time with our platform.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors px-6 py-3 rounded-md font-medium">
              Get Started
            </button>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/600/400"
              alt="Platform Preview"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Why choose us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Arbitrage</h3>
            <p className="text-gray-400">
              Instantly spot profitable opportunities across betting platforms.
            </p>
          </div>
          <div className="p-6">
            <div className="bg-purple-500 hover:bg-purple-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">EV Bet Finding</h3>
            <p className="text-gray-400">
              Advanced algorithms to identify positive expected value bets.
            </p>
          </div>
          <div className="p-6">
            <div className="bg-emerald-500 hover:bg-emerald-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profit Calculator</h3>
            <p className="text-gray-400">
              Built-in tools to calculate potential returns.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="container mx-auto px-4 py-16">
        <img 
          src="/api/placeholder/1200/600"
          alt="Platform Interface"
          className="w-full rounded-lg shadow-xl"
        />
      </div>

      {/* Expert Consulting Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Expert consulting</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="bg-cyan-500 hover:bg-cyan-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1-on-1 Session</h3>
            <p className="text-gray-400">
              Immediate risk-free strategies in our expert session.
            </p>
          </div>
          <div className="p-6">
            <div className="bg-red-500 hover:bg-red-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Strategy</h3>
            <p className="text-gray-400">
              Custom betting plans tailored to your risk tolerance.
            </p>
          </div>
          <div className="p-6">
            <div className="bg-orange-500 hover:bg-orange-600 transition-colors p-3 rounded-lg w-12 h-12 mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-gray-400">
              Regular support and monitoring to ensure reliability.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">
            Book your free consultation and learn how we can help you
            achieve consistent profits.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors px-6 py-3 rounded-md font-medium mb-6">
            Schedule Free Call
          </button>
          <div className="text-gray-400">
            Average Monthly Profit
            <div className="text-emerald-500 text-xl font-bold">
              $1,000 - $5,000
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Get started</h2>
        <p className="text-gray-400 mb-8">
          Select the plan that best fits your betting strategy, and get
          started today.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Email Picks Plan</h3>
            <div className="text-3xl font-bold mb-4">$10/day</div>
            <p className="text-gray-400 mb-6">
              Best for beginners and casual betters.
            </p>
            <button className="w-full bg-gray-700 hover:bg-gray-600 transition-colors text-white px-6 py-3 rounded-md font-medium mb-6">
              Subscribe
            </button>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Daily hand-picked arbitrage opportunities
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                EV betting opportunities
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Weekly performance summaries
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 relative">
            <div className="absolute top-4 right-4 bg-emerald-500 text-xs px-2 py-1 rounded">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-4">Software Plan</h3>
            <div className="text-3xl font-bold mb-4">$75/month</div>
            <p className="text-gray-400 mb-6">
              Best for serious and pro betters.
            </p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-6 py-3 rounded-md font-medium mb-6">
              Subscribe
            </button>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Full platform access
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Unlimited opportunities
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Real-time alerts
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Personalized dashboard
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;