import { useMutation } from "@tanstack/react-query";
import { subscribe } from "../services/email";
import { toast } from "sonner";

export const useSubscribe = () => {
  return useMutation({
    mutationFn: subscribe,
    onSuccess: (data) => {
      toast.message(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
