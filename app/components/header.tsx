import { useClerk, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./themeprovider";
export default function Header() {
  const { signOut } = useClerk();
  return (
    <header className="bg-secondary-bg-light dark:bg-secondary-bg-dark shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-1 text-center items-center justify-center">
            <Link
              href="/"
              className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark hover:text-accent-green-light dark:hover:text-accent-green-dark transition-colors"
            >
              Pickaxe
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton
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
