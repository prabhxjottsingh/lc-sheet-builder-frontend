import { BookOpen, Star } from "lucide-react";

const SheetDetailbar = ({ selectedSheet }) => {
  return (
    <>
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <div>
          <h2 className="text-xl font-bold mb-4">{selectedSheet.name}</h2>

          <div className="space-y-4">
            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-semibold mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Overview
              </h3>
              <p className="text-sm text-gray-300">
                {selectedSheet.description}
              </p>
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-semibold mb-2 flex items-center">
                <Star className="w-4 h-4 mr-2" /> Progress
              </h3>
              <div className="flex justify-between text-sm">
                <span>Solved Problems</span>
                <span>
                  {selectedSheet.solvedProblems} / {selectedSheet.totalProblems}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (selectedSheet.solvedProblems /
                        selectedSheet.totalProblems) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSheet.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-gray-600 rounded text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SheetDetailbar;
