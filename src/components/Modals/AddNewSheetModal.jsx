import { AppContext } from "@/lib/Appcontext";
import { AxiosPost } from "@/utils/axiosCaller";
import { constants } from "@/utils/constants";
import ToastHandler from "@/utils/ToastHandler";
import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "react-modal";

// Set the root element for the modal
Modal.setAppElement("#root");

const AddNewSheetModal = ({ onClose }) => {
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
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Add New Sheet Modal"
      className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-lg w-1/2 transform transition-all duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Add New Sheet
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="sheetname" className="text-sm font-medium mb-2">
                Sheet Name
              </label>
              <input
                id="sheetname"
                type="text"
                placeholder="Enter sheet name"
                value={formInputs?.name}
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value)
                }
                className="bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium mb-2">
                Sheet Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="Enter sheet description"
                value={formInputs?.description}
                onChange={(event) =>
                  handleFormInputChange("description", event.target.value)
                }
                className="bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
              Add Sheet
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddNewSheetModal;
