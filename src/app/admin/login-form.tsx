"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="mb-8 flex items-center gap-3 text-accent">
        <Lock className="h-5 w-5" />
        <span className="text-sm uppercase tracking-[0.3em]">Admin access</span>
      </div>
      <h1 className="font-display text-3xl text-paper">Masuk sebagai admin</h1>
      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="rounded-lg border border-hairline/60 bg-bg-elevated px-4 py-3 text-paper outline-none transition-colors duration-200 focus:border-accent"
          />
        </label>
        {state?.error && <p className="text-sm text-accent-2">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {pending ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
