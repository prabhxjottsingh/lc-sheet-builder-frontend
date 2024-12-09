import { toast } from "react-toastify";

class ToastHandler {
  static showLoading(message = "Loading...") {
    return toast.loading(message);
  }

  static showSuccess(message, toastId) {
    toast.update(toastId, {
      render: message || "Operation completed successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  }

  static showError(message, toastId) {
    toast.update(toastId, {
      render: message || "An error occurred. Please try again later.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }

  static showCustom({
    type = "info",
    message,
    autoClose = 3000,
    options = {},
  }) {
    toast(message, {
      type,
      autoClose,
      ...options,
    });
  }
}

export default ToastHandler;
