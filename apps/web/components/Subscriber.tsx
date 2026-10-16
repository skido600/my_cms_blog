"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useSubscribe } from "../hook/email";

type FormValues = {
  email: string;
};

function Subscriber() {
  const { mutate, isPending, isSuccess, error } = useSubscribe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values.email.trim(), {
      onSuccess: () => reset(),
    });
  };

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-xl text-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex items-start gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              disabled={isPending}
              {...register("email", {
                required: "Email address is required",
                validate: (value) =>
                  value.trim().length > 0 || "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-60 sm:px-4 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/20"
            />

            {errors.email && (
              <p role="alert" className="mt-2 text-left text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 whitespace-nowrap rounded-lg border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 dark:border-neutral-700 dark:hover:bg-neutral-900">
            {isPending ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {/* {isSuccess && (
          <p role="status" className="mt-3 text-sm text-green-600">
            Subscription successful! Please check your email.
          </p>
        )} */}

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error.message || "Subscription failed. Please try again."}
          </p>
        )}
      </div>
    </section>
  );
}

export default Subscriber;
