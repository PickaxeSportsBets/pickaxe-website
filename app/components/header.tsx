import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-secondary-bg shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link
              href="/"
              className="text-2xl font-bold text-primary-text hover:text-accent-green transition-colors"
            >
              Pickaxe
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* <Link href="/account" className="text-secondary-text hover:text-primary-text transition-colors">
              Account
            </Link> */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
