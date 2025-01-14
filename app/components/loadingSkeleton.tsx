import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingSkeleton = () => {
  return Array(10)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="w-full py-4">
        <div className="rounded-lg overflow-hidden">
          <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left side */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="w-full md:w-20 text-center">
                  <Skeleton className="h-4 w-16 mx-auto mb-1 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-5 w-20 mx-auto bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                </div>
                <div className="text-center md:text-left">
                  <Skeleton className="h-4 w-48 mb-2 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-5 w-32 mb-1 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-4 w-24 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="text-center md:text-right w-full md:w-auto">
                  <Skeleton className="h-4 w-24 mb-2 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-5 w-32 mb-1 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-4 w-16 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                </div>
                <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
                  <Skeleton className="h-6 w-6 rounded bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-6 w-12 bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                  <Skeleton className="h-8 w-16 rounded bg-secondary-bg-hover-light dark:bg-secondary-bg-hover-dark" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
};

export default LoadingSkeleton;
