// app/success/page.tsx
"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  // const searchParams = useSearchParams();
  // const sessionId = searchParams?.get("session_id");

  // useEffect(() => {
  //   // You could verify the session here if needed
  // }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Subscription Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for subscribing. Your account has been successfully
            upgraded.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
