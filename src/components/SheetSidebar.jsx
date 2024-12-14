import { Hash, Plus } from "lucide-react";
import React, { useState } from "react";
import AddNewSheetModal from "./Modals/AddNewSheetModal";

const SheetSidebar = ({ sheetsMetadata, setSelectedSheet, selectedSheet }) => {
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false);

  const handleAddSheetClick = () => {
    setIsAddSheetModalOpen(true);
  };

  const closeModal = () => {
    setIsAddSheetModalOpen(false);
  };

  return (
    <div className="w-16 flex flex-col items-center pt-4 space-y-2">
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

      {/* Add New Sheet Button */}
      <div
        onClick={handleAddSheetClick}
        className={`
              w-12 h-12 rounded-2xl flex items-center justify-center 
              cursor-pointer transition-all duration-200 bg-gray-700 hover:bg-gray-600 hover:rounded-xl
            `}
      >
        <Plus className="w-6 h-6" />
      </div>

      {/* Add New Sheet Modal */}
      {isAddSheetModalOpen && <AddNewSheetModal onClose={closeModal} />}
    </div>
  );
};

export default SheetSidebar;
