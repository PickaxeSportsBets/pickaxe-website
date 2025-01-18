"use client";

import Header from "../components/header";

export default function TermsOfService() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark">
        <div className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6 py-8">
          <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
            <h1 className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark mb-8">
              Terms of Service and Disclaimer
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  By accessing or using this website and its services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  2. Purpose of the Software
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  Our software is designed to provide information and tools to identify plus EV (expected value) and arbitrage betting opportunities. The service is intended for informational purposes only and does not constitute financial, legal, or betting advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  3. No Guarantee of Profit
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  We strive to provide accurate and timely information; however, we do not guarantee the accuracy, completeness, or reliability of the data presented. Betting involves inherent risks, and past performance is not indicative of future results. Users are solely responsible for their betting decisions and any financial outcomes that may arise.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  4. Compliance with Local Laws
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  It is the user`&apos;`s responsibility to ensure compliance with all applicable laws and regulations in their jurisdiction. Some jurisdictions may prohibit or restrict sports betting and arbitrage activities. We do not condone or encourage the violation of any laws or regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  5. Limitation of Liability
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  Under no circumstances shall we be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our software or website, including but not limited to financial loss, legal consequences, or data inaccuracies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  6. Intellectual Property
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  All content, software, and materials on this website are the intellectual property of PickaxeBets and are protected by copyright and trademark laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  7. Privacy Policy
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  We value your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy for details on how we collect, use, and safeguard your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  8. Changes to Terms of Service
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  We reserve the right to update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes are posted constitutes acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-4">
                  9. Contact Information
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  If you have any questions or concerns about these Terms of Service, please contact us at{" "}
                  <a 
                    href="mailto:pickaxebets@gmail.com"
                    className="text-accent-green-light dark:text-accent-green-dark hover:text-accent-green-hover-light dark:hover:text-accent-green-hover-dark"
                  >
                    pickaxebets@gmail.com
                  </a>
                  .
                </p>
              </section>

              <div className="mt-12 p-6 bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg">
                <p className="text-negative-red-light dark:text-negative-red-dark font-medium">
                  Disclaimer: Betting involves significant risk, and users may lose money. Please gamble responsibly and seek help if you experience gambling-related issues. Visit{" "}
                  <a 
                    href="tel:1-800-GAMBLING"
                    className="underline hover:text-negative-red-hover-light dark:hover:text-negative-red-hover-dark"
                  >
                    1-800-GAMBLING
                  </a>
                  {" "}for support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}