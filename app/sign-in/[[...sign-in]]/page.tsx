"use client";
import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 animate-subtle">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 bg-gray-900/30 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>

      <style jsx global>{`
        @keyframes subtle {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-subtle {
          animation: subtle 20s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
