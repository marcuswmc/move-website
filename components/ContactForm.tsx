"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { sendContact } from "@/app/(frontend)/contato/actions";

export function ContactForm({ children }: { children: ReactNode }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await sendContact(data);
        setResult(response);
        if (response.success) form.reset();
      } catch {
        setResult({ success: false, message: "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} className="rounded-soft bg-move-purple p-5 text-white md:p-8">
      <fieldset disabled={pending}>
        {children}
        <button
          type="submit"
          className="mt-7 w-fit rounded-full bg-move-yellow px-7 py-3.5 font-bold text-move-purple transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar mensagem"}
        </button>
      </fieldset>
      <p role="status" aria-live="polite" aria-atomic="true" className={result ? "mt-4 text-sm text-white" : "sr-only"}>
        {result?.message}
      </p>
    </form>
  );
}
