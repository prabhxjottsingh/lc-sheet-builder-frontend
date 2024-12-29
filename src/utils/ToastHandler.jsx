import { showToast, Toaster } from "@/components/ui/sonner";
import { toast } from "react-toastify";

class ToastHandler {
  static showLoading(message = "Loading...") {
    return showToast(message);
  }

  static showSuccess(message, toastId) {
    showToast(message || "Operation completed successfully!", {
      type: "success",
      isLoading: false,
      autoClose: 1000,
    });
  }

  static showError(message, toastId) {
    showToast(message || "An error occurred. Please try again later.", {
      type: "error",
      isLoading: false,
      autoClose: 1000,
    });
  }

  static showCustom({
    type = "info",
    message,
    autoClose = 1000,
    options = {},
  }) {
    showToast(message, {
      type,
      autoClose,
      ...options,
    });
  }
}

export default ToastHandler;
