"use client";

import { useMemo, useState } from "react";
import GlobalMap from "@/components/global-map";
import escolasData from "@/data/escolas.json";
import chamadosData from "@/data/chamados.json";
import ChatbotFab from "@/components/chatbot-fab";
import DemandaCard from "@/components/demanda-card";
import DemandaModal from "@/components/demanda-modal";
import { toast } from "sonner"; // 👈 import do novo sistema

type StatusVisivel =
  | "Em andamento"
  | "Rejeitado"
  | "Concluído"
  | "Aguardando Confirmação da Escola";

type FiltroStatus = StatusVisivel;

type ChamadoJSON = {
  id: string;
  inep: string | number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  tipo: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Urgente";
  status: StatusVisivel;
};

export default function SecretariaPage() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [filtro, setFiltro] = useState<FiltroStatus>("Em andamento");
  const [buscaEscola, setBuscaEscola] = useState("");
  const [buscaTipo, setBuscaTipo] = useState("");
  const [chamados, setChamados] = useState(() =>
    (chamadosData as ChamadoJSON[]).map((c) => ({ ...c }))
  );
  const [demandaSelecionada, setDemandaSelecionada] = useState<
    (ChamadoJSON & { escola: string }) | null
  >(null);

  const escolaLookup = useMemo(() => {
    const map: Record<string, { nome: string; endereco?: string }> = {};
    (escolasData as any[]).forEach((e) => {
      const inep = String(e["inep"] ?? e["Código INEP"] ?? "");
      if (!inep) return;
      map[inep] = {
        nome:
          e["nome_escola"] ??
          e["Nome da escola"] ??
          e["nome"] ??
          `Escola ${inep}`,
        endereco: e["endereco"] ?? e["Endereço"],
      };
    });
    return map;
  }, []);

  const chamadosComEscola = useMemo(() => {
    return chamados.map((c) => ({
      ...c,
      escola: escolaLookup[c.inep]?.nome ?? "Escola não informada",
    }));
  }, [chamados, escolaLookup]);

  const chamadosFiltrados = useMemo(() => {
    const nomeTerm = buscaEscola.trim().toLowerCase();
    const tipoTerm = buscaTipo.trim().toLowerCase();

    return chamadosComEscola.filter((c) => {
      if (c.status !== filtro) return false;
      const matchEscola = nomeTerm
        ? c.escola.toLowerCase().includes(nomeTerm)
        : true;
      const matchTipo = tipoTerm ? c.tipo.toLowerCase().includes(tipoTerm) : true;
      return matchEscola && matchTipo;
    });
  }, [buscaEscola, buscaTipo, chamadosComEscola, filtro]);

  const escolas = useMemo(() => {
    return (escolasData as any[])
      .filter((e) => e.latitude && e.longitude)
      .map((e, i) => ({
        id: String(e["inep"] ?? `escola-${i}`),
        nome:
          e["nome_escola"] ??
          e["Nome da escola"] ??
          e["nome"] ??
          `Escola ${i + 1}`,
        pos: { lat: e.latitude, lng: e.longitude },
        endereco: e["endereco"] ?? e["Endereço"],
        codigoINEP: String(e["inep"] ?? e["Código INEP"] ?? ""),
      }));
  }, []);

  const chamadosCounts = useMemo(() => {
    const map: Record<string, number> = {};
    chamados.forEach((c) => {
      if (c.inep) map[c.inep] = (map[c.inep] || 0) + 1;
    });
    return map;
  }, [chamados]);

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

  const filtros: FiltroStatus[] = [
    "Em andamento",
    "Concluído",
    "Rejeitado",
    "Aguardando Confirmação da Escola",
  ];

  const handleAceitar = (id: string) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Concluído" } : c))
    );

    // força re-render e mantém filtro
    setChamados((prev) => [...prev]);
    setDemandaSelecionada(null);

    toast.success("Demanda marcada como concluída!");
  };

  const handleRejeitar = (id: string) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejeitado" } : c))
    );

    setChamados((prev) => [...prev]);
    setDemandaSelecionada(null);

    toast.error("Demanda rejeitada.");
  };
  return (
    <div className="min-h-screen bg-surface-muted px-4 py-8 text-slate-900 relative">
      <div className="mx-auto w-full max-w-[1400px]">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr] items-stretch h-[80vh]">
          {/* 🔹 Lista de chamados */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg flex flex-col relative z-10">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Demandas escolares
              </h2>
            </header>

            {/* 🎨 Filtro & buscas */}
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filtro-status"
                  className="text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="filtro-status"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as FiltroStatus)}
                  className="border border-slate-300 bg-white rounded-lg px-4 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-0 hover:bg-slate-50 transition-colors"
                >
                  {filtros.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="busca-escola"
                  className="text-sm font-medium text-slate-700"
                >
                  Escola
                </label>
                <input
                  id="busca-escola"
                  type="text"
                  value={buscaEscola}
                  onChange={(e) => setBuscaEscola(e.target.value)}
                  placeholder="Digite o nome ou INEP"
                  className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="busca-tipo"
                  className="text-sm font-medium text-slate-700"
                >
                  Tipo do problema
                </label>
                <input
                  id="busca-tipo"
                  type="text"
                  value={buscaTipo}
                  onChange={(e) => setBuscaTipo(e.target.value)}
                  placeholder="Ex.: Transporte, Infraestrutura"
                  className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-200"
                />
              </div>
            </div>

            {/* 🔹 Lista de demandas */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[55vh] scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
              {chamadosFiltrados.length > 0 ? (
                chamadosFiltrados.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setDemandaSelecionada(c)}
                    className="cursor-pointer"
                  >
                    <DemandaCard
                      id={c.id}
                      titulo={c.titulo}
                      escola={c.escola}
                      tipo={c.tipo}
                      prioridade={c.prioridade}
                      dataCriacao={c.dataCriacao}
                      descricao={c.descricao}
                      status={c.status}
                      inep={c.inep}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma demanda com este status.
                </p>
              )}
            </div>
          </div>

          {/* 🔹 Mapa */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl h-[80vh] relative z-0">
            <GlobalMap
              escolas={escolas}
              escolasComPeso={escolasComPeso}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
            />
          </div>
        </section>
      </div>

      {/* Modal */}
      {demandaSelecionada && (
        <DemandaModal
          demanda={demandaSelecionada}
          onFechar={() => setDemandaSelecionada(null)}
          onAceitar={handleAceitar}
          onRejeitar={handleRejeitar}
        />
      )}

      <ChatbotFab />
    </div>
  );
}
