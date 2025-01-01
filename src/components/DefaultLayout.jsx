import { AppProvider } from "@/lib/Appcontext";
import React from "react";
import { TooltipProvider } from "./ui/tooltip";
import DynamicSidebar from "./DynamicSidebar";
import { Outlet, useLocation } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  const location = useLocation();

  return (
    <AppProvider>
      <TooltipProvider>
        <div className="layout-container flex h-screen">
          {/* Dynamic Sidebar */}
          <div className="sidebar-container">
            <DynamicSidebar />
          </div>
          {/* Content Container */}
          <div className="flex-grow content-container flex flex-col">
            {/* Ensuring children have unique key based on pathname to avoid rerendering issues */}
            <div key={location.pathname} className="w-full">
              {children}
            </div>
            <Outlet />
          </div>
        </div>
      </TooltipProvider>
    </AppProvider>
  );
};

export default DefaultLayout;
