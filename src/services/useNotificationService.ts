import Swal from "sweetalert2";
import toast from 'react-hot-toast';

export default function useNotification() {

  const toastError = (error: any, message?: string) => {
    toast.error(message || error.message || 'Ha ocurrido un error');
  };

  const toastSuccess = (message: string) => {
    toast.success(message);
  };

  const dialogConfirm = (text: string) => {
    return Swal.fire({
      title: "Estás seguro?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    });
  }

  return { toastError, toastSuccess, dialogConfirm };
}
