import React, { useContext, useEffect, useState } from "react";
import SheetSidebar from "../components/sheetsidebar";
import { AxiosGet } from "@/utils/axiosCaller";
import { tempSheetsMetadata } from "@/lib/utils";
import { useCookies } from "react-cookie";
import ToastHandler from "@/utils/ToastHandler";
import { constants } from "@/utils/constants";
import { SheetDetailbar } from "./SheetDetailbar";
import { AppContext } from "@/lib/Appcontext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const { refreshSheetSidebar, refreshSheetDetailBar } = useContext(AppContext);

  const [sheetsMetadata, setSheetsMetadata] = useState([]);
const [selectedSheet, setSelectedSheet] = useState(null);

  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];

  const fetchUsersSheetMetadata = async () => {
    try {
      const api = "api/sheet/getusersheetsmetadata";
      const response = await AxiosGet(api, {}, token);
      setSheetsMetadata(response.data.data);
      if (!selectedSheet) {
        setSelectedSheet(response.data.data[0]);
      } else {
        const prevSheet = selectedSheet;
        setSelectedSheet(null);
        setSelectedSheet(prevSheet);
      }
    } catch (error) {
      console.error("Error while fetching sheets metadata: ", error);
      ToastHandler.showCustom(
        "error",
        error?.response?.data?.message ||
          "Error while fetching sheets data. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchUsersSheetMetadata();
  }, [refreshSheetSidebar, refreshSheetDetailBar]);

  useEffect(() => {
    const isTokenMissing = !cookies[constants.COOKIES_KEY.AUTH_TOKEN];
    if (isTokenMissing) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sheets Sidebar */}
      <SheetSidebar
        sheetsMetadata={sheetsMetadata}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
      />

      {selectedSheet && <SheetDetailbar selectedSheet={selectedSheet} />}
    </div>
  );
};

export default Home;
