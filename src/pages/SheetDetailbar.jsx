import {
  BookOpen,
  LucideTrash,
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
      {/* Sheet Details Sidebar */}
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{sheetDetails.sheetName}</h2>
            <button
              onClick={() => setIsConfirmationModalOpen(true)}
              className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg hover:text-red-400"
            >
              <LucideTrash className="w-5 h-5" />
              {/* Delete Sheet */}
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-semibold mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Overview
              </h3>
              <p className="text-sm text-gray-300">
                {sheetDetails.sheetDescription}
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
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Categories</h3>
                <button
                  onClick={handleAddCategoryClick}
                  className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500"
                  aria-label="Add Category"
                >
                  {/* Pencil Icon from Lucide */}
                  <Plus size={16} />
                </button>
              </div>
              {isAddCategoryModalOpen && (
                <AddNewCategoryModal
                  sheetId={selectedSheet._id}
                  onClose={closeModal}
                />
              )}
              <div className="flex flex-wrap gap-2">
                {sheetDetails?.categories &&
                sheetDetails?.categories?.length > 0 ? (
                  sheetDetails.categories.map((category, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 bg-gray-600 rounded text-xs ${category.color}`}
                    >
                      {category.name}
                    </span>
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
      {/* Main Content Area */}
      {
        <SheetdataComponent
          categories={categories}
          sheetId={selectedSheet._id}
        />
      }
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
