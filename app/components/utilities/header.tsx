import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./themeprovider";
import { useRouter } from "next/navigation";
import { CustomUserButton } from "../userButton";
import { useUser } from "@clerk/nextjs";

export default function Header() {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="bg-secondary-bg-light dark:bg-secondary-bg-dark shadow-md">
      <nav className="max-w-[90%] mx-auto px-2 sm:px-4 lg:px-6">
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
            {isLoaded && user ? (
              <CustomUserButton />
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-lg bg-button-green-light dark:bg-button-green-dark text-white hover:bg-accent-green-hover-light dark:hover:bg-accent-green-hover-dark transition-colors text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
