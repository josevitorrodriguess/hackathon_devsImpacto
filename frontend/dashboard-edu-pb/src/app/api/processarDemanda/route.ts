import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Caminho do arquivo local onde os chamados são armazenados
const CHAMADOS_PATH = path.join(process.cwd(), "src/data/chamados.json");

export async function POST(request: Request) {
	try {
		const { texto, inep, escolaId } = await request.json();

		if (!texto || !inep || !escolaId) {
			return NextResponse.json(
				{ error: "Campos obrigatórios: texto, inep e escolaId." },
				{ status: 400 }
			);
		}

		console.log("📩 Texto recebido:", texto);
		console.log("🏫 Escola ID:", escolaId, "| Código INEP:", inep);

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const prompt = `
Você é um assistente que recebe descrições livres de problemas em escolas públicas
e deve organizá-las no formato JSON de um chamado.

Retorne apenas JSON válido, no seguinte formato:

{
  "titulo": "string resumida do problema",
  "descricao": "detalhamento original adaptado",
  "tipo": "Infraestrutura | Material Didático | Recursos Humanos | Tecnologia | Transporte Escolar | Alimentação Escolar | Segurança | Limpeza e Manutenção | Gestão e Administração | Acessibilidade | Energia e Iluminação | Saneamento e Água | Comunicação e Internet | Outros",
  "prioridade": "Baixa | Média | Alta | Urgente",
  "status": "Aguardando Confirmação da Escola",
  "dataCriacao": "YYYY-MM-DDTHH:mm:ssZ"
}

Texto recebido:
"""${texto}"""
`;

		const result = await model.generateContent(prompt);
		let resposta = result.response.text();


		resposta = resposta.replace(/```json/g, "").replace(/```/g, "").trim();

		let chamadoGerado;
		try {
			chamadoGerado = JSON.parse(resposta);
		} catch (e) {
			console.warn("Modelo retornou texto fora do formato JSON. Texto original:", resposta);
			chamadoGerado = {
				titulo: "Chamado não estruturado",
				descricao: resposta,
				tipo: "Outros",
				prioridade: "Média",
				status: "Aguardando Confirmação da Escola",
				dataCriacao: new Date().toISOString(),
			};
		}

		const novoChamado = {
			inep: Number(inep),
			...chamadoGerado,
		};

		let chamadosAtuais: any[] = [];
		if (fs.existsSync(CHAMADOS_PATH)) {
			const data = fs.readFileSync(CHAMADOS_PATH, "utf-8");
			chamadosAtuais = JSON.parse(data || "[]");
		}

		chamadosAtuais.push(novoChamado);


		fs.writeFileSync(CHAMADOS_PATH, JSON.stringify(chamadosAtuais, null, 2), "utf-8");

		console.log("Novo chamado salvo com sucesso:", novoChamado);

		return NextResponse.json(novoChamado);
	} catch (error) {
		console.error("Erro interno na rota /api/processarDemanda:", error);
		return NextResponse.json({ error: "Falha ao processar a demanda." }, { status: 500 });
	}
}
