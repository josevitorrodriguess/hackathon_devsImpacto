import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Evita caching estático do Next
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Caminho do JSON local com os chamados
const CHAMADOS_PATH = path.join(process.cwd(), "src/data/chamados.json");

// Tipo base de um chamado
type Chamado = {
  id: string;
  inep: string | number;
  titulo?: string;
  descricao?: string;
  dataCriacao?: string;
  tipo?: string;
  prioridade?: string;
  status?: string;
};

// Função auxiliar para carregar o arquivo JSON
function loadChamados(): Chamado[] {
  try {
    if (!fs.existsSync(CHAMADOS_PATH)) return [];
    const raw = fs.readFileSync(CHAMADOS_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao ler chamados.json:", err);
    return [];
  }
}

// GET /api/getDemanda?inep=25092570
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inepParam = searchParams.get("inep");

    if (!inepParam) {
      return NextResponse.json(
        { error: "Parâmetro 'inep' é obrigatório." },
        { status: 400 }
      );
    }

    // Mantém apenas dígitos do INEP
    const inep = inepParam.replace(/[^\d]/g, "");
    if (!inep) {
      return NextResponse.json(
        { error: "Parâmetro 'inep' inválido." },
        { status: 400 }
      );
    }

    const chamados = loadChamados();

    // Filtra chamados por INEP
    const filtrados = chamados.filter(
      (c) => String(c.inep).replace(/[^\d]/g, "") === inep
    );

    // Ordena (mais recentes primeiro, se houver data)
    filtrados.sort(
      (a, b) =>
        new Date(b.dataCriacao ?? 0).getTime() -
        new Date(a.dataCriacao ?? 0).getTime()
    );

    return NextResponse.json(filtrados, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "private, max-age=5",
      },
    });
  } catch (err) {
    console.error("Erro GET /api/getDemanda:", err);
    return NextResponse.json(
      { error: "Falha ao buscar chamados." },
      { status: 500 }
    );
  }
}
