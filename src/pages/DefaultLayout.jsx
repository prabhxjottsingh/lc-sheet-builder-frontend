import React, { Suspense, useContext, useEffect, useState } from "react";
import SheetSidebar from "../components/sheetsidebar";
import { AxiosGet } from "@/utils/axiosCaller";
import { tempSheetsMetadata } from "@/lib/utils";
import { useCookies } from "react-cookie";
import ToastHandler from "@/utils/ToastHandler";
import { constants } from "@/utils/constants";
import { SheetDetailbar } from "./SheetDetailbar";
import { AppContext } from "@/lib/Appcontext";
import { useNavigate } from "react-router-dom";

const DefaultLayout = ({ children }) => (
    <div style={{ display: "flex" }}>
      {/* <SizeBar /> */}
      <main style={{ flex: 1, padding: "16px" }}>{children}</main>
    </div>
  );

export default DefaultLayout;
