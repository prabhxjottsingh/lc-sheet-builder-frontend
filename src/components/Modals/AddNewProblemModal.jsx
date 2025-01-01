import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
import ToastHandler from "@/utils/ToastHandler";
import { useCookies } from "react-cookie";
import { problemsData } from "@/problemsConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";

Modal.setAppElement("#root");

const DIFFICULTY_COLORS = {
  1: "text-green-500",
  2: "text-yellow-500",
  3: "text-red-500",
};

const DIFFICULTY_LABELS = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

const AddNewProblemModal = ({ isOpen, onClose, categoryId }) => {
  const { setRefreshSheetProblemsDataComponent } = useContext(AppContext);
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];

  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  const filteredProblems = problemsData.stat_status_pairs.filter((problem) => {
    const matchesSearch = problem.stat.question__title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === null ||
      problem.difficulty.level === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const toggleProblemSelection = (problem) => {
    setSelectedProblems((prev) =>
      prev.some((p) => p.stat.question_id === problem.stat.question_id)
        ? prev.filter((p) => p.stat.question_id !== problem.stat.question_id)
        : [...prev, problem]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProblems.length === 0) {
      ToastHandler.showError("Please select at least one problem");
      return;
    }
    toast({
      variant: "info",
      title: "Adding problems... Please wait.",
    });

    try {
      const body = {
        categoryId,
        problemIds: selectedProblems.map((problem) => ({
          lcid: problem.stat.question_id,
        })),
      };

      const api = "api/problem/addnewproblems";
      await AxiosPost(api, body, token);

      setRefreshSheetProblemsDataComponent((prev) => !prev);
      closeModal();
      toast({
        title: "Problems added successfully!",
      });
    } catch (error) {
      console.error("Error while adding problems: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while adding problems. Please try again later.",
      });
    }
  };

  const closeModal = () => {
    onClose();
    setSelectedProblems([]);
    setSearchTerm("");
    setDifficultyFilter(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[900px] fixed  overflow-hidden ">
          <DialogHeader>
            <DialogTitle>Add Problem</DialogTitle>
            <DialogDescription>
              Add a new problem to the category with the following
              configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Problem Name and Difficulty Selection */}
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="name" className="text-right col-span-1">
                Type Problem Name
              </Label>
              <Input
                id="name"
                placeholder="Two Sum"
                className="col-span-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={difficultyFilter || ""}
                onChange={(e) =>
                  setDifficultyFilter(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="col-span-1 border rounded-lg p-3 bg-black text-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All Difficulties</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
          </div>

          <div
            className="flex-grow overflow-y-auto mb-6 space-y-2 
            max-h-[50vh] pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#808080 #000000",
              overflowX: "hidden",
            }}
          >
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <div
                  key={problem.stat.question_id}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-300
                  ${
                    selectedProblems.some(
                      (p) => p.stat.question_id === problem.stat.question_id
                    )
                      ? "bg-blue-800 bg-opacity-50"
                      : "hover:bg-gray-950"
                  }`}
                  onClick={() => toggleProblemSelection(problem)}
                >
                  <input
                    type="checkbox"
                    checked={selectedProblems.some(
                      (p) => p.stat.question_id === problem.stat.question_id
                    )}
                    onChange={() => toggleProblemSelection(problem)}
                    id={`problem-${problem.stat.question_id}`}
                    className="mr-4 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`problem-${problem.stat.question_id}`}
                    className="flex-grow"
                  >
                    <div className="font-semibold text-white">
                      {problem.stat.question__title}
                    </div>
                    <div
                      className={`text-sm ${
                        DIFFICULTY_COLORS[problem.difficulty.level]
                      }`}
                    >
                      {DIFFICULTY_LABELS[problem.difficulty.level]} Difficulty
                    </div>
                  </label>
                  <div className="text-gray-400 text-sm">
                    Acceptance:{" "}
                    {(
                      (problem.stat.total_acs / problem.stat.total_submitted) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No problems found matching your search or filter.
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-white">
              Selected: {selectedProblems.length} problem(s)
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-600 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedProblems.length === 0}
                className={`py-2 px-4 rounded-md transition-colors duration-300
                ${
                  selectedProblems.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                Add{" "}
                {selectedProblems.length > 0
                  ? `(${selectedProblems.length})`
                  : ""}{" "}
                Problems
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewProblemModal;
