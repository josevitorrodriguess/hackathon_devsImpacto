"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const mockCredenciais = {
  inep: "25012345",
  email: "direcao@escola.pb.gov.br",
  password: "painel-escola",
};

export default function EscolaLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    inep: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    setTimeout(() => {
      const isValid =
        formData.inep === mockCredenciais.inep &&
        formData.email === mockCredenciais.email &&
        formData.password === mockCredenciais.password;

      if (isValid) {
        router.push("/escolas");
      } else {
        setStatus("error");
        setMessage(
          "Credenciais inválidas para o ambiente de demonstração. Use o INEP 25012345, e-mail direcao@escola.pb.gov.br e senha painel-escola."
        );
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-16 text-slate-900">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-100">
        <header className="mb-6 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-brand-500">
            Portal das Escolas
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Entre para acessar o painel
          </h1>
          <p className="text-sm text-slate-500">
            Use INEP 25012345, e-mail direcao@escola.pb.gov.br e senha painel-escola.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="escola-id"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Código INEP
            </label>
            <input
              id="escola-id"
              type="text"
              name="inep"
              value={formData.inep}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="25012345"
            />
          </div>
          <div>
            <label
              htmlFor="escola-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-mail institucional
            </label>
            <input
              id="escola-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="nome@escola.pb.gov.br"
            />
          </div>
          <div>
            <label
              htmlFor="escola-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              id="escola-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-2xl bg-brand-600 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {status === "loading" ? "Validando..." : "Entrar no painel"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
