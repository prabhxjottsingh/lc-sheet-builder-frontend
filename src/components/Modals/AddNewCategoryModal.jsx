import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { badgeColors, constants } from "@/utils/constants";
import ToastHandler from "@/utils/ToastHandler";
import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";

const AddNewCategoryModal = ({ isOpen, sheetId, onClose }) => {
  const { setRefreshSheetDetailBar } = useContext(AppContext);
  const [formInputs, setFormInputs] = useState({});
  const [cookies] = useCookies([constants.COOKIES_KEY.AUTH_TOKEN]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];

  const handleFormInputChange = (key, value) => {
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = ToastHandler.showLoading(
      "Adding a new category... Please wait."
    );

    if (!formInputs.color) {
      ToastHandler.showError("Choose a category color", loadingToast);
      return;
    }

    try {
      const body = {
        name: formInputs.name,
        color: formInputs.color,
        sheetId,
      };

      const api = "api/category/addnewcategory";
      await AxiosPost(api, body, token);
      setRefreshSheetDetailBar((prev) => !prev);
      onClose();
      setFormInputs({});
      ToastHandler.showSuccess("Category added successfully!", loadingToast);
    } catch (error) {
      console.error("Error while adding new category: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while adding new category. Please try again later.",
        loadingToast
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new Category with following configuration
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Hard"
                className="col-span-3"
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <div className="flex gap-4">
                {Object.keys(badgeColors).map((key) => (
                  <div
                    key={key}
                    onClick={() =>
                      handleFormInputChange("color", badgeColors[key])
                    }
                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition duration-300 ease-in-out transform ${
                      badgeColors[key]
                    } ${
                      formInputs.color === badgeColors[key]
                        ? "ring-4 ring-blue-200  ring-offset-2 ring-offset-gray-800 scale-110 shadow-lg"
                        : "ring-2 ring-gray-600 ring-offset-2 ring-offset-gray-800 hover:scale-105 hover:shadow-md"
                    }`}
                    title={key}
                  >
                    <Avatar>
                      <AvatarFallback
                        className={`${badgeColors[key]}`}
                      ></AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewCategoryModal;
