import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Home } from "./pages/Home";
import { SheetDetailbar } from "./pages/SheetDetailbar";
import DefaultLayout from "./components/DefaultLayout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/notauthorised"
          element={<div>You are not Authorised to view the data</div>}
        />

        {/* Routes with Shared Layout */}
        <Route element={<DefaultLayout />}>
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/sheet/:sheetId" element={<SheetDetailbar />} />
          </>
        </Route>

        {/* Catch-All for Invalid Routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
