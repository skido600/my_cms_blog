export const subscribe = async (email: string) => {
  const response = await fetch(`/api/v1/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Subscription failed");
  }

  return data;
};
