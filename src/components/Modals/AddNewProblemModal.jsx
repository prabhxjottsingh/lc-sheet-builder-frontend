import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
import ToastHandler from "@/utils/ToastHandler";
import { useCookies } from "react-cookie";
import { problemsData } from "@/problemsConfig";

// Set the root element for the modal
Modal.setAppElement("#root");

// Difficulty level mapping
const DIFFICULTY_COLORS = {
  1: "text-green-500", // Easy
  2: "text-yellow-500", // Medium
  3: "text-red-500", // Hard
};

const DIFFICULTY_LABELS = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

const AddNewProblemModal = ({ onClose, categoryId }) => {
  const { setRefreshSheetdataComponent } = useContext(AppContext);
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

    const loadingToast = ToastHandler.showLoading(
      "Adding problems... Please wait."
    );

    try {
      console.log("This is categoryId: ", categoryId);
      const body = {
        categoryId,
        problemIds: selectedProblems.map((problem) => ({
          lcid: problem.stat.question_id,
        })),
      };

      const api = "api/problem/addnewproblems";
      await AxiosPost(api, body, token);

      setRefreshSheetdataComponent((prev) => !prev);
      onClose();
      ToastHandler.showSuccess(
        `${selectedProblems.length} problem(s) added successfully!`,
        loadingToast
      );
    } catch (error) {
      console.error("Error while adding problems: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while adding problems. Please try again later.",
        loadingToast
      );
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Add Problems Modal"
      className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Add Problems to Category
        </h2>

        <div className="mb-6 flex space-x-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={difficultyFilter || ""}
            onChange={(e) =>
              setDifficultyFilter(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>

        <div
          className="flex-grow overflow-y-auto mb-6 space-y-2 
  scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800 
  max-h-[50vh] pr-2" // Added max-height and right padding
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
              : "bg-gray-700 hover:bg-gray-600"
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
              onClick={onClose}
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
      </div>
    </Modal>
  );
};

export default AddNewProblemModal;
