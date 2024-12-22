import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Home } from "./pages/home";
import { AppProvider } from "./lib/Appcontext";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "./components/ui/tooltip";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          <AppProvider>
            <TooltipProvider>
              <Home />
            </TooltipProvider>
          </AppProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default AppRouter;
