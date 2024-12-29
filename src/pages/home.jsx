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

export const Home = () => {
  //to naivgate to selected sheet
  const navigate = useNavigate();

  //users data
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];

  //if any refresh is needed on the sidebar
  const { refreshSheetSidebar, refreshSheetDetailBar } = useContext(AppContext);

  // data to show to the user
  const [sheetsMetadata, setSheetsMetadata] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);

  const fetchUsersSheetMetadata = async () => {
    try {
      const api = "api/sheet/getusersheetsmetadata";
      const response = await AxiosGet(api, {}, token);
      const sheetsData = response.data.data;

      setSheetsMetadata(sheetsData);

      // Check if the selectedSheet exists in the fetched sheets
      const found = sheetsData.some(
        (sheetData) => sheetData._id === selectedSheet?._id
      );

      if (!found && sheetsData.length > 0) {
        setSelectedSheet(sheetsData[0]);
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
  }, [refreshSheetSidebar]);

  useEffect(() => {
    const isTokenMissing = !cookies[constants.COOKIES_KEY.AUTH_TOKEN];
    if (isTokenMissing) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex h-screen">
          <SheetSidebar
            sheetsMetadata={sheetsMetadata}
            selectedSheet={selectedSheet}
            setSelectedSheet={setSelectedSheet}
          />

          {selectedSheet && <SheetDetailbar selectedSheet={selectedSheet} />}
        </div>
      </Suspense>
    </>
  );
};

export default Home;
