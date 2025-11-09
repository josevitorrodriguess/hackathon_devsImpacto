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
    trust: false,
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
        formData.cpf === mockSecretaria.cpf &&
        formData.email === mockSecretaria.email &&
        formData.token === mockSecretaria.token &&
        formData.password === mockSecretaria.password;

      if (isValid) {
        router.push("/secretaria");
      } else {
        setStatus("error");
        setMessage(
          "Credenciais inválidas. Use CPF 000.000.000-00, e-mail secretaria@educacao.pb.gov.br, token 654321 e senha painel-secretaria."
        );
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-50 to-surface-muted px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-brand-100 bg-white/90 p-10 shadow-2xl shadow-brand-100">
        <header className="space-y-3 border-b border-brand-100 pb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-500">
            Secretaria de Educação
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-slate-900">
                Autenticação estratégica para equipes gestoras.
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Utilize o login corporativo para acessar dashboards avançados,
                editor de comunicados oficiais e relatórios consolidados por
                região.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-sm text-slate-600">
              Plantão de suporte 24/7:{" "}
              <span className="font-semibold text-brand-700">0800 123 4545</span>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Perfis autorizados
            </p>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                Superintendências regionais com acesso a orçamentos e cronogramas
                de obras educacionais.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                Coordenações pedagógicas responsáveis por análises de matrículas
                e avaliações em larga escala.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                Núcleo de comunicação para disparo de alertas à comunidade.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-brand-100 bg-white p-8 shadow-lg shadow-brand-50">
            <header className="mb-6 space-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-500">
                Login Secretaria
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Validar identidade institucional
              </h2>
              <p className="text-sm text-slate-500">
                Prototipagem visual: substitua pelos componentes do provedor
                oficial (ex.: Keycloak, Auth0, Azure AD).
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
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
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
                  placeholder="nome@educacao.pb.gov.br"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
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
                  placeholder="Insira o código de 6 dígitos"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
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
                    name="trust"
                    checked={formData.trust}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-500"
                  />
                  Confiar neste dispositivo
                </label>
                <a href="#" className="font-medium text-brand-600">
                  Suporte urgente
                </a>
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

            <div className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-brand-50/80 p-4 text-sm text-slate-600">
              Novos usuários devem solicitar cadastro via ofício. Clique em
              <a href="#" className="font-semibold text-brand-600">
                {" "}
                habilitar unidade
              </a>{" "}
              para iniciar o processo.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
