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
// import Dashboard from "./pages/Dashboard";
// import SheetView from "./pages/SheetView";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<Dashboard />} />
      <Route path="/sheet/:sheetId" element={<SheetView />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default AppRouter;
