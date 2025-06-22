import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Sidebar } from "@/components/sidebar";
import { UserNav } from "@/components/user-nav";
import { ThemeProvider } from "@/components/theme-provider";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={user} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
} 