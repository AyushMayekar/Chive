"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { validateEmail, validateRequired } from "@/lib/validation";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    const nameErr = validateRequired(name, "Name");
    if (nameErr) next.name = nameErr;
    const emailErr = validateRequired(email, "Email") ?? validateEmail(email);
    if (emailErr) next.email = emailErr;
    const messageErr = validateRequired(message, "Message");
    if (messageErr) next.message = messageErr;

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  return (
    <section id="contact" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="reveal">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">Contact</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            Get in touch
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/60">
            Questions about a submission, a review, or Chive in general — send a note.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reveal panel mt-8 grid gap-5 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-paper/75">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="chive-input" />
              {errors.name && <span className="mt-1.5 block text-xs text-red-400">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-paper/75">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="chive-input"
              />
              {errors.email && <span className="mt-1.5 block text-xs text-red-400">{errors.email}</span>}
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm text-paper/75">Message</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chive-input resize-none"
            />
            {errors.message && <span className="mt-1.5 block text-xs text-red-400">{errors.message}</span>}
          </label>

          {sent && (
            <p className="text-sm text-mint">Thanks — your message has been sent.</p>
          )}

          <button
            type="submit"
            className="key-button key-button-accent flex items-center justify-center gap-2 py-3.5 text-sm font-semibold"
          >
            <Send size={15} />
            Send message
          </button>
        </form>

        <p className="reveal mt-6 flex items-center gap-2 text-sm text-paper/50">
          <Mail size={15} className="text-gold" />
          Or reach us directly at hello@chive.app
        </p>
      </div>
    </section>
  );
}
