import Swal from "sweetalert2";

export function useSwal() {
  const showAlert = async (options) => {
    await Swal.fire(options);
  };

  const showSuccess = async (message) => {
    return await showAlert({
      icon: "success",
      title: "Success",
      text: message,
      position: "top-end",
      timmer: 1500
    });
  };

  const showError = async (message) => {
    return await showAlert({
      icon: "error",
      title: "Error",
      text: message,
      position: "top-end",
      timmer: 1500
    });
  };

  const showConfirm = async (message) => {
    return await showAlert({
      icon: "warning",
      title: "Are you sure?",
      text: message || "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      position: "top-end",
      timmer: 1500
    });
  };

  return {
    showSuccess,
    showError,
    showConfirm
  };
}
