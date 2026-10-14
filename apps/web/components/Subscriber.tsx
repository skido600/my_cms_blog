"use client";

import React, { useState } from "react";

function Subscriber() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-xl text-center">
        <form
          onSubmit={handleSubmit}
          className="flex items-stretch gap-2 sm:gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 sm:px-4 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/20"
          />
          <button
            type="submit"
            className="shrink-0 whitespace-nowrap rounded-lg border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-95 sm:px-6 dark:border-neutral-700 dark:hover:bg-neutral-900">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Subscriber;
