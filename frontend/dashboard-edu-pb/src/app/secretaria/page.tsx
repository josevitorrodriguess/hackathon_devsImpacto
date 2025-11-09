"use client";

import { useMemo, useState } from "react";
import GlobalMap from "@/components/global-map";
import escolasData from "@/data/escolas.json";
import chamadosData from "@/data/chamados.json";
import ChatbotFab from "@/components/chatbot-fab";

type FiltroStatus = "Em andamento" | "Rejeitado" | "Concluído";

export default function SecretariaPage() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [filtro, setFiltro] = useState<FiltroStatus>("Em andamento");

  // 🔹 Prepara lista de chamados filtrável
  const chamados = useMemo(() => {
    return (chamadosData as any[]).map((c, i) => ({
      id: c.id || i,
      titulo: c.titulo || "Demanda sem título",
      descricao: c.descricao || "Sem descrição disponível.",
      status:
        c.status || (i % 3 === 0
          ? "Em andamento"
          : i % 3 === 1
            ? "Rejeitado"
            : "Concluído"),
      prioridade: c.prioridade || "Média",
      escola: c.escola || "Escola não informada",
    }));
  }, []);

  const chamadosFiltrados = useMemo(
    () => chamados.filter((c) => c.status === filtro),
    [chamados, filtro]
  );

  // 🔹 Processa escolas e heatmap
  const escolas = useMemo(() => {
    return escolasData
      .filter((e) => e.latitude && e.longitude)
      .map((e, i) => ({
        id: e["inep"]?.toString() || `escola-${i}`,
        nome: e["nome_escola"],
        pos: { lat: e.latitude, lng: e.longitude },
        endereco: e["endereco"],
        codigoINEP: e["inep"]?.toString(),
      }));
  }, []);

  const chamadosCounts = useMemo(() => {
    const map: Record<string, number> = {};
    chamadosData.forEach((c: any) => {
      const id =
        c.inep ||
        c.codigoINEP ||
        c.codigo_inep ||
        c.escola_inep ||
        c.id_escola ||
        c.escolaId;
      if (id) map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, []);

  const escolasComPeso = useMemo(() => {
    const arr = escolas.map((e) => ({
      ...e,
      count: chamadosCounts[e.codigoINEP || e.id] || 0,
    }));
    const maxCount = arr.reduce((m, x) => Math.max(m, x.count || 0), 0);

    return arr.map((x) => {
      const ratio = maxCount > 0 ? Math.sqrt((x.count || 0) / maxCount) : 0;
      const normalized = Math.round(1 + ratio * (60 - 1));
      return { ...x, weight: normalized };
    });
  }, [escolas, chamadosCounts]);

  // 🔹 Filtros de status
  const filtros: FiltroStatus[] = ["Em andamento", "Rejeitado", "Concluído"];

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-[1400px]">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr] items-stretch h-[80vh]">
          {/* 🔹 Lista de chamados à esquerda */}
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-100 flex flex-col">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Demandas escolares
              </h2>
            </header>

            {/* Filtros */}
            <div className="flex items-center gap-2 mb-6">
              {filtros.map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filtro === f
                      ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                      : "bg-brand-50 text-brand-700 opacity-50 hover:opacity-80"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Lista com rolagem */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[55vh] scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
              {chamadosFiltrados.length > 0 ? (
                chamadosFiltrados.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-base font-semibold text-slate-900">
                        {c.titulo}
                      </p>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${c.status === "Em andamento"
                            ? "bg-yellow-100 text-yellow-700"
                            : c.status === "Concluído"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{c.descricao}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {c.escola} • Prioridade: {c.prioridade}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma demanda com este status.
                </p>
              )}
            </div>
          </div>

          {/* 🔹 Mapa à direita */}
          <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-xl shadow-brand-100 h-[80vh]">
            <GlobalMap
              escolas={escolas}
              escolasComPeso={escolasComPeso}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
            />
          </div>
        </section>
      </div>
        {/* Chatbot disponível apenas para gestores (secretaria) */}
        <ChatbotFab />
    </div>
  );
}
