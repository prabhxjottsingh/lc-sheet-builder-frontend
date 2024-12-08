import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
// import Dashboard from "./pages/Dashboard";
// import SheetView from "./pages/SheetView";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/" element={<Dashboard />} />
      <Route path="/sheet/:sheetId" element={<SheetView />} /> */}
    </Routes>
  </Router>
);

export default AppRouter;
