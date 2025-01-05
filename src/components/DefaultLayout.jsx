import { AppContext, AppProvider } from "@/lib/Appcontext";
import { AxiosGet } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useLocation } from "react-router-dom";
import { TooltipProvider } from "./ui/tooltip";
import Navbar from "./Navbar";
import DynamicSidebar from "./DynamicSidebar";
import { toast } from "@/hooks/use-toast";

const DefaultLayout = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-1 -mt-4">
          {/* Sidebar */}
          <aside>
            <DynamicSidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow content-container flex flex-col">
            <div key={location.pathname}>{children}</div>
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DefaultLayout;
