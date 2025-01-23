"use client"

import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-bg-light dark:bg-secondary-bg-dark mt-auto">
      <div className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark">
              Pickaxe
            </h3>
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
              Sports betting analytics and tools for informed decisions.
            </p>
            <div className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
              <a
                href="mailto:pickaxebets@gmail.com"
                className="hover:text-accent-green-light dark:hover:text-accent-green-dark transition-colors"
              >
                pickaxebets@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-green-light dark:hover:text-accent-green-dark transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-green-light dark:hover:text-accent-green-dark transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Responsible Gaming */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark">
              Responsible Gambling
            </h3>
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
              If you or someone you know has a gambling problem and wants help:
            </p>
            <div className="space-y-2">
              <a
                href="tel:1-800-522-4700"
                className="block text-sm text-negative-red-light dark:text-negative-red-dark hover:text-negative-red-hover-light dark:hover:text-negative-red-hover-dark transition-colors"
              >
                Call 1-800-522-4700
              </a>
              <a
                href="https://www.ncpgambling.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-negative-red-light dark:text-negative-red-dark hover:text-negative-red-hover-light dark:hover:text-negative-red-hover-dark transition-colors"
              >
                Visit NCPG
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-tertiary-bg-light dark:border-tertiary-bg-dark">
          <p className="text-sm text-center text-secondary-text-light dark:text-secondary-text-dark">
            © {currentYear} Pickaxe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
