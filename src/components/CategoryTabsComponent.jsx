import { useContext, useState } from "react";
import { AxiosDelete } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
import { useCookies } from "react-cookie";
import { AppContext } from "@/lib/Appcontext";
import ConfirmationModal from "./Modals/ConfrimationModal";
import { LucideTrash, MoreVertical, Plus } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import AddNewProblemModal from "./Modals/AddNewProblemModal";

const CategoryTabsComponents = ({
  categories,
  selectedCategoryIndex,
  onCategorySelect,
  sheetId,
  isSheetEditable = false,
}) => {
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const { setRefreshSheetDetailBar } = useContext(AppContext);

  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleOpenConfirmModal = () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to delete this category.",
      });
      return;
    }
    setIsConfirmationModalOpen(true);
  };

  const handleClickAddProblemModal = () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to add problems to this category.",
      });
      return;
    }
    setIsAddProblemModalOpen(true);
  };

  const closeModal = () => {
    setIsAddProblemModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    toast({
      title: "Deleting... Please wait.",
    });
    try {
      const queryParams = {
        categoryId: categories[selectedCategoryIndex]._id,
        sheetId,
      };
      const api = "api/category/deletecategory";
      await AxiosDelete(api, queryParams, token);
      setRefreshSheetDetailBar((prev) => !prev);
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

  return (
    <>
      <div className="flex w-full mb-4">
        {categories.map((category, categoryIdx) => (
          <div
            key={category._id}
            onClick={() => onCategorySelect(categoryIdx)}
            className={`px-6 py-3 flex items-center justify-between whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer
                ${
                  selectedCategoryIndex === categoryIdx
                    ? "text-white border-b-4 border-indigo-600"
                    : "text-gray-400 hover:text-indigo-500"
                }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold p-2">{category.name}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="outline" className="border-none">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                      <TooltipContent>{"Sheet Actions"}</TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg shadow-md ring-1 transition-all duration-200">
                  <DropdownMenuLabel className="font-semibold text-slate-100 p-2">
                    Category Edit Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Add new problem in the category option */}
                  <DropdownMenuItem
                    className="flex items-center justify-between p-2 rounded-lg transition-colors duration-200 text-gray-400"
                    onClick={handleClickAddProblemModal}
                  >
                    Add Problem
                    <DropdownMenuShortcut>
                      <Plus className="w-5 h-5 ml-2" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  {/* delete category option */}
                  {categoryIdx !== 0 && (
                    <DropdownMenuItem
                      className="flex items-center justify-between p-2 rounded-lg text-red-500 hover:text-red-600 transition-colors duration-200"
                      onClick={handleOpenConfirmModal}
                    >
                      Delete
                      <DropdownMenuShortcut>
                        <LucideTrash className="w-5 h-5 ml-2" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <AddNewProblemModal
        isOpen={isAddProblemModalOpen}
        categoryId={categories[selectedCategoryIndex]?._id}
        onClose={closeModal}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </>
  );
};

export default CategoryTabsComponents;
