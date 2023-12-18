import { toast } from "react-toastify";

export const warningMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
    className: "warning-message",
  });
};

export const successMessage = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    className: "success-message",
  });
};

export const dangerMessage = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    className: "danger-message",
  });
};

export const warningMessageCenter = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_CENTER });
};

export const successUpdate = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_CENTER });
};
