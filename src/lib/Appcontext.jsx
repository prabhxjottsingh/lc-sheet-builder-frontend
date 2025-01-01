import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [refreshSheetDetailBar, setRefreshSheetDetailBar] = useState(false);
  const [refreshSheetSidebar, setRefreshSheetSidebar] = useState(false);
  const [
    refreshSheetProblemsDataComponent,
    setRefreshSheetProblemsDataComponent,
  ] = useState(false);

  const value = {
    refreshSheetDetailBar,
    setRefreshSheetDetailBar,

    refreshSheetSidebar,
    setRefreshSheetSidebar,

    refreshSheetProblemsDataComponent,
    setRefreshSheetProblemsDataComponent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
