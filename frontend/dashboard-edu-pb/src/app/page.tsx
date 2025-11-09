"use client";

import { useState } from "react";

const highlightMetrics = [
  { label: "Escolas monitoradas", value: "1.238" },
  { label: "Relatórios enviados", value: "6.912" },
  { label: "Investimento anual", value: "R$ 124 mi" },
];

const mockData = [
  {
    title: "Índice de Frequência",
    change: "+4,2%",
    value: "92%",
    trend: "Alta após programas de transporte escolar",
  },
  {
    title: "Alimentação Escolar",
    change: "+12 contratos",
    value: "87% dos municípios",
    trend: "Licitações publicadas na última semana",
  },
  {
    title: "Obras em andamento",
    change: "31 novas",
    value: "152 projetos",
    trend: "Maternal e Ensino Fundamental I priorizados",
  },
];

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginOption = (type: "escola" | "secretaria") => {
    // Aqui você pode redirecionar para a página de login específica
    console.log(`Login como: ${type}`);
    setIsLoginModalOpen(false);
    // Exemplo: router.push(`/login/${type}`);
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans text-slate-900">
      <header className="sticky top-0 z-10 border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white font-semibold">
              EC
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-700">
                GIDE
              </p>
              <p className="text-xs text-slate-500">
              Gestão Integrada de Demandas Escolares.
              </p>
            </div>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#painel" className="hover:text-brand-700">
              Painel Público
            </a>
            <a href="#impacto" className="hover:text-brand-700">
              Impacto Social
            </a>
            <a href="#contato" className="hover:text-brand-700">
              Contato
            </a>
          </nav>
          <div className="relative">
            <button
              onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
              className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Entrar
            </button>

            {/* Modal de Login */}
            {isLoginModalOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-brand-100 bg-white p-4 shadow-2xl">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Escolha o tipo de acesso
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleLoginOption("escola")}
                      className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4 text-left transition hover:bg-brand-100 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Login Escolas
                        </p>
                        <p className="text-xs text-slate-500">
                          Acesso para escolas municipais
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleLoginOption("secretaria")}
                      className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4 text-left transition hover:bg-brand-100 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Login Secretaria
                        </p>
                        <p className="text-xs text-slate-500">
                          Acesso para gestores
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-8">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Transparência em tempo real
            </span>
            <div>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                O painel que aproxima escolas, secretaria e população.
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Acompanhe indicadores de matrículas, investimentos e logística
                escolar com dados públicos e narrativas acionáveis para toda a
                Paraíba.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700">
                Explorar painel
              </button>
              <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">
                Baixar relatório
              </button>
            </div>
            <div className="grid gap-6 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-brand-100 sm:grid-cols-3">
              {highlightMetrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="painel"
            className="rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl shadow-brand-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-500">
                  Painel Público
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Situação da Rede Estadual
                </p>
              </div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                Atualizado há 2h
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {mockData.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-brand-50 bg-brand-50/60 p-4"
                >
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold text-slate-800">{card.title}</p>
                    <span className="text-brand-600">{card.change}</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{card.trend}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-brand-200 p-4 text-sm text-slate-500">
              + Painel georreferenciado de transporte, atualização do Fundeb e
              alertas de infraestrutura em tempo real.
            </div>
          </div>
        </section>

        <section
          id="impacto"
          className="rounded-3xl border border-brand-100 bg-white p-10 shadow-2xl shadow-brand-100"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-500">
                Impacto social
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Transparência que gera confiança
              </h2>
              <p className="mt-4 text-base text-slate-600">
                A integração de dados entre escolas e secretaria mantém a
                população informada e envolve a comunidade em decisões mais
                rápidas. Tudo com linguagem acessível e indicadores fáceis de
                compartilhar.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-50 bg-brand-50/70 p-5">
                <p className="text-sm font-medium text-brand-600">
                  Comunidade
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  84% confiam no painel
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Pesquisa estadual de satisfação com dados abertos.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-50 bg-brand-50/70 p-5">
                <p className="text-sm font-medium text-brand-600">Governança</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  46% menos solicitações repetidas
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Relatórios consolidados e envio automatizado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contato"
          className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 p-10 text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">
            Fale conosco
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">
            Pronto para conectar toda a rede educacional?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Entre em contato para liberar acesso ao painel personalizado
            e integrar as informações da sua secretaria em poucos dias.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700">
              Agendar demonstração
            </button>
            <button className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-white">
              Receber novidades
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
