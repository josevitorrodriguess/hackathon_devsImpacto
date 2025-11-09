"use client";

export type DemandaProps = {
  id: string;
  titulo: string;
  escola: string;
  inep: string | number;
  tipo: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Urgente";
  dataCriacao: string;
  descricao?: string;
  status: string;
};

export default function DemandaCard({
  titulo,
  escola,
  tipo,
  prioridade,
  dataCriacao,
  status,
}: DemandaProps) {
  const statusPill = (s: string) => {
    const base = "text-xs font-semibold px-3 py-1 rounded-full";
    if (s === "Em andamento") return `${base} bg-yellow-100 text-yellow-700`;
    if (s === "Concluído") return `${base} bg-green-100 text-green-700`;
    if (s === "Rejeitado") return `${base} bg-red-100 text-red-700`;
    return `${base} bg-slate-200 text-slate-700`;
  };

  const prioridadeBadge = (nivel: string) => {
    const base = "text-xs font-semibold px-3 py-1 rounded-full";
    switch (nivel) {
      case "Baixa":
        return `${base} bg-blue-100 text-blue-700 border border-blue-200`;
      case "Média":
        return `${base} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "Alta":
        return `${base} bg-orange-100 text-orange-800 border border-orange-200`;
      case "Urgente":
        return `${base} bg-red-100 text-red-700 border border-red-200`;
      default:
        return `${base} bg-slate-100 text-slate-700 border border-slate-200`;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-slate-900 leading-snug">
          {titulo}
        </h3>
        <span className={statusPill(status)}>{status}</span>
      </div>

      {/* Escola */}
      <p className="text-sm text-slate-600 font-medium mb-3">{escola}</p>

      {/* Linha inferior alinhada e colorida */}
      <div className="flex items-center gap-4 text-xs text-slate-700 font-medium">
        {/* Tipo de problema (agora em tom branco-cinza suave) */}
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold shadow-sm border border-slate-200">
          {tipo}
        </span>

        {/* Prioridade com cor por nível */}
        <span className={prioridadeBadge(prioridade)}>
          Prioridade: {prioridade}
        </span>

        {/* Data */}
        <span className="text-slate-500">
          {new Date(dataCriacao).toLocaleDateString("pt-BR")}
        </span>
      </div>
    </div>
  );
}
