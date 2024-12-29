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
import { LucideTrash, MoreVertical } from "lucide-react";
import Loader from "./Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Checkbox } from "./ui/checkbox";

const SheetdataComponent = ({ categories, sheetId }) => {
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const { refreshSheetdataComponent, setRefreshSheetDetailBar, setRefreshSheetdataComponent } =
    useContext(AppContext);
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState([]);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState({});
  const [deletingResource, setDeleteResource] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = ToastHandler.showLoading("Deleting... Please wait.");
    try {
      const queryParams =
        deletingResource === "category"
          ? { categoryId: categories[activeTab]._id, sheetId }
          : {
              categoryId: categories[activeTab]._id,
              problemId: selectedProblem._id,
            };
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

  const handleCheckboxClick = async (index) => {
    const loadingToast = ToastHandler.showLoading(
      "Updating problem marked state... Please wait."
    );
    console.log("This is the sheetData: ", problems[index]);
    console.log("Is Marked Done Val: ", !problems[index].isMarkedDone)
    try {
        const body = {
            problemId: problems[index]._id,
            isMarkedDone: problems[index]?.isMarkedDone ? !problems[index].isMarkedDone : true,
          };
          
      const api = "api/problem/markProblem";
      await AxiosPost(api, body, token);
      setRefreshSheetDetailBar((prev) => !prev);
      setRefreshSheetdataComponent(prev => !prev);
      ToastHandler.showSuccess(
        `Problem ${body.isMarkedDone ? "Markend" : "Unmarked"} successcully`,
        loadingToast
      );
    } catch (error) {
      console.error("Error while updating problem marked done state: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while updating the problem state. Please try again later.",
        loadingToast
      );
    }
  };

  const handleProblemLinkClick = (problemEndPoint) => {
    console.log("Problem End point: ", problemEndPoint);
    if (!problemEndPoint) {
      console.error("Problem endpoint is not provided");
      return;
    }

    const baseUrl = "https://leetcode.com/problems"; // Replace with the actual base URL if different
    const fullUrl = `${baseUrl}/${problemEndPoint}`;

    window.open(fullUrl, "_blank"); // Opens the link in a new tab
  };

  const fetchProblemsData = async () => {
    setIsLoading(true);
    const loadingToast = ToastHandler.showLoading(
      "Fetching problems data... Please wait."
    );
    try {
      const queryParams = { categoryId: categories[activeTab]._id };
      const api = "api/problem/getproblemsbycategoryid";
      const response = await AxiosGet(api, queryParams, token);

      const addedProblemsData = response.data.data;
      setProblems(
        addedProblemsData.map((addedProblem) => {
          const matchingProblem = problemsData.stat_status_pairs.find(
            (problemData) =>
              addedProblem.lcproblemId == problemData.stat.question_id
          );
          return { ...matchingProblem, ...addedProblem };
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveTab(0);
    }
  }, [categories]);

  useEffect(() => {
    fetchProblemsData();
  }, [activeTab, refreshSheetdataComponent]);

  useEffect(() => {
    console.log("These are the problems: ", problems);
  }, [problems]);

  return (
    <div className="flex-1  p-6 overflow-y-auto">
      {/* Categories Tabs */}
      <div
        className="flex overflow-x-auto flex-grow scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories && categories.length > 0 ? (
          categories.map((category, categoryIdx) => (
            <div
              key={category._id}
              onClick={() => setActiveTab(categoryIdx)}
              className={`
                px-4 py-2 whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer
                ${
                  activeTab === categoryIdx
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-gray-400"
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold p-2">{category.name}</h2>
                {categoryIdx !== 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="outline"
                            className="duration-200 border-none"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                          <TooltipContent>{"Sheet Actions"}</TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-lg shadow-md ring-1  focus:outline-none transition-all duration-200">
                      <DropdownMenuLabel className=" font-semibold text-slate-100 p-2">
                        Category Edit Options
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center justify-between p-2 rounded-lg text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={() => {
                          setIsConfirmationModalOpen(true);
                          setDeleteResource("category");
                        }}
                      >
                        Delete
                        <DropdownMenuShortcut>
                          <LucideTrash className="w-5 h-5 ml-2" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
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

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Problems List */}
          {categories && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.length > 0 ? (
                problems.map((problem, index) => (
                  <div
                    key={problem?._id}
                    className="border border-gray-800 shadow-lg p-6 rounded-lg hover:bg-gray-950 hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-white text-lg cursor-pointer ">
                        <div className="flex items-center space-x-2">
                          <div onClick={() => handleCheckboxClick(index)}>
                            <Checkbox
                              checked={problem?.isMarkedDone || false}
                              // onCheckedChange={handleCheckboxClick(index)}
                            />
                          </div>
                          <label
                            htmlFor={`problem-checkbox-${problem?.stat?.question_id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:underline hover:text-blue-500"
                            onClick={() =>
                              handleProblemLinkClick(
                                problem?.stat?.question__title_slug
                              )
                            }
                          >
                            {problem?.stat?.question__title ||
                              "Untitled Problem"}
                          </label>
                        </div>
                      </h3>

                      {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          difficultyColors[problem?.difficulty?.level]
                        }`}
                      >
                        {difficultyLabels[problem?.difficulty?.level] ||
                          "Unknown"}
                      </span> */}
                      <DropdownMenu className=" border-gray-950">
                        <DropdownMenuTrigger className=" border-gray-950">
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="outline"
                                className="duration-200 border-none"
                              >
                                <MoreVertical />
                              </Button>
                              <TooltipContent>{"Sheet Actions"}</TooltipContent>
                            </TooltipTrigger>
                          </Tooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-lg shadow-md ring-1 focus:outline-none transition-all duration-200">
                          <DropdownMenuLabel className="font-semibold text-slate-100 p-2">
                            Problem Edit Options
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center justify-between p-2 rounded-lg text-red-500 hover:text-red-600 transition-colors duration-200"
                            onClick={() => {
                              setIsConfirmationModalOpen(true);
                              setDeleteResource("problem");
                              setSelectedProblem(problem);
                            }}
                          >
                            Delete
                            <DropdownMenuShortcut>
                              <LucideTrash className="w-5 h-5 ml-2" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                    <p className="text-sm">
                      Try selecting a different category.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add New Problem Modal */}
      <AddNewProblemModal
        isOpen={isAddProblemModalOpen}
        categoryId={categories[activeTab]?._id}
        onClose={() => setIsAddProblemModalOpen(false)}
      />

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
