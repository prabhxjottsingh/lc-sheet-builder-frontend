import React from "react";
import Modal from "react-modal";

// Set the root element for the modal
Modal.setAppElement("#root");

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto transform transition-transform duration-300 scale-100"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-white mb-4">
          Confirm Action
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          {message || "Are you sure you want to proceed with this action?"}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
