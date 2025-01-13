import { useClerk, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { signOut } = useClerk();
  return (
    <header className="bg-secondary-bg shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-1 text-center items-center justify-center">
            <Link
              href="/"
              className="text-3xl font-bold text-primary-text hover:text-accent-green transition-colors"
            >
              Pickaxe
            </Link>
          </div>
          <div className="flex items-center gap-4">
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
