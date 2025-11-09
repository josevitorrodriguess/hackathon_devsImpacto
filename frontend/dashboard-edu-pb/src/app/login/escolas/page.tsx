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
    remember: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    <div className="min-h-screen bg-brand-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row">
        <section className="flex flex-1 flex-col justify-center gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Portal das Escolas
          </span>
          <h1 className="text-4xl font-bold leading-tight">
            Acesse dados, relatórios e alertas da sua escola em segundos.
          </h1>
          <p className="text-lg text-slate-600">
            Use suas credenciais fornecidas pela Secretaria Estadual de Educação
            para acompanhar transporte, alimentação escolar e registros
            acadêmicos em tempo real. O acesso é seguro e auditado 24/7.
          </p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-brand-600" />
              Atualizações automáticas do censo e frequência.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-brand-600" />
              Interface adaptada para diretores e coordenadores.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-brand-600" />
              Integração com solicitações de manutenção e logística.
            </li>
          </ul>
        </section>

        <section className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-100">
            <header className="mb-8 space-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-500">
                Login Escolas
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Identifique-se para continuar
              </h2>
              <p className="text-sm text-slate-500">
                Campos simulados para o protótipo. Substitua pela integração de
                autenticação quando disponível.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="escola-id"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Código INEP / ID da Escola
                </label>
                <input
                  id="escola-id"
                  type="text"
                  placeholder="Ex: 25012345"
                  name="inep"
                  value={formData.inep}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
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
                  placeholder="nome@escola.pb.gov.br"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
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
                  placeholder="********"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-500"
                  />
                  Continuar conectado
                </label>
                <a href="#" className="font-medium text-brand-600">
                  Esqueceu a senha?
                </a>
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

            <p className="mt-6 text-center text-sm text-slate-500">
              Precisa de ajuda?{" "}
              <a href="#" className="font-semibold text-brand-600">
                Abrir chamado
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
