import { useContext, useEffect, useState } from "react";
import ProblemCategoryBlock from "./ProblemCategoryBlock";
import AddNewProblemModal from "./Modals/AddNewProblemModal";
import { AxiosDelete, AxiosGet, AxiosPost } from "@/utils/axiosCaller";
import { problemsData } from "@/problemsConfig";
import ToastHandler from "@/utils/ToastHandler";
import {
  constants,
  difficultyColors,
  difficultyLabels,
} from "@/utils/constants";
import { useCookies } from "react-cookie";
import { AppContext } from "@/lib/Appcontext";
import ConfirmationModal from "./Modals/ConfrimationModal";
import { LucideTrash } from "lucide-react";

const SheetdataComponent = ({ categories, sheetId }) => {
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  // State for active tab and modal
  const { refreshSheetdataComponent, setRefreshSheetDetailBar } =
    useContext(AppContext);
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState([]);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState({});
  const [deletingResource, setDeleteResource] = useState(null);

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = ToastHandler.showLoading("Deleting... Please wait.");
    try {
      console.log("This is selectedProb: ", selectedProblem);
      const queryParams =
        deletingResource === "category"
          ? { categoryId: categories[activeTab]._id, sheetId }
          : {
              categoryId: categories[activeTab]._id,
              problemId: selectedProblem._id,
            };
      console.log("This is queryparams: ", queryParams);
      const api =
        deletingResource === "category"
          ? "api/category/deletecategory"
          : "api/problem/deleteproblem";
      await AxiosDelete(api, queryParams, token);
      setRefreshSheetDetailBar((prev) => !prev);
      closeModal();
      ToastHandler.showSuccess(
        "Category fetched successfully successfully!",
        loadingToast
      );
    } catch (error) {
      console.error("Error while deleting Category: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while deleting Category. Please try again later.",
        loadingToast
      );
    }
  };

  const fetchProblemsData = async () => {
    const loadingToast = ToastHandler.showLoading(
      "Fetching problems data... Please wait."
    );
    try {
      const queryParams = { categoryId: categories[activeTab]._id };
      const api = "api/problem/getproblemsbycategoryid";
      const response = await AxiosGet(api, queryParams, token);

      // Extract data from each response and push to categoryIdsMetadata
      const addedProblemsData = response.data.data;
      //   const filteredProblemsData =
      console.log("Addded problems data: ", addedProblemsData);
      setProblems(
        addedProblemsData.map((addedProblem) => {
          const matchingProblem = problemsData.stat_status_pairs.find(
            (problemData) =>
              addedProblem.lcproblemId == problemData.stat.question_id
          );
          return { ...matchingProblem, _id: addedProblem._id }; // Return the matching object or undefined if not found
        })
      );

      ToastHandler.showSuccess("Problems fetched successfully", loadingToast);
    } catch (error) {
      console.error("Error while fetching problems data: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while fetching problems data. Please try again later.",
        loadingToast
      );
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      // Set the initial active tab to the first category's name when categories are loaded
      setActiveTab(0);
    }
  }, [categories]);

  useEffect(() => {
    fetchProblemsData();
  }, [activeTab, refreshSheetdataComponent]);

  useEffect(() => {
    console.log("These are the setPRoblems: ", problems);
  }, [problems]);
  return (
    <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
      {/* Categories Tabs */}
      <div
        className="flex overflow-x-auto flex-grow scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories && categories.length > 0 ? (
          categories.map((category, categoryIdx) => (
            <button
              key={category._id}
              onClick={() => setActiveTab(categoryIdx)}
              className={`
                px-4 py-2 whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105
                ${
                  activeTab === categoryIdx
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-gray-400"
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{category.name}</h2>
                {categoryIdx !== 0 && (
                  <button
                    onClick={() => {
                      setIsConfirmationModalOpen(true);
                      setDeleteResource("category");
                    }}
                    className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg hover:text-red-400"
                  >
                    <LucideTrash className="w-5 h-5" />
                  </button>
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No categories available
          </div>
        )}
      </div>

      {/* Add Problem Button */}
      <div className="my-4 flex justify-end">
        <button
          onClick={() => setIsAddProblemModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Problem
        </button>
      </div>

      {/* Problems List */}
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.length > 0 ? (
            problems.map((problem) => (
              <div
                key={problem?.stat?.question_id}
                className="bg-gray-900 shadow-md p-6 rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white text-lg">
                    {problem?.stat?.question__title || "Untitled Problem"}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficultyColors[problem?.difficulty?.level]
                    }`}
                  >
                    {difficultyLabels[problem?.difficulty?.level] || "Unknown"}
                  </span>
                  <button
                    onClick={() => {
                      setIsConfirmationModalOpen(true);
                      setDeleteResource("problem");
                      setSelectedProblem(problem);
                    }}
                    className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg hover:text-red-400"
                  >
                    <LucideTrash className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Acceptance Rate</span>
                  <span className="font-medium">
                    {problem?.stat?.total_submitted > 0
                      ? `${(
                          (problem?.stat?.total_acs /
                            problem?.stat?.total_submitted) *
                          100
                        ).toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <div className="text-center text-gray-400 py-8 px-6 mt-10">
                <p className="text-lg font-semibold">No Problems Found</p>
                <p className="text-sm">Try selecting a different category.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Problem Modal */}
      {isAddProblemModalOpen && (
        <AddNewProblemModal
          categoryId={categories[activeTab]?._id}
          onClose={() => setIsAddProblemModalOpen(false)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this Category? This action cannot be undone."
      />
    </div>
  );
};

export default SheetdataComponent;
