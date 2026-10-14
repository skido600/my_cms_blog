"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "../../../hook/auth";
import { useAuthStore } from "../../../store/auth.store";

type FormData = {
  email: string;
  password: string;
};

const inputBase =
  "w-full rounded-lg border bg-white py-2.5 pl-10 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:ring-2 dark:bg-[#141414] dark:text-white dark:placeholder:text-neutral-500";

const inputOk =
  "border-neutral-300 focus:border-blue-500 focus:ring-blue-500/30 dark:border-neutral-700";

const inputBad = "border-red-500 focus:border-red-500 focus:ring-red-500/30";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const login = useLogin();

  const loading = login.isPending;
  const setEmail = useAuthStore((state) => state.setEmail);
  const onSubmit = async (data: FormData) => {
    try {
      const body = await login.mutateAsync(data);
      console.log(body, "body");
      toast.success("Signed in successfully");

      setEmail(data.email);
      router.push("/authorized/admin");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error, "error,login");
        toast.error(error.message);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-4 dark:bg-[#141414]">
      <section className="w-full max-w-sm rounded-xl border border-neutral-300 bg-white p-8  dark:border-neutral-800 dark:bg-[#1b1b1b]">
        {/* Brand */}
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#213555] text-lg font-bold text-white">
            A
          </span>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Admin sign in
          </h1>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to manage your blog.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Email
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={loading}
                aria-invalid={!!errors.email}
                className={`${inputBase} pr-3 ${
                  errors.email ? inputBad : inputOk
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </div>

            {errors.email && (
              <p
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                disabled={loading}
                aria-invalid={!!errors.password}
                className={`${inputBase} pr-10 ${
                  errors.password ? inputBad : inputOk
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 transition hover:text-neutral-700 disabled:cursor-not-allowed dark:hover:text-neutral-200">
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#213555] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1a2f45] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-[#1b1b1b]">
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}

            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Admins only. If you ended up here by mistake, head back to the home
          page or contact the developer.
        </p>
      </section>
    </main>
  );
}
