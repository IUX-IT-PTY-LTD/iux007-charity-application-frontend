"use client";

import React, { createContext, useContext, useState } from "react";

// Create context
const AdminContext = createContext({
  pageTitle: "Dashboard",
  setPageTitle: () => {},
  pageSubtitle: "",
  setPageSubtitle: () => {},
});

// Hook to use the admin context
export const useAdminContext = () => useContext(AdminContext);

// Provider component
export const AdminProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [pageSubtitle, setPageSubtitle] = useState("");

  const value = {
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
