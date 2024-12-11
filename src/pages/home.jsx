import React, { useEffect, useState } from "react";
import SheetSidebar from "../components/SheetSidebar";
import SheetDetailbar from "../components/SheetDetailsbar";
import SheetdataComponent from "../components/SheetdataComponent";

export const Home = () => {
  const [sheetsMetadata, setSheetsMetadata] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);

  useEffect(() => {
    // Simulate an API call to fetch sheet metadata
    const tempSheetsMetadata = [
      {
        _id: 123,
        name: "Array Problems",
        description: "Easy and medium array problems.",
        categories: ["Easy", "Medium"],
        totalProblems: 50,
        solvedProblems: 20,
        problems: [
          { id: 1, title: "Two Sum", difficulty: "Easy" },
          { id: 2, title: "Maximum Subarray", difficulty: "Medium" },
        ],
      },
      {
        _id: 234,
        name: "Graph Problems",
        description: "Problems related to graphs and trees.",
        categories: ["Medium", "Hard"],
        totalProblems: 40,
        solvedProblems: 15,
        problems: [
          { id: 3, title: "Number of Islands", difficulty: "Medium" },
          { id: 4, title: "Word Ladder", difficulty: "Hard" },
        ],
      },
    ];
    setSheetsMetadata(tempSheetsMetadata);

    // Auto-select first sheet
    if (tempSheetsMetadata.length > 0) {
      setSelectedSheet(tempSheetsMetadata[0]);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sheets Sidebar */}
      <SheetSidebar
        sheetsMetadata={sheetsMetadata}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
      />

      {/* Sheet Details Sidebar */}
      {selectedSheet && <SheetDetailbar selectedSheet={selectedSheet} />}

      {/* Main Content Area */}
      {selectedSheet && <SheetdataComponent selectedSheet={selectedSheet} />}
    </div>
  );
};

export default Home;
