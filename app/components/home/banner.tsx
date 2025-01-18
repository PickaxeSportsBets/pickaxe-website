"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SubscriptionBanner = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-indigo-100 dark:bg-indigo-900 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p className="text-indigo-900 dark:text-indigo-100 font-medium text-center">
          Unlock premium features with a subscription
        </p>
        <div className="flex gap-4">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => (window.location.href = "/subscribe")}
          >
            View Plans
          </Button>
          <Button
            variant="ghost"
            className="text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
