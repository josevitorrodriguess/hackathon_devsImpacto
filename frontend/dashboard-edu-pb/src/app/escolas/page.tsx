"use client";

import { useState } from "react";
import SchoolDashboard from "@/components/school-dashboard";



const indicadoresEscola = [
  { title: "Frequência média", value: "93%", detail: "Alta consistência nas últimas 4 semanas" },
  { title: "Solicitações pendentes", value: "12", detail: "Manutenção, transporte e TI" },
  { title: "Entregas merenda", value: "98%", detail: "Municípios abastecidos nesta semana" },
];

const agendaEscola = [
  { date: "Seg, 12 Ago", title: "Reunião com coordenação pedagógica", tag: "Pedagógico" },
  { date: "Qua, 14 Ago", title: "Treinamento de transporte escolar", tag: "Logística" },
  { date: "Sex, 16 Ago", title: "Envio de boletim alimentar", tag: "Operacional" },
];

const comunicados = [
  { title: "Atualização do censo escolar", desc: "Valide turmas e turnos até 20/08 para liberar o relatório estadual." },
  { title: "Monitoramento climático", desc: "Envie alertas de rotas alternativas para zonas rurais." },
];

const acoesRapidas = [
  { title: "Registrar ocorrência", desc: "Infraestrutura, TI, segurança" },
  { title: "Emitir declaração", desc: "Histórico escolar e transferência" },
  { title: "Atualizar cardápio", desc: "Nutrição e merenda escolar" },
  { title: "Submeter relatório", desc: "Prestação de contas mensal" },
];

const statusTransporte = [
  { title: "Zona Norte", value: "92%", detail: "2 rotas com atraso leve" },
  { title: "Zona Oeste", value: "100%", detail: "Operação normal" },
  { title: "Zona Rural", value: "84%", detail: "Ajustes após chuvas" },
];

export default function EscolasPage() {
  const [activeTab, setActiveTab] = useState<"visao" | "demandas">("visao");

  // 🟢 Estado para armazenar o texto digitado no campo de demanda
  const [prompt, setPrompt] = useState("");

  const tabButtonClasses = (selected: boolean) =>
    `rounded-2xl px-6 py-2 text-sm font-semibold transition ${selected
      ? "bg-brand-600 text-white shadow shadow-brand-200"
      : "border border-brand-200 bg-white text-brand-700 hover:border-brand-500"
    }`;

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-white via-brand-50 to-white p-10 shadow-2xl shadow-brand-100">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">
                Escolas conectadas
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Operação diária com dados e alertas em tempo real.
              </h1>
              <p className="text-base text-slate-600">
                Acompanhe frequência, logística, repasses e comunicação oficial em um painel desenhado para diretores, coordenadores e equipes administrativas.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700">
                  Exportar relatório
                </button>
                <button className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-white">
                  Compartilhar com comunidade
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-brand-100 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-500">Resumo diário</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
                {[
                  { label: "Presenças confirmadas", value: "18.402" },
                  { label: "Alertas resolvidos", value: "47" },
                  { label: "Chamados abertos", value: "9" },
                  { label: "Boletins enviados", value: "312" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div
          role="tablist"
          aria-label="Conteúdo da página"
          className="flex flex-wrap items-center gap-3 rounded-3xl border border-brand-100 bg-white/70 p-2 shadow-inner shadow-brand-50"
        >
          <button
            id="tab-visao"
            role="tab"
            aria-selected={activeTab === "visao"}
            aria-controls="painel-visao"
            tabIndex={activeTab === "visao" ? 0 : -1}
            className={tabButtonClasses(activeTab === "visao")}
            onClick={() => setActiveTab("visao")}
          >
            Visão geral
          </button>
          <button
            id="tab-demandas"
            role="tab"
            aria-selected={activeTab === "demandas"}
            aria-controls="painel-demandas"
            tabIndex={activeTab === "demandas" ? 0 : -1}
            className={tabButtonClasses(activeTab === "demandas")}
            onClick={() => setActiveTab("demandas")}
          >
            Demandas
          </button>
        </div>

        {activeTab === "visao" ? (
          <>
            {/* Dashboard interativo com estatísticas por escola (mocked) */}
            <SchoolDashboard />
            {/* restante da visão geral (poderíamos adicionar se necessário) */}
          </>
        ) : (
          <section
            id="painel-demandas"
            role="tabpanel"
            aria-labelledby="tab-demandas"
            className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-50"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-500">Canal direto</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Envie uma nova demanda para a secretaria
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Descreva sua necessidade com o máximo de detalhes para agilizar o atendimento.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="prompt-demandas"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  Prompt da demanda
                </label>
                <textarea
                  id="prompt-demandas"
                  rows={7}
                  placeholder="Ex.: Precisamos de reposição de tablets para o laboratório de informática."
                  className="w-full rounded-3xl border border-brand-100 bg-brand-50/70 p-4 text-sm text-slate-700 shadow-inner shadow-brand-50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <button
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-700"
                onClick={async () => {
                  if (!prompt.trim()) return alert("Digite uma demanda antes de enviar!");

                  // 🔹 Lê o INEP salvo no localStorage
                  const inep = localStorage.getItem("inep");

                  if (!inep) {
                    alert("⚠️ Nenhum INEP encontrado. Configure no localStorage antes de enviar.");
                    return;
                  }

                  console.log("📨 Enviando demanda:", prompt);
                  console.log("🏫 INEP detectado:", inep);

                  try {
                    const res = await fetch("/api/processarDemanda", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        texto: prompt,
                        inep,
                        escolaId: "default",
                      }),
                    });

                    const data = await res.json();
                    console.log("Chamado estruturado salvo:", data);
                    alert("Demanda enviada com sucesso!");
                  } catch (error) {
                    alert("Erro ao enviar demanda. Tente novamente.");
                  }
                }}
              >
                Enviar demanda
              </button>


            </div>
          </section>
        )}
      </div>
    </div>
  );
}
