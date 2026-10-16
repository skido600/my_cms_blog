"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ghostBtn, primaryBtn, Spinner, Modal } from "./notice-modal";

type Status = "idle" | "loading" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_REGEX = /^[a-f0-9]{64}$/i;
const REDIRECT_MS = 4000;

const UnsubscribeNotice = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const rawToken = searchParams.get("token");
  const token = rawToken && TOKEN_REGEX.test(rawToken) ? rawToken : null;

  const goHome = () => router.push("/");

  // After success, go home automatically
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => router.push("/"), REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [status, router]);

  const confirm = async () => {
    if (!token) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(`/api/v1/subscribe/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        return;
      }

      setError(data.message || "Something went wrong.");
      setStatus("error");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  // 1. Success
  if (status === "success") {
    return (
      <Modal
        variant="success"
        title="You're unsubscribed"
        text="You will no longer receive new-post notifications. You can subscribe again anytime from the blog. Taking you back home...">
        <button type="button" onClick={goHome} className={primaryBtn}>
          Back to home
        </button>
      </Modal>
    );
  }

  // 2. No token, or a malformed one
  if (!token) {
    return (
      <Modal
        variant="error"
        title="Invalid link"
        text="This unsubscribe link is invalid or has been modified.">
        <button type="button" onClick={goHome} className={primaryBtn}>
          Back to home
        </button>
      </Modal>
    );
  }

  // 3. Failed
  if (status === "error") {
    return (
      <Modal variant="error" title="Couldn't unsubscribe" text={error}>
        <button type="button" onClick={confirm} className={primaryBtn}>
          Try again
        </button>
        <button type="button" onClick={goHome} className={ghostBtn}>
          Back to home
        </button>
      </Modal>
    );
  }

  // 4. Confirmation prompt
  return (
    <Modal
      variant="mail"
      title="Unsubscribe?"
      text="You'll stop receiving emails when new articles are published.">
      <button
        type="button"
        onClick={confirm}
        disabled={status === "loading"}
        className={primaryBtn}>
        {status === "loading" && <Spinner />}
        {status === "loading" ? "Unsubscribing..." : "Yes, unsubscribe me"}
      </button>
      <button type="button" onClick={goHome} className={ghostBtn}>
        Keep me subscribed
      </button>
    </Modal>
  );
};

export default UnsubscribeNotice;
