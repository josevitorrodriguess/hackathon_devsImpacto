"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const mockSecretaria = {
  cpf: "000.000.000-00",
  email: "secretaria@educacao.pb.gov.br",
  token: "654321",
  password: "painel-secretaria",
};

export default function SecretariaLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cpf: "",
    email: "",
    token: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  // 🔹 Função para formatar CPF conforme o usuário digita
  const formatCPF = (value: string) => {
    // remove tudo que não for número
    const digits = value.replace(/\D/g, "");
    // aplica máscara incremental
    if (digits.length <= 3) return digits;
    if (digits.length <= 6)
      return digits.replace(/(\d{3})(\d+)/, "$1.$2");
    if (digits.length <= 9)
      return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatCPF(value) : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    setTimeout(() => {
      // const isValid =
      //   formData.cpf === mockSecretaria.cpf &&
      //   formData.email === mockSecretaria.email &&
      //   formData.token === mockSecretaria.token &&
      //   formData.password === mockSecretaria.password;

      router.push("/secretaria");
      // } else {
      //   setStatus("error");
      //   setMessage(
      //     "Credenciais inválidas. Use CPF 000.000.000-00, e-mail secretaria@educacao.pb.gov.br, token 654321 e senha painel-secretaria."
      //   );
      // }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-16 text-slate-900">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-100">
        <header className="mb-6 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-brand-500">
            Secretaria de Educação
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Login do time gestor
          </h1>
          <p className="text-sm text-slate-500">
            Use CPF 000.000.000-00, e-mail secretaria@educacao.pb.gov.br, token
            654321 e senha painel-secretaria.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="secretaria-cpf"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              CPF
            </label>
            <input
              id="secretaria-cpf"
              type="text"
              name="cpf"
              maxLength={14} // 🔹 limita o tamanho máximo para o padrão do CPF
              value={formData.cpf}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label
              htmlFor="secretaria-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-mail funcional
            </label>
            <input
              id="secretaria-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="nome@educacao.pb.gov.br"
            />
          </div>

          <div>
            <label
              htmlFor="secretaria-token"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Token temporário
            </label>
            <input
              id="secretaria-token"
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              placeholder="654321"
            />
          </div>

          <div>
            <label
              htmlFor="secretaria-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              id="secretaria-password"
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
            className="w-full rounded-2xl bg-brand-700 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-200 transition hover:bg-brand-600 disabled:opacity-60"
          >
            {status === "loading"
              ? "Validando acesso..."
              : "Entrar como secretaria"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-3 text-sm text-brand-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
