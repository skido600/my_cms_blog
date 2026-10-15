import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  deletePost,
  updatePost,
  getAllFeaturedPosts,
  GetRecentPost,
  getAllCategories,
  getPostsByCategory,
} from "../services/post";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featured-posts"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
    },
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

export const getAllFeatured = () => {
  return useQuery({
    queryKey: ["featured-posts"],
    queryFn: getAllFeaturedPosts,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: ["recent-posts"],
    queryFn: GetRecentPost,
  });
};

export const useGetPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updatePost(id, form),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featured-posts"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featured-posts"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
    },
  });
};

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};
export const useGetPostsByCategory = (category: string | null) => {
  return useQuery({
    queryKey: ["posts", "category", category],
    queryFn: () => getPostsByCategory(category!),
    enabled: !!category,
  });
};
