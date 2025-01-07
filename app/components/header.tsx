import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="text-xl font-bold text-black">
              Pickaxe
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              Account
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
    </header>
  );
}
