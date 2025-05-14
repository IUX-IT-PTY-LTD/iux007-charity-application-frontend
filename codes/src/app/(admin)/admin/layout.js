import "../../../styles/globals.css";
import { AdminProvider } from "@/components/admin/admin-context";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";

export const metadata = {
  title: "Charity Admin",
  description: "Developed By IUX IT Pty Ltd",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.className}>
      <body className="bg-background text-foreground antialiased">
        <AdminProvider>
          <AdminShell>{children}</AdminShell>
          <Toaster />
        </AdminProvider>
      </body>
    </html>
  );
}
