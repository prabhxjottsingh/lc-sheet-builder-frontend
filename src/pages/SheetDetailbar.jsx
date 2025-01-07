import {
  BookOpen,
  ChartColumn,
  Check,
  LucideTrash,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ToastHandler from "@/utils/ToastHandler";
import { AxiosDelete, AxiosGet, AxiosPost } from "@/utils/axiosCaller";
import { useCookies } from "react-cookie";
import { constants } from "@/utils/constants";
import { AppContext } from "@/lib/Appcontext";
import SheetProblemsDataComponent from "@/components/SheetProblemsDataComponent";
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SheetDetailbar = () => {
  const { sheetId } = useParams();
  const [currentSheet, setCurrentSheet] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [sheetDetails, setSheetDetails] = useState({});
  const [cookies] = useCookies([
    constants.COOKIES_KEY.AUTH_TOKEN,
    constants.COOKIES_KEY.USER_ID,
  ]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const currentUserId = cookies[constants.COOKIES_KEY.USER_ID];
  const { refreshSheetDetailBar, setRefreshSheetDetailBar } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [isSheetEditable, setIsSheetEditable] = useState(false);

  const handleAddCategoryClick = () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to add a category to this sheet.",
      });
      return;
    }
    setIsAddCategoryModalOpen(true);
  };

  const handleOpenConfirmModal = () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to delete this sheet.",
      });
      return;
    }
    setIsConfirmationModalOpen(true);
  };

  const closeModal = () => {
    setIsAddCategoryModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    toast({
      title: "Deleting... Please wait.",
    });
    try {
      const queryParams = { sheetId: sheetId };
      const api = "api/sheet/deletesheet";
      await AxiosDelete(api, queryParams, token);
      setRefreshSheetDetailBar((prev) => !prev);
      closeModal();
      toast({
        title: "Sheet deleted successfully!",
      });
    } catch (error) {
      console.error("Error while deleting sheet: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while deleting sheet. Please try again later.",
      });
    }
  };

  const fetchSheetData = async () => {
    try {
      const queryParams = { sheetId: sheetId };
      const api = "api/sheet/getsheetdetails";
      const response = await AxiosGet(api, queryParams, token);
      const sheetData = response.data.data;
      setCurrentSheet(sheetData);
      setSheetDetails({
        sheetName: sheetData?.metadata?.name || "Sheet Name is Not Defined",
        sheetDescription:
          sheetData?.metadata?.description ||
          "Sheet Description is Not Defined",
        categories: [],
      });
      setIsSheetEditable(
        sheetData?.createdBy.toString() === currentUserId || false
      );
    } catch (error) {
      console.error("Error while fetching sheet data: ", error);
      navigate("/notauthorised");
      toast({
        title:
          error?.response?.data?.message ||
          "Error while fetching sheet data. Please try again later.",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const queryParams = { sheetId: sheetId };
      const api = "api/category/getcategoriesbysheetid";
      const response = await AxiosGet(api, queryParams, token);

      const categoryMetadata = response.data.data.map(({ metadata, _id }) => ({
        ...metadata,
        _id,
      }));
      setCategories(categoryMetadata);
      setSheetDetails((prev) => ({
        ...prev,
        categories: categoryMetadata,
      }));
    } catch (error) {
      console.error("Error while fetching Category metadata: ", error);

      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while fetching Category data. Please try again later.",
      });
    }
  };

  const makeSheetPublic = async () => {
    if (!isSheetEditable) {
      toast({
        variant: "destructive",
        title: "You are not authorized to make this sheet public.",
      });
      return;
    }
    toast({
      title: "Making the sheet public... Please wait.",
    });
    try {
      const newPublicStatus = !(currentSheet?.metadata?.isPublic ?? false);
      const body = { sheetId: sheetId, isPublic: newPublicStatus };
      const api = "api/sheet/makesheetpublic";
      await AxiosPost(api, body, token);
      setCurrentSheet((prev) => ({
        ...prev,
        metadata: {
          ...(prev?.metadata || {}),
          isPublic: newPublicStatus,
        },
      }));
      toast({
        title: newPublicStatus
          ? "Sheet is now public!"
          : "Sheet is now private!",
      });
    } catch (error) {
      console.error("Error while making the sheet public: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while making the sheet public. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (!sheetId) return;
    const fetchData = async () => {
      await fetchSheetData();
      fetchCategories();
    };
    fetchData();
  }, [sheetId, refreshSheetDetailBar]);

  return (
    <div className="flex h-screen">
      {/* Sheet Detailbar Section */}
      <div className="p-4">
        <div className="w-64 p-4">
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
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                    currentSheet?.metadata?.isPublic
                      ? "bg-gray-600"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => makeSheetPublic()}
                >
                  Sheet Public
                  <DropdownMenuShortcut>
                    {currentSheet?.metadata?.isPublic ? (
                      <Check className="w-5 h-5 ml-2" />
                    ) : (
                      ""
                    )}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between p-2 rounded-lg text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={handleOpenConfirmModal}
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
                      key={index}
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
        sheetId={sheetId}
        onClose={closeModal}
      />

      <SheetProblemsDataComponent
        categories={categories}
        sheetId={sheetId}
        isSheetEditable={isSheetEditable}
      />
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this sheet? This action cannot be undone."
      />
    </div>
  );
};
