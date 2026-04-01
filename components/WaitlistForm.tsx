"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're in. We'll be in touch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-charcoal text-white rounded-xl px-8 py-6 text-center">
        <p className="font-fraunces text-xl font-semibold mb-1">You&apos;re in.</p>
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-full border-2 border-charcoal text-charcoal placeholder-gray-400 focus:outline-none focus:border-charcoal bg-white"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-charcoal text-white font-semibold px-6 py-3 rounded-full hover:bg-charcoal/80 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Join the Build"}
      </button>
      {status === "error" && (
        <p className="text-red-700 text-sm mt-1 text-center w-full">{message}</p>
      )}
    </form>
  );
}
