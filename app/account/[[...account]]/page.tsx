import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      <UserProfile />
    </div>
  );
}
