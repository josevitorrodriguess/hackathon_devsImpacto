"use client";

import { DemandaProps } from "./demanda-card";

type Props = {
  demanda: DemandaProps & { descricao?: string };
  onFechar: () => void;
  onAceitar: (id: string) => void;
  onRejeitar: (id: string) => void;
};

export default function DemandaModal({
  demanda,
  onFechar,
  onAceitar,
  onRejeitar,
}: Props) {
  const prioridadeCores = (nivel: string) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold border";
    switch (nivel) {
      case "Baixa":
        return `${base} bg-blue-100 text-blue-700 border-blue-200`;
      case "Média":
        return `${base} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case "Alta":
        return `${base} bg-orange-100 text-orange-800 border-orange-200`;
      case "Urgente":
        return `${base} bg-red-100 text-red-700 border-red-200`;
      default:
        return `${base} bg-slate-100 text-slate-700 border-slate-200`;
    }
  };

  const statusBadge = (status: string) => {
    const base = "text-xs font-semibold px-3 py-1 rounded-full";
    if (status === "Em andamento")
      return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "Concluído") return `${base} bg-green-100 text-green-700`;
    if (status === "Rejeitado") return `${base} bg-red-100 text-red-700`;
    return `${base} bg-slate-200 text-slate-700`;
  };

  const descricaoAutomatica =
    demanda.descricao &&
    demanda.descricao.trim().toLowerCase().startsWith("registro automático");

  const descricaoFormatada = descricaoAutomatica
    ? `Esta demanda foi gerada automaticamente pelo sistema de monitoramento, referente à categoria: ${demanda.tipo.toLowerCase()}.`
    : demanda.descricao;

  const podeEditar = demanda.status === "Em andamento";

  // 🔹 Função genérica para atualizar o status via API
  async function atualizarStatus(acao: "aceitar" | "rejeitar") {
    try {
      const resposta = await fetch("/api/atualizarStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: demanda.id, acao }),
      });

      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data.error || "Erro ao atualizar");

      console.log(`✅ Status da demanda atualizado: ${data.chamado.status}`);

      // Atualiza o estado local do app (para refletir no front)
      if (acao === "aceitar") onAceitar(demanda.id);
      else onRejeitar(demanda.id);

      // Fecha o modal após sucesso
      onFechar();
    } catch (error) {
      console.error("❌ Falha ao atualizar status:", error);
      alert("Erro ao atualizar status da demanda. Tente novamente.");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-10 animate-scaleIn text-left"
      >
        {/* Botão fechar */}
        <button
          onClick={onFechar}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 text-2xl font-bold"
        >
          ×
        </button>

        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 leading-tight max-w-xl">
            {demanda.titulo}
          </h2>
          <span className={statusBadge(demanda.status)}>{demanda.status}</span>
        </div>

        {/* Escola e INEP */}
        <div className="mb-4">
          <p className="text-base font-medium text-slate-700">
            🏫 {demanda.escola}
          </p>
          {demanda.inep && (
            <p className="text-sm text-slate-500 mt-1">
              Código INEP:{" "}
              <span className="font-medium text-slate-700">{demanda.inep}</span>
            </p>
          )}
        </div>

        {/* Descrição */}
        {descricaoFormatada && (
          <div className="mb-6 pt-3 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Descrição do problema:
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {descricaoFormatada}
            </p>
          </div>
        )}

        {/* Informações gerais */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 font-medium">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
              {demanda.tipo}
            </span>
            <span className={prioridadeCores(demanda.prioridade)}>
              Prioridade: {demanda.prioridade}
            </span>
            <span className="text-slate-500">
              Criado em:{" "}
              {new Date(demanda.dataCriacao).toLocaleDateString("pt-BR")}
            </span>
            <span className="text-slate-500">ID: {demanda.id}</span>
          </div>
        </div>

        {/* 🔹 Botões (apenas se a demanda estiver em andamento) */}
        {podeEditar ? (
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => atualizarStatus("rejeitar")}
              className="px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-sm transition"
              style={{
                backgroundColor: "#b84a4a",
                borderColor: "#a34141",
              }}
            >
              Rejeitar
            </button>
            <button
              onClick={() => atualizarStatus("aceitar")}
              className="px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-sm transition"
              style={{
                backgroundColor: "#2e6b4d",
                borderColor: "#24583e",
              }}
            >
              Aceitar
            </button>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-lg bg-slate-50 text-slate-600 text-sm border border-slate-200">
            Esta demanda está marcada como{" "}
            <span className="font-semibold text-slate-800 lowercase">
              {demanda.status}.
            </span>{" "}
            Nenhuma ação adicional é necessária.
          </div>
        )}
      </div>

      {/* Animações */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
