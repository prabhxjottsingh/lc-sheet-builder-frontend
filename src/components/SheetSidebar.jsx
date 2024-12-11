import { Hash } from "lucide-react";
import React from "react";

const SheetSidebar = ({ sheetsMetadata, setSelectedSheet, selectedSheet }) => {
  return (
    <div className="w-16 bg-gray-950 flex flex-col items-center pt-4 space-y-2">
      {sheetsMetadata.map((sheet) => (
        <div
          key={sheet._id}
          onClick={() => setSelectedSheet(sheet)}
          className={`
              w-12 h-12 rounded-2xl flex items-center justify-center 
              cursor-pointer transition-all duration-200
              ${
                selectedSheet?._id === sheet._id
                  ? "bg-indigo-600 rounded-xl"
                  : "bg-gray-700 hover:bg-gray-600 hover:rounded-xl"
              }
            `}
        >
          <Hash className="w-6 h-6" />
        </div>
      ))}
      <div
        className={`
              w-12 h-12 rounded-2xl flex items-center justify-center 
              cursor-pointer transition-all duration-200
            `}
      >
        <Hash className="w-6 h-6" />
      </div>
    </div>
  );
};

export default SheetSidebar;
