import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
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

const AddNewSheetModal = ({ isOpen, onClose }) => {
  const { setRefreshSheetSidebar } = useContext(AppContext);

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
      "Adding a new sheet... Please wait."
    );

    try {
      const body = {
        name: formInputs.name,
        description: formInputs.description,
      };

      const api = "api/sheet/addnewsheet";
      await AxiosPost(api, body, token);
      setRefreshSheetSidebar((prev) => !prev);
      onClose();
      setFormInputs({});
      ToastHandler.showSuccess("Sheet created successfully!", loadingToast);
    } catch (error) {
      console.error("Error while creating new sheet: ", error);
      ToastHandler.showError(
        error?.response?.data?.message ||
          "Error while creating new sheet. Please try again later.",
        loadingToast
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Sheet</DialogTitle>
            <DialogDescription>
              Add a new Sheet with following configuration
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Leetcode 75"
                className="col-span-3"
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="These are the most asked leetcode 75 pattern problems"
                className="col-span-3"
                onChange={(event) =>
                  handleFormInputChange("description", event.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Create Sheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewSheetModal;
