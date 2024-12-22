import {
  BookOpen,
  ChartColumn,
  ChevronDown,
  Dot,
  LucideTrash,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Star,
  Trash,
  Trash2Icon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ToastHandler from "@/utils/ToastHandler";
import { AxiosDelete, AxiosGet, AxiosPost } from "@/utils/axiosCaller";
import { useCookies } from "react-cookie";
import { constants } from "@/utils/constants";
import { AppContext } from "@/lib/Appcontext";
import SheetdataComponent from "@/components/SheetdataComponent";
import AddNewCategoryModal from "@/components/Modals/AddNewCategoryModal";
import ConfirmationModal from "@/components/Modals/ConfrimationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const SheetDetailbar = ({ selectedSheet }) => {
  const { refreshSheetDetailBar, setRefreshSheetDetailBar } =
    useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [sheetDetails, setSheetDetails] = useState({});
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const handleAddCategoryClick = () => {
    setIsAddCategoryModalOpen(true);
  };

  const closeModal = () => {
    setIsAddCategoryModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = ToastHandler.showLoading("Deleting... Please wait.");
    try {
      const queryParams = { sheetId: selectedSheet._id };
      const api = "api/sheet/deletesheet";
      await AxiosDelete(api, queryParams, token);
      setRefreshSheetDetailBar((prev) => !prev);
      closeModal();
      ToastHandler.showSuccess(
        "Sheet fetched successfully successfully!",
        loadingToast
      );
    } catch (error) {
      console.error("Error while deleting sheet: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while deleting sheet. Please try again later.",
        loadingToast
      );
    }
  };

  const fetchCategoryBySheetMetaData = async () => {
    const loadingToast = ToastHandler.showLoading(
      "Fetching category data... Please wait."
    );
    try {
      const queryParams = { sheetId: selectedSheet._id };
      const api = "api/category/getcategoriesbysheetid";
      const response = await AxiosGet(api, queryParams, token);

      const categoryIdsMetadata = response.data.data.map(
        (categoryMetadata) => ({
          ...categoryMetadata.metadata,
          _id: categoryMetadata._id,
        })
      );
      setCategories(categoryIdsMetadata);
      ToastHandler.showSuccess(
        "Category data fetched successfully successfully!",
        loadingToast
      );

      setSheetDetails((prev) => ({
        sheetName: selectedSheet?.metadata?.name || "Sheet Name is Not Defined",
        sheetDescription:
          selectedSheet?.metadata?.description ||
          "Sheet Description is Not Defined",
        categories: categoryIdsMetadata || [],
      }));
    } catch (error) {
      console.error("Error while fetching Category metadata: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while fetching Category data. Please try again later.",
        loadingToast
      );
    }
  };

  useEffect(() => {
    fetchCategoryBySheetMetaData();
  }, [selectedSheet, refreshSheetDetailBar]);

  // Calculate the progress percentage
  //   useEffect(() => {
  //     setProgressPercentage(() => {
  //       return sheetDetails.totalProblems > 0
  //         ? (sheetDetails.solvedProblems / sheetDetails.totalProblems) * 100
  //         : 0;
  //     });
  //   }, [sheetDetails]);

  return (
    <>
      {" "}
      <div className="w-64 p-4">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Sheet Information
          </h4>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{sheetDetails.sheetName}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="duration-200 border-none "
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                    <TooltipContent>{"Sheet Actions"}</TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-lg shadow-md ring-1  focus:outline-none transition-all duration-200 border-black">
                <DropdownMenuLabel className=" font-semibold text-slate-100 p-2">
                  Sheet Edit Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center justify-between p-2 rounded-lg text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => setIsConfirmationModalOpen(true)}
                >
                  Delete
                  <DropdownMenuShortcut>
                    <LucideTrash className="w-5 h-5 ml-2" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-md border bg-background shadow-lg text-white">
              <h3 className="font-semibold mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <span>Overview</span>
              </h3>
              <Separator className="my-2 border " />
              <p className="text-sm text-gray-300">
                {sheetDetails.sheetDescription || "No description available."}
              </p>
            </div>

            {/* <div className="bg-gray-700 p-3 rounded">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-2" /> Progress
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Solved Problems</span>
                  <span>
                    {sheetDetails.solvedProblems} / {sheetDetails.totalProblems}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  ></div>
                </div>
              </div> */}
            <div className="p-4 rounded-md border bg-background shadow-lg text-white">
              <div className="font-semibold mb-3 flex items-center">
                <ChartColumn className="w-5 h-5 mr-3 text-blue-500" />
                <h3 className="font-semibold">Categories</h3>
                <button
                  onClick={handleAddCategoryClick}
                  className="flex items-center justify-center w-8 h-8 ml-3 bg-black text-white rounded-full hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
                  aria-label="Add Category"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Separator className="my-2 border " />
              <div className="flex flex-wrap gap-2 mb-4">
                {sheetDetails?.categories &&
                sheetDetails.categories.length > 0 ? (
                  sheetDetails.categories.map((category, index) => (
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition duration-200 ease-in-out ${category.color} text-white`}
                    >
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">
                    No categories defined
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add New Category Modal */}
      <AddNewCategoryModal
        isOpen={isAddCategoryModalOpen}
        sheetId={selectedSheet._id}
        onClose={closeModal}
      />
      {/* Main Content Area */}
      <SheetdataComponent categories={categories} sheetId={selectedSheet._id} />
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this sheet? This action cannot be undone."
      />
    </>
  );
};
