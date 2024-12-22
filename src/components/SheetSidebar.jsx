import { Hash, Notebook, Plus } from "lucide-react";
import React, { useState } from "react";
import AddNewSheetModal from "./Modals/AddNewSheetModal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const SheetSidebar = ({ sheetsMetadata, setSelectedSheet, selectedSheet }) => {
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false);

  const handleAddSheetClick = () => {
    setIsAddSheetModalOpen(true);
  };

  const closeModal = () => {
    setIsAddSheetModalOpen(false);
  };

  return (
    <div
      className="w-20 h-screen flex flex-col items-center p-4 space-y-4 border-r border-gray-700 overflow-y-auto scrollbar-hide"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 #1f2937",
        overflowX: "hidden",
      }}
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Sheets</h4>
        {/* Avatars */}
        {sheetsMetadata.map((sheet) => (
          <Tooltip key={sheet._id}>
            <TooltipTrigger>
              <Avatar
                onClick={() => setSelectedSheet(sheet)}
                className={`cursor-pointer transition-all duration-200 p-1 rounded-full
            ${
              selectedSheet?._id === sheet._id
                ? "border-2 border-s-white"
                : "bg-gray-800 hover:bg-gray-700 hover:border-gray-600"
            }
          `}
              >
                <AvatarImage src="https://github.com/shvadcn.png" />
                <AvatarFallback>
                  <Notebook className="w-6 h-6 text-white" />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sheet.metadata.name}</p>
            </TooltipContent>
            <Separator className="my-2" />
          </Tooltip>
        ))}

        {/* Add New Sheet Button */}
        <Tooltip>
          <TooltipTrigger>
            <Avatar
              onClick={handleAddSheetClick}
              className={`cursor-pointer transition-all duration-200 p-1 rounded-full bg-gray-800 hover:bg-gray-700 hover:border-gray-600`}
            >
              <AvatarImage src="https://github.com/shvadcn.png" />
              <AvatarFallback>
                <Plus className="w-6 h-6 text-gray-500" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{"Add New Sheet"}</p>
          </TooltipContent>
          <Separator className="my-2" />
        </Tooltip>

        <AddNewSheetModal isOpen={isAddSheetModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default SheetSidebar;
