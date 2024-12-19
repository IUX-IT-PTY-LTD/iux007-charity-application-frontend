// dashboard layout
// ----------------------------------------------------------------------------

import React from "react";
import Head from "next/head";
import Link from "next/link";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/dashboard">Home</Link>
            </li>
            <li>
              <Link href="/dashboard/about">About</Link>
            </li>
            <li>
              <Link href="/dashboard/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2024 Charity Dashboard</p>
      </footer>
    </>
  );
};

export default DashboardLayout;
