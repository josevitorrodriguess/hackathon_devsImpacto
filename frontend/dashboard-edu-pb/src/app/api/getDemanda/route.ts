import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CHAMADOS_PATH = path.join(process.cwd(), "src/data/chamados.json");

// Cache simples em memória + índice por INEP
type Chamado = {
	id: string;
	inep: number;
	dataCriacao?: string;
	[k: string]: any;
};

let cache: {
	mtime: number;
	byInep: Map<number, Chamado[]>;
} | null = null;

function buildIndex(arr: Chamado[]) {
	const byInep = new Map<number, Chamado[]>();
	for (const c of arr) {
		const key = Number(c.inep);
		if (!byInep.has(key)) byInep.set(key, []);
		byInep.get(key)!.push(c);
	}
	return byInep;
}

function loadIfChanged() {
	if (!fs.existsSync(CHAMADOS_PATH)) {
		cache = { mtime: 0, byInep: new Map() };
		return;
	}
	const stat = fs.statSync(CHAMADOS_PATH);
	const mtime = stat.mtimeMs;
	if (cache && cache.mtime === mtime) return; // cache válido

	// Recarrega do disco e reindexa
	const raw = fs.readFileSync(CHAMADOS_PATH, "utf-8") || "[]";
	let todos: Chamado[] = [];
	try {
		const parsed = JSON.parse(raw);
		todos = Array.isArray(parsed) ? parsed : [];
	} catch {
		todos = [];
	}
	cache = { mtime, byInep: buildIndex(todos) };
}

// Evita caching estático do Next no build
export const dynamic = "force-dynamic";

export async function GET(
	_request: Request,
	context: { params: { inep: string } }
) {
	try {
		const inepParam = context.params?.inep;
		const inep = Number(inepParam);
		if (!inepParam || Number.isNaN(inep)) {
			return NextResponse.json(
				{ error: "Parâmetro 'inep' obrigatório e numérico." },
				{ status: 400 }
			);
		}

		loadIfChanged(); // recarrega do disco apenas se mudou

		const result = cache?.byInep.get(inep) ?? [];

		// Se quiser ainda mais rápido, remova a ordenação abaixo.
		// Mantive por padrão para estabilidade (mais recentes primeiro).
		const ordered =
			result.length > 1
				? [...result].sort(
					(a, b) =>
						new Date(b.dataCriacao ?? 0).getTime() -
						new Date(a.dataCriacao ?? 0).getTime()
				)
				: result;

		return new NextResponse(JSON.stringify(ordered), {
			status: 200,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				// Cache curto no cliente; ajuste se quiser.
				"Cache-Control": "private, max-age=5",
			},
		});
	} catch (err) {
		console.error("Erro GET /api/chamados/[inep]:", err);
		return NextResponse.json(
			{ error: "Falha ao buscar os chamados." },
			{ status: 500 }
		);
	}
}
