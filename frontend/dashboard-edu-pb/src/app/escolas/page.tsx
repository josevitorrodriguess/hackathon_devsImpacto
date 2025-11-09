"use client";

import { useEffect, useMemo, useState } from "react";
import SchoolDashboard from "@/components/school-dashboard";
import DemandaCard, { DemandaProps } from "@/components/demanda-card";
import DemandaModalEscola from "@/components/demanda-modal-escola";

type Aba = "visao" | "enviar";

function safeParseUsuario(): { inep?: string; email?: string } | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") return obj;
    return null;
  } catch {
    return null;
  }
}

function sanitizeInep(value: unknown): string | null {
  if (value == null) return null;
  const onlyDigits = String(value).replace(/[^\d]/g, "");
  return onlyDigits.length ? onlyDigits : null;
}

async function fetchChamadosByInep(inep: string | number): Promise<DemandaProps[]> {
  const url = `/api/getDemanda?inep=${encodeURIComponent(String(inep))}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar chamados (${res.status})`);
  return (await res.json()) as DemandaProps[];
}

export default function EscolasPage() {
  const [activeTab, setActiveTab] = useState<Aba>("visao");
  const [prompt, setPrompt] = useState("");
  const [usuario, setUsuario] = useState<{ inep?: string; email?: string } | null>(null);
  const [inep, setInep] = useState<string | null>(null);
  const [chamados, setChamados] = useState<DemandaProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [demandaSelecionada, setDemandaSelecionada] = useState<DemandaProps | null>(null);

  // 🔹 Carrega dados
  useEffect(() => {
    const u = safeParseUsuario();
    setUsuario(u);
    const i = sanitizeInep(u?.inep);
    setInep(i);

    async function run() {
      if (!i) return;
      setLoading(true);
      setErro(null);
      try {
        const data = await fetchChamadosByInep(i);
        setChamados(data);
      } catch (e: any) {
        setErro(e?.message || "Erro ao carregar chamados");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  // 🔍 Busca local
  const chamadosFiltrados = useMemo(() => {
    if (!busca.trim()) return chamados;
    const q = busca.toLowerCase();
    return chamados.filter((c) =>
      [c.titulo, c.descricao, c.tipo, c.status, c.prioridade]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [busca, chamados]);

  const tabButtonClasses = (selected: boolean) =>
    `rounded-2xl px-6 py-2 text-sm font-semibold transition ${selected
      ? "bg-brand-600 text-white shadow shadow-brand-200"
      : "border border-brand-200 bg-white text-brand-700 hover:border-brand-500"
    }`;

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* ===== Abas ===== */}
        <div
          role="tablist"
          className="flex flex-wrap items-center gap-3 rounded-3xl border border-brand-100 bg-white/70 p-2 shadow-inner shadow-brand-50"
        >
          <button
            className={tabButtonClasses(activeTab === "visao")}
            onClick={() => setActiveTab("visao")}
          >
            Visão Geral
          </button>
          <button
            className={tabButtonClasses(activeTab === "enviar")}
            onClick={() => setActiveTab("enviar")}
          >
            Enviar Demanda
          </button>
        </div>

        {/* ===== VISÃO GERAL ===== */}
        {activeTab === "visao" ? (
          <>
            <SchoolDashboard />

            {/* Lista de demandas enviadas */}
            <section className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-50 mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Demandas enviadas
                </h2>
              </div>

              <input
                type="search"
                placeholder="Buscar por título, status, tipo..."
                className="w-full sm:w-64 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 mb-6"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />

              {loading && (
                <p className="text-slate-600 text-sm">Carregando demandas...</p>
              )}
              {erro && <p className="text-rose-600 text-sm">{erro}</p>}

              {!loading && !erro && (
                <>
                  {chamadosFiltrados.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brand-200 p-10 text-center text-sm text-slate-600">
                      Nenhuma demanda enviada ainda.
                    </div>
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {chamadosFiltrados.map((c) => (
                        <li
                          key={c.id}
                          className="cursor-pointer"
                          onClick={() => setDemandaSelecionada(c)}
                        >
                          <DemandaCard {...c} />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          </>
        ) : (
          /* ===== ENVIAR DEMANDA ===== */
          <section className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-50">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-500">
              Canal direto
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Envie uma nova demanda
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Descreva sua necessidade com o máximo de detalhes para agilizar o atendimento.
            </p>

            {/* Formulário */}
            <div className="mt-6 space-y-4">
              <textarea
                rows={7}
                placeholder="Ex.: Precisamos de reposição de tablets para o laboratório de informática."
                className="w-full rounded-3xl border border-brand-100 bg-brand-50/70 p-4 text-sm text-slate-700 shadow-inner shadow-brand-50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-700"
                onClick={async () => {
                  if (!prompt.trim()) return alert("Digite uma demanda antes de enviar!");
                  const u = safeParseUsuario();
                  const i = sanitizeInep(u?.inep);
                  if (!i) return alert("⚠️ Nenhum INEP encontrado no localStorage.");

                  try {
                    const res = await fetch("/api/processarDemanda", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        texto: prompt,
                        inep: i,
                        escolaId: "default",
                      }),
                    });

                    const data = await res.json();
                    if (data?.chamado) {
                      setChamados((prev) => [data.chamado, ...prev]);
                    } else {
                      const fresh = await fetchChamadosByInep(i);
                      setChamados(fresh);
                    }

                    setPrompt("");
                    alert("Demanda enviada com sucesso!");
                    setActiveTab("visao"); // ✅ volta para visão geral
                  } catch {
                    alert("Erro ao enviar demanda. Tente novamente.");
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ===== Modal da demanda ===== */}
      {demandaSelecionada && (
        <DemandaModalEscola
          demanda={demandaSelecionada}
          onFechar={() => setDemandaSelecionada(null)}
          onAceitar={(id) =>
            setChamados((prev) =>
              prev.map((d) =>
                d.id === id ? { ...d, status: "Concluído" } : d
              )
            )
          }
        />
      )}
    </div>
  );
}
