import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./themeprovider";
import { useRouter } from "next/navigation";
import { CustomUserButton } from "../userButton";
export default function Header() {
  const { signOut } = useClerk();
  const router = useRouter();

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
            <CustomUserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
