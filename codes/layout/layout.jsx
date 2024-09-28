import Head from "next/head";
import styles from "./layout.module.css"; // You can use CSS modules or global CSS
// import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import RoundedHeader from "../components/rounded-header";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Donation</title>
        <meta name="description" content="Next.js website layout" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <RoundedHeader />

        <main>
          {children} {/* This will render the page content */}
        </main>

        <Footer />
      </div>
    </>
  );
}
