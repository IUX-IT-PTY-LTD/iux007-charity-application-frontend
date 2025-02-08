import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Poppins } from "next/font/google";
import "../../styles/globals.css";

export const metadata = {
  title: "Charity",
  description: "Charity is Noble",
  icon: "/favicon.ico",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the weights you want to use
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
