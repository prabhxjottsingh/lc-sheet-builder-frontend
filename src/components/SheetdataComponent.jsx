import { useState } from "react";
import ProblemCategoryBlock from "./ProblemCategoryBlock";

const SheetdataComponent = ({ selectedSheet }) => {
  const [activeTab, setActiveTab] = useState("problems");
  return (
    <>
      <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("problems")}
            className={`
              px-4 py-2 ${
                activeTab === "problems"
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-400"
              }
            `}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`
              px-4 py-2 ${
                activeTab === "notes"
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-400"
              }
            `}
          >
            Notes
          </button>
        </div>

        {activeTab === "problems" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSheet?.problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{problem.title}</h3>
                  <ProblemCategoryBlock category={problem.difficulty} />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Acceptance</span>
                  <span>65.4%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="text-center text-gray-400 py-8">
            No notes available for this sheet.
          </div>
        )}
      </div>
    </>
  );
};

export default SheetdataComponent;
