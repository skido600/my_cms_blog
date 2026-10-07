import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  deletePost,
  updatePost,
} from "../services/post";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

export const useGetPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
};

//    UPDATE POST

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updatePost(id, form),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["post", variables.id],
      });
    },
  });
};

//    DELETE POST

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};
