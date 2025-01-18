"use client";

import Header from "../components/header";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark">
        <div className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6 py-8">
          <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
            <div className="space-y-6">
              <div className="mb-12">
                <h1 className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark">
                  Privacy Policy
                </h1>
                <p className="text-secondary-text-light dark:text-secondary-text-dark mt-2">
                  Last updated: January 17, 2025
                </p>
              </div>

              <div className="text-secondary-text-light dark:text-secondary-text-dark space-y-4">
                <p>
                  This Privacy Policy describes Our policies and procedures on
                  the collection, use and disclosure of Your information when
                  You use the Service and tells You about Your privacy rights
                  and how the law protects You.
                </p>
                <p>
                  We use Your Personal data to provide and improve the Service.
                  By using the Service, You agree to the collection and use of
                  information in accordance with this Privacy Policy.
                </p>
              </div>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-primary-text-light dark:text-primary-text-dark mt-8">
                  Interpretation and Definitions
                </h2>

                <div>
                  <h3 className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                    Interpretation
                  </h3>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark">
                    The words of which the initial letter is capitalized have
                    meanings defined under the following conditions. The
                    following definitions shall have the same meaning regardless
                    of whether they appear in singular or in plural.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                    Definitions
                  </h3>
                  <ul className="space-y-4 list-none pl-0">
                    {[
                      {
                        term: "Account",
                        definition:
                          "means a unique account created for You to access our Service or parts of our Service.",
                      },
                      {
                        term: "Company",
                        definition:
                          '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Pickaxe LLC, 2821 Montclair Dr.',
                      },
                      {
                        term: "Cookies",
                        definition:
                          "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                      },
                      // ... other definitions
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="bg-secondary-bg-light dark:bg-secondary-bg-dark p-4 rounded-lg"
                      >
                        <strong className="text-primary-text-light dark:text-primary-text-dark block mb-2">
                          {item.term}
                        </strong>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">
                          {item.definition}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-primary-text-light dark:text-primary-text-dark mt-8">
                  Collecting and Using Your Personal Data
                </h2>

                <div>
                  <h3 className="text-xl font-medium text-primary-text-light dark:text-primary-text-dark mb-4">
                    Types of Data Collected
                  </h3>

                  <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark p-6 rounded-lg space-y-4">
                    <h4 className="text-lg font-medium text-primary-text-light dark:text-primary-text-dark">
                      Personal Data
                    </h4>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark">
                      While using Our Service, We may ask You to provide Us with
                      certain personally identifiable information that can be
                      used to contact or identify You. Personally identifiable
                      information may include, but is not limited to:
                    </p>
                    <ul className="list-disc pl-6 text-secondary-text-light dark:text-secondary-text-dark">
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Usage Data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Additional sections would follow the same pattern */}

              <section className="mt-12">
                <h2 className="text-2xl font-semibold text-primary-text-light dark:text-primary-text-dark mb-6">
                  Contact Us
                </h2>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  If you have any questions about this Privacy Policy, You can
                  contact us by email:{" "}
                  <a
                    href="mailto:pickaxebets@gmail.com"
                    className="text-accent-green-light dark:text-accent-green-dark hover:text-accent-green-hover-light dark:hover:text-accent-green-hover-dark"
                  >
                    pickaxebets@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
