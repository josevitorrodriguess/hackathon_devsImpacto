"use client";

import { DemandaProps } from "./demanda-card";

type Props = {
	demanda: DemandaProps & { descricao?: string };
	onFechar: () => void;
	onAceitar: (id: string) => void;
};

export default function DemandaModalEscola({
	demanda,
	onFechar,
	onAceitar,
}: Props) {
	// 🔹 Paleta unificada
	const prioridadeCores = (nivel: string) => {
		const base =
			"px-3 py-1 rounded-full text-sm font-semibold border transition-colors";
		return `${base} bg-brand-50 text-brand-700 border-brand-200`;
	};

	const statusBadge = (status: string) => {
		const base =
			"text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-300";
		switch (status) {
			case "Em andamento":
				return `${base} bg-amber-50 text-amber-700 border-amber-200`;
			case "Concluído":
				return `${base} bg-brand-100 text-brand-700 border-brand-200`;
			case "Rejeitado":
				return `${base} bg-rose-100 text-rose-700 border-rose-200`;
			case "Aguardando Confirmação da Escola":
				return `${base} bg-blue-50 text-blue-700 border-blue-200`;
			default:
				return `${base} bg-slate-100 text-slate-700 border-slate-200`;
		}
	};

	const descricaoAutomatica =
		demanda.descricao &&
		demanda.descricao.trim().toLowerCase().startsWith("registro automático");

	const descricaoFormatada = descricaoAutomatica
		? `Esta demanda foi gerada automaticamente pelo sistema de monitoramento, referente à categoria: ${demanda.tipo.toLowerCase()}.`
		: demanda.descricao;

	// 🔹 Escola só pode confirmar se o status for “Aguardando Confirmação da Escola”
	const podeConfirmar = demanda.status === "Aguardando Confirmação da Escola";

	// 🔹 Atualiza o status via API
	async function concluirDemanda() {
		try {
			const resposta = await fetch("/api/atualizarStatus", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: demanda.id, acao: "concluir" }),
			});

			const data = await resposta.json();
			if (!resposta.ok) throw new Error(data.error || "Erro ao atualizar");

			onAceitar(demanda.id);
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
			{/* Container principal */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative bg-white rounded-3xl border border-brand-100 shadow-2xl shadow-brand-50 w-full max-w-3xl p-10 animate-slideUp text-left"
			>
				{/* Botão fechar */}
				<button
					onClick={onFechar}
					className="absolute top-5 right-5 text-slate-500 hover:text-brand-700 text-2xl font-bold transition"
				>
					×
				</button>

				{/* Cabeçalho */}
				<div className="flex justify-between items-start mb-6 animate-fadeSlideIn">
					<h2 className="text-2xl font-semibold text-slate-900 leading-tight max-w-xl">
						{demanda.titulo}
					</h2>
					<span className={statusBadge(demanda.status)}>{demanda.status}</span>
				</div>

				{/* Escola e INEP */}
				<div className="mb-4 animate-fadeSlideIn delay-100">
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
					<div className="mb-6 pt-3 border-t border-slate-100 animate-fadeSlideIn delay-150">
						<h3 className="text-sm font-semibold text-slate-800 mb-2">
							Descrição do problema:
						</h3>
						<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
							{descricaoFormatada}
						</p>
					</div>
				)}

				{/* Informações gerais */}
				<div className="border-t border-slate-100 pt-4 animate-fadeSlideIn delay-200">
					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 font-medium">
						<span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
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

				{/* 🔹 Botão — só aparece se pode confirmar */}
				{podeConfirmar ? (
					<div className="flex justify-end mt-8 animate-bounceIn">
						<button
							onClick={concluirDemanda}
							className="px-8 py-3 text-sm font-semibold text-white rounded-full shadow-lg shadow-brand-200 bg-brand-600 hover:bg-brand-700 transition-all transform hover:-translate-y-0.5 active:scale-95"
						>
							Concluir
						</button>
					</div>
				) : (
					<div className="mt-8 p-4 rounded-lg bg-slate-50 text-slate-600 text-sm border border-slate-200 animate-fadeSlideIn delay-300">
						Esta demanda está marcada como{" "}
						<span className="font-semibold text-slate-800 lowercase">
							{demanda.status}.
						</span>{" "}
						Nenhuma ação adicional é necessária.
					</div>
				)}
			</div>

			{/* 🎞️ Animações */}
			<style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          50% {
            transform: scale(1.02);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.35s ease-out;
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out both;
        }
        .animate-bounceIn {
          animation: bounceIn 0.4s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
		</div>
	);
}
