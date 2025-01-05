import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [refreshSheetDetailBar, setRefreshSheetDetailBar] = useState(false);
  const [refreshSheetSidebar, setRefreshSheetSidebar] = useState(false);
  const [
    refreshSheetProblemsDataComponent,
    setRefreshSheetProblemsDataComponent,
  ] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const value = {
    refreshSheetDetailBar,
    setRefreshSheetDetailBar,

    refreshSheetSidebar,
    setRefreshSheetSidebar,

    refreshSheetProblemsDataComponent,
    setRefreshSheetProblemsDataComponent,

    currentUserId,
    setCurrentUserId,

    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
