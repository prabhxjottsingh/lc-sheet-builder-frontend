import React from "react";
import Modal from "react-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

Modal.setAppElement("#root");

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm the Action</AlertDialogTitle>
          <AlertDialogDescription>
            {message || "Are you sure you want to proceed with this action?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button onClick={onCancel}>Cancel</button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button onClick={onConfirm}>Confirm</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
