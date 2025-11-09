import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CHAMADOS_PATH = path.join(process.cwd(), "src/data/chamados.json");

export async function PATCH(request: Request) {
	try {
		const { id, acao } = await request.json();

		if (!id || !acao) {
			return NextResponse.json(
				{ error: "Campos obrigatórios: id e acao ('aceitar', 'rejeitar' ou 'concluir')." },
				{ status: 400 }
			);
		}

		if (!fs.existsSync(CHAMADOS_PATH)) {
			return NextResponse.json(
				{ error: "Arquivo de chamados não encontrado." },
				{ status: 500 }
			);
		}

		// Lê o JSON atual
		const data = fs.readFileSync(CHAMADOS_PATH, "utf-8");
		let chamados = JSON.parse(data || "[]");

		// Localiza o chamado pelo ID
		const index = chamados.findIndex((c: any) => c.id === id);
		if (index === -1) {
			return NextResponse.json(
				{ error: `Chamado com ID ${id} não encontrado.` },
				{ status: 404 }
			);
		}

		let novoStatus = chamados[index].status;

		// 🔹 Define o novo status de acordo com a ação recebida
		if (acao === "aceitar") {
			// Secretaria aceita -> vai para escola confirmar
			novoStatus = "Aguardando Confirmação da Escola";
		} else if (acao === "rejeitar") {
			novoStatus = "Rejeitado";
		} else if (acao === "concluir") {
			// Escola confirma -> marca como concluído
			novoStatus = "Concluído";
		} else {
			return NextResponse.json(
				{ error: "Ação inválida. Use 'aceitar', 'rejeitar' ou 'concluir'." },
				{ status: 400 }
			);
		}

		chamados[index].status = novoStatus;

		fs.writeFileSync(CHAMADOS_PATH, JSON.stringify(chamados, null, 2), "utf-8");

		console.log(`✅ Chamado ${id} atualizado para status: ${novoStatus}`);

		return NextResponse.json({
			message: `Status atualizado com sucesso para '${novoStatus}'.`,
			chamado: chamados[index],
		});
	} catch (error) {
		console.error("Erro ao atualizar status:", error);
		return NextResponse.json(
			{ error: "Erro interno ao atualizar status da demanda." },
			{ status: 500 }
		);
	}
}
