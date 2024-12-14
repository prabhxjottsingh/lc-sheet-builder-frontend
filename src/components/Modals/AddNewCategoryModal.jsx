import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { badgeColors, constants } from "@/utils/constants";
import ToastHandler from "@/utils/ToastHandler";
import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AddNewCategoryModal = ({ sheetId, onClose }) => {
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
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Add New Sheet Modal"
      className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-lg w-1/2 transform transition-all duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Add New Category
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Category Name Input */}
            <div className="flex flex-col">
              <label
                htmlFor="categoryName"
                className="text-sm font-medium mb-2"
              >
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                placeholder="Enter category name"
                value={formInputs?.name}
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value)
                }
                className="bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category Color Picker */}
            <div className="flex flex-col">
              <label
                htmlFor="categoryColor"
                className="text-sm font-medium mb-2"
              >
                Category Color
              </label>
              <div className="flex gap-4">
                {Object.keys(badgeColors).map((key) => (
                  <div
                    key={key}
                    onClick={() =>
                      handleFormInputChange("color", badgeColors[key])
                    }
                    className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                      badgeColors[key]
                    } ${
                      formInputs.color === badgeColors[key]
                        ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-800 "
                        : "ring-2 ring-gray-600 ring-offset-2 ring-offset-gray-800"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddNewCategoryModal;
