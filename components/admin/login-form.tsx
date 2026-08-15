"use client";

import { useFormStatus } from "react-dom";
import { signInAction } from "@/lib/admin/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ error }: { error?: string }) {
  const message =
    error === "invalid"
      ? "Incorrect email or password."
      : error === "unauthorized"
        ? "That account doesn't have admin access."
        : error === "missing"
          ? "Enter both email and password."
          : null;

  return (
    <form action={signInAction} className="admin-card w-full max-w-sm space-y-4 p-6">
      <div>
        <label className="admin-label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="admin-input" autoComplete="username" />
      </div>
      <div>
        <label className="admin-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="admin-input"
          autoComplete="current-password"
        />
      </div>
      {message && <p className="text-sm text-[#e5695c]">{message}</p>}
      <SubmitButton />
    </form>
  );
}
