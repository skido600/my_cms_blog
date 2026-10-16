"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ghostBtn, primaryBtn, Spinner, Modal } from "./notice-modal";

type Status = "idle" | "loading" | "success" | "error";

const TOKEN_REGEX = /^[a-f0-9]{64}$/i;
const REDIRECT_MS = 4000;

const SubscriptionNotice = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const verifyToken = searchParams.get("verify");
  const validToken =
    verifyToken && TOKEN_REGEX.test(verifyToken) ? verifyToken : null;

  const goHome = () => router.push("/");

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => router.push("/"), REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [status, router]);

  const confirm = async () => {
    if (!validToken) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(`/api/v1/subscribe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: validToken }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        return;
      }

      setError(data.message || "Verification failed.");
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
        title="You're subscribed!"
        text="Your email has been confirmed. You'll get an email whenever a new article is published. You can unsubscribe anytime using the link at the bottom of any email we send. Taking you back home...">
        <button type="button" onClick={goHome} className={primaryBtn}>
          Continue reading
        </button>
      </Modal>
    );
  }

  // 2. No token, or a malformed one
  if (!validToken) {
    return (
      <Modal
        variant="error"
        title="Invalid link"
        text="This verification link is invalid or has been modified.">
        <button type="button" onClick={goHome} className={primaryBtn}>
          Back to home
        </button>
      </Modal>
    );
  }

  // 3. Failed (expired, or already used)
  if (status === "error") {
    return (
      <Modal variant="error" title="Couldn't confirm" text={error}>
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
      title="Confirm your subscription"
      text="One last step. Confirm your email address to get notified whenever a new article is published.">
      <button
        type="button"
        onClick={confirm}
        disabled={status === "loading"}
        className={primaryBtn}>
        {status === "loading" && <Spinner />}
        {status === "loading" ? "Confirming..." : "Confirm my subscription"}
      </button>
      <button type="button" onClick={goHome} className={ghostBtn}>
        Not now
      </button>
    </Modal>
  );
};

export default SubscriptionNotice;
