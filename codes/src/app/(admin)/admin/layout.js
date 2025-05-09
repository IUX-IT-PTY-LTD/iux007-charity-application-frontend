import "../../../styles/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminProvider } from "@/components/admin/admin-context";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Charity Admin",
  description: "Developed By IUX IT Pty Ltd",
};

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased overflow-y-auto">
        <AdminProvider>
          <SidebarProvider
            defaultOpen={defaultOpen}
            style={{
              "--sidebar-width": "230px",
              "--sidebar-width-collapsed": "90px",
            }}
          >
            <AdminShell>{children}</AdminShell>
          </SidebarProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
