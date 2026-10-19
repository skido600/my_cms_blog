"use client";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerPostView } from "../services/post";

export function useRegisterView(
  slug: string | undefined,
  onCounted?: (views: number) => void,
) {
  const fired = useRef(false);

  const mutation = useMutation({
    mutationFn: (s: string) => registerPostView(s),
    onSuccess: (data) => {
      if (data.counted && data.views !== undefined) {
        onCounted?.(data.views);
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (!slug || fired.current) return;
    fired.current = true;

    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}

    mutation.mutate(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
}
