"use server";

import { Resend } from "resend";

type ContactResult = { success: boolean; message: string };

export async function sendContact(formData: FormData): Promise<ContactResult> {
  const invalid = {
    success: false,
    message: "Confira os campos: informe seu nome, um e-mail válido e sua mensagem.",
  };
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = read("nome");
  const email = read("email");
  const organization = read("organizacao");
  const service = read("servico");
  const message = read("mensagem");

  if (
    !name || name.length > 120 ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    organization.length > 200 || service.length > 200 ||
    !message || message.length > 5000
  ) return invalid;

  const availability: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("disponibilidade-")) continue;
    if (key.length > 100 || typeof value !== "string" || value.length > 100 || availability.length >= 50) {
      return invalid;
    }
    availability.push(`${key.slice("disponibilidade-".length)}: ${value}`);
  }

  const failure = {
    success: false,
    message: "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
  };
  if (!process.env.RESEND_API_KEY) {
    console.error("Contact email: RESEND_API_KEY is not configured.");
    return failure;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Move Social <move@move.social>",
      to: ["move@move.social"],
      subject: "Novo contato pelo site — Move Social",
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Organização: ${organization || "Não informada"}`,
        `Serviço de interesse: ${service || "Não informado"}`,
        `Disponibilidade para contato:\n${availability.join("\n") || "Não informada"}`,
        `Mensagem:\n${message}`,
      ].join("\n\n"),
    });

    if (error || !data) {
      console.error("Contact email rejected:", error?.name || "missing_response");
      return failure;
    }
    return { success: true, message: "Mensagem enviada! Em breve entraremos em contato." };
  } catch {
    console.error("Contact email: sending failed.");
    return failure;
  }
}
