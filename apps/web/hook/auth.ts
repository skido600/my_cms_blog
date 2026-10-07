"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../services/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
