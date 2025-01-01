import { Home, Notebook, Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import AddNewSheetModal from "./Modals/AddNewSheetModal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { constants } from "@/utils/constants";
import { useCookies } from "react-cookie";
import { toast } from "@/hooks/use-toast";
import { AppContext } from "@/lib/Appcontext";
import { AxiosGet } from "@/utils/axiosCaller";

const DynamicSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //users data
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];

  // Sidebar states
  const { refreshSheetSidebar } = useContext(AppContext);
  const [sheetsMetadata, setSheetsMetadata] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);

  // Modal Components states
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false);

  const handleAddSheetClick = () => {
    setIsAddSheetModalOpen(true);
  };

  const closeModal = () => {
    setIsAddSheetModalOpen(false);
  };

  const navigateToHome = () => {
    navigate("/home");
  };

  const navigateToSelectedSheet = (sheetId) => () => {
    navigate(`/sheet/${sheetId}`);
  };

  const fetchUsersSheetMetadata = async () => {
    try {
      const api = "api/sheet/getusersheetsmetadata";
      const response = await AxiosGet(api, {}, token);
      setSheetsMetadata(response.data.data || []);
    } catch (error) {
      console.error("Error while fetching sheets metadata: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while fetching sheets data. Please try again later.",
      });
    }
  };

  // Update selected sheet based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/home")) {
      setSelectedSheet(null);
    } else if (currentPath.includes("/sheet/")) {
      const sheetId = currentPath.split("/sheet/")[1];
      const sheet = sheetsMetadata.find((s) => s._id === sheetId);
      setSelectedSheet(sheet || null);
    }
  }, [location.pathname, sheetsMetadata]);

  useEffect(() => {
    fetchUsersSheetMetadata();
  }, [refreshSheetSidebar]);

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
        {/* Add New Sheet Button */}
        <Tooltip>
          <TooltipTrigger>
            <Avatar
              onClick={navigateToHome}
              className={`cursor-pointer transition-all duration-200 p-1 rounded-full
                ${
                  selectedSheet === null
                    ? "border-2 border-s-white"
                    : "bg-gray-800 hover:bg-gray-700 hover:border-gray-600"
                }
              `}
            >
              <AvatarFallback>
                <Home className="w-6 h-6 text-white-500" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{"Home"}</p>
          </TooltipContent>
          <Separator className="my-2" />
        </Tooltip>

        <h4 className="mb-4 text-sm font-medium leading-none">Sheets</h4>
        {/* Avatars */}
        {sheetsMetadata.map((sheet) => (
          <Tooltip key={sheet._id}>
            <TooltipTrigger>
              <Avatar
                onClick={navigateToSelectedSheet(sheet._id)}
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

export default DynamicSidebar;
