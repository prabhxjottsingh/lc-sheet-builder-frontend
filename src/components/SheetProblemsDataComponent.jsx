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
import Loader from "./Loader";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import CategoryTabsComponents from "./CategoryTabsComponent";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CardContent } from "@mui/material";
import { Button } from "./ui/button";
import { LucideTrash, MoreVertical, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SheetProblemsDataComponent = ({
  categories,
  sheetId,
  isSheetEditable = false,
}) => {
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const {
    refreshSheetProblemsDataComponent,
    setRefreshSheetDetailBar,
    setRefreshSheetProblemsDataComponent,
  } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState([]);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState({});
  const [deletingResource, setDeleteResource] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const hanldeOpenAddProblemModal = () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to add problems to this sheet.",
      });
      return;
    }
    setIsAddProblemModalOpen(true);
  };

  const handleDeleteProblemModal = (problem) => () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to delete problems from this sheet.",
      });
      return;
    }
    setSelectedProblem(problem);
    setIsConfirmationModalOpen(true);
  };

  const closeModal = () => {
    setIsAddProblemModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleCategoryTabClick = (categoryIdx) => {
    setActiveTab(categoryIdx);
  };

  const handleConfirmDelete = async () => {
    toast({
      title: "Deleting... Please wait.",
    });
    try {
      const queryParams = {
        categoryId: categories[activeTab]._id,
        problemId: selectedProblem._id,
      };
      const api = "api/problem/deleteproblem";
      await AxiosDelete(api, queryParams, token);
      setProblems((prevProblems) => {
        return prevProblems.filter(
          (problem) => problem._id !== selectedProblem._id
        );
      });
      closeModal();
      toast({
        title: "Deleted successfully!",
      });
    } catch (error) {
      console.error("Error while deleting Category: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while deleting Category. Please try again later.",
      });
    }
  };

  const handleCheckboxClick = async (index) => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to update the problem state.",
      });
      return;
    }
    toast({
      title: "Updating... Please wait.",
    });
    try {
      const body = {
        problemId: problems[index]._id,
        isMarkedDone: problems[index]?.isMarkedDone
          ? !problems[index].isMarkedDone
          : true,
      };

      const api = "api/problem/markProblem";
      await AxiosPost(api, body, token);

      setProblems((prevProblems) => {
        const newProblems = [...prevProblems];
        newProblems[index] = {
          ...newProblems[index],
          isMarkedDone: body.isMarkedDone,
        };
        return newProblems;
      });

      problems[index].isMarkedDone = body.isMarkedDone;
      toast({
        title: "Updated successfully!",
      });
    } catch (error) {
      console.error("Error while updating problem marked done state: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while updating the problem state. Please try again later.",
      });
    }
  };

  const handleProblemLinkClick = (problemEndPoint) => {
    if (!problemEndPoint) {
      console.error("Problem endpoint is not provided");
      return;
    }

    const baseUrl = "https://leetcode.com/problems";
    const fullUrl = `${baseUrl}/${problemEndPoint}`;

    window.open(fullUrl, "_blank");
  };

  const fetchProblemsData = async () => {
    setIsLoading(true);
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
    } catch (error) {
      console.error("Error while fetching problems data: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while fetching problems data. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveTab(0);
    } else {
      setProblems([]);
    }
  }, [categories, sheetId]);

  useEffect(() => {
    if (categories.length == 0) return;
    fetchProblemsData();
  }, [activeTab, categories, refreshSheetProblemsDataComponent]);

  return (
    <div className="flex-1 p-6 w-full">
      <CategoryTabsComponents
        categories={categories}
        selectedCategoryIndex={activeTab}
        onCategorySelect={handleCategoryTabClick}
        sheetId={sheetId}
        isSheetEditable={isSheetEditable}
      />

      <Card className="w-full">
        <CardHeader className={"mt-10"}>
          <CardTitle className="text-xl font-bold flex items-center justify-between gap-4 mb-4">
            <span>Problems List</span>
            <Button
              className="flex items-center justify-between border-collapse px-4 py-2 bg-blue-800 rounded-lg text-white hover:bg-gray-700 shadow-md transition-transform transform hover:scale-105"
              onClick={hanldeOpenAddProblemModal}
            >
              <span className="text-sm font-medium">Add Problem</span>
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </CardTitle>

          <CardContent
            className="overflow-y-auto max-h-[calc(100vh-265px)] overflow-x-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#808080 #000000",
            }}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <div>
                <Table className="mt-10 border-collapse w-full text-sm scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900">
                  <TableCaption className="text-gray-500 text-base"></TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-4 px-4 py-2 border-b font-semibold text-lg text-left"></TableHead>
                      <TableHead className="w-4 px-4 py-2 border-b font-semibold text-lg text-left">
                        Status
                      </TableHead>
                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-left">
                        Problem Name
                      </TableHead>
                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-left">
                        Difficulty
                      </TableHead>
                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-center">
                        Total Submissions Count
                      </TableHead>
                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-center">
                        Premium
                      </TableHead>
                      {/* <TableHead className="px-4 py-2 border-b font-semibold text-lg text-center">
                        Topics
                      </TableHead> */}

                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-center">
                        Acceptance
                      </TableHead>
                      {/* <TableHead className="px-4 py-2 border-b font-semibold text-lg text-right">
                        Frequency
                      </TableHead>
                      <TableHead className="px-4 py-2 border-b font-semibold text-lg text-center">
                        Premium
                      </TableHead> */}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="font-semibold text-lg">
                    {problems.length ? (
                      problems.map((problem, idx) => (
                        <TableRow
                          key={problem._id}
                          className=" transition-colors duration-200"
                        >
                          <TableCell className=" w-4 px-4 py-2 border-b font-semibold text-lg text-left">
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
                                    <TooltipContent>
                                      {"Sheet Actions"}
                                    </TooltipContent>
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
                                  onClick={handleDeleteProblemModal(problem)}
                                >
                                  Delete
                                  <DropdownMenuShortcut>
                                    <LucideTrash className="w-5 h-5 ml-2" />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="w-4 px-4 py-2 border-b font-semibold text-lg text-left">
                            <Checkbox
                              checked={problem.isMarkedDone}
                              onClick={() => handleCheckboxClick(idx)}
                              className="cursor-pointer hover:underline hover:text-blue-500"
                            />
                          </TableCell>
                          <TableCell
                            className="px-4 py-3 border-b cursor-pointer hover:underline text-blue-500 text-left"
                            onClick={() =>
                              handleProblemLinkClick(
                                problem.stat.question__title_slug
                              )
                            }
                          >
                            {problem.stat.question__title}
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b">
                            <span
                              className={`text-white px-2 py-1 rounded-md ${
                                difficultyColors[problem.difficulty.level]
                              }`}
                            >
                              {difficultyLabels[problem.difficulty.level]}
                            </span>
                          </TableCell>
                          {/* <TableCell className="px-4 py-3 border-b text-right">
                            {problem.stat.total_acs}
                          </TableCell> */}
                          <TableCell className="px-4 py-3 border-b text-center">
                            {problem.stat.total_submitted}
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b text-center">
                            {problem.paid_only ? "Yes" : "No"}{" "}
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b text-center">
                            {problem.stat.total_submitted == 0
                              ? "0"
                              : (
                                  (problem.stat.total_acs /
                                    problem.stat.total_submitted) *
                                  100
                                ).toFixed(1)}{" "}
                            {"%"}
                          </TableCell>
                          {/* <TableCell className="px-4 py-3 border-b text-left">
                            {problem.solutionAvailable ? (
                              <a
                                href={problem.solutionLink}
                                className="text-indigo-600 hover:underline"
                              >
                                View Solution
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="px-4 py-3 text-center text-gray-400"
                        >
                          No problems added yet!!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>

      <AddNewProblemModal
        isOpen={isAddProblemModalOpen}
        categoryId={categories[activeTab]?._id}
        onClose={closeModal}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this problem? This action cannot be undone."
      />
    </div>
  );
};

export default SheetProblemsDataComponent;
