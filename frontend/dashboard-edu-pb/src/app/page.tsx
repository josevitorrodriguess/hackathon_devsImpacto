"use client";

import { useMemo, useState } from "react";
import escolasData from "@/data/escolas.json";
import chamadosData from "@/data/chamados.json";
import GlobalMap from "@/components/global-map";

const monitoramentos = [
  {
    titulo: "Programa Alimenta Escola",
    progresso: 78,
    risco: "Baixo",
    resumo: "Contratos com fornecedores revisados e vigentes.",
  },
  {
    titulo: "Transporte Escolar",
    progresso: 65,
    risco: "Médio",
    resumo: "Aguardando renovação de 12 rotas interestaduais.",
  },
  {
    titulo: "Expansão de Tempo Integral",
    progresso: 54,
    risco: "Alto",
    resumo: "Obras em 8 municípios com cronograma crítico.",
  },
];

const alertas = [
  {
    regiao: "Sertão",
    assunto: "Baixa frequência",
    detalhes: "3 escolas com queda de 12% após período chuvoso.",
  },
  {
    regiao: "Litoral",
    assunto: "Obra com desvio",
    detalhes: "Aguardando atualização de medições financeiras.",
  },
];

export default function SecretariaPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);

  // 🔹 Mapeia escolas
  const escolas = useMemo(() => {
    return escolasData
      .filter((escola) => escola.latitude != null && escola.longitude != null)
      .map((escola, index) => ({
        id: escola["inep"] || `escola-${index}`,
        nome: escola["nome_escola"],
        pos: { lat: escola.latitude, lng: escola.longitude },
        endereco: escola["endereco"],
        codigoINEP: escola["inep"],
      }));
  }, []);

  const chamadosCounts = useMemo(() => {
    try {
      const arr = Array.isArray(chamadosData) ? chamadosData : [];
      const map: Record<string, number> = {};
      arr.forEach((c: any) => {
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
    } catch (err) {
      return {};
    }
  }, []);


  const escolasComPeso = useMemo(() => {
    const arr = escolas.map((e) => ({
      ...e,
      count: chamadosCounts[e.codigoINEP || e.id] || 0,
    }));
    const maxCount = arr.reduce((m, x) => Math.max(m, x.count || 0), 0);

    if (maxCount === 0) return arr.map((x) => ({ ...x, weight: 1 }));

    return arr.map((x) => {
      const ratio = Math.sqrt((x.count || 0) / maxCount);
      const normalized = Math.round(1 + ratio * (60 - 1));
      return { ...x, weight: Math.max(1, normalized) };
    });
  }, [escolas, chamadosCounts]);

  return (
    <div className="min-h-screen bg-surface-muted text-slate-900">
      <div className="px-4 py-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* GRID PRINCIPAL — Mapa à esquerda e Painéis à direita */}
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* 🔹 MAPA GLOBAL (coluna esquerda) */}
            <GlobalMap
              escolas={escolas}
              escolasComPeso={escolasComPeso}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
            />

            {/* 🔹 COLUNA DIREITA */}
            <div className="flex flex-col justify-center gap-8 h-full">
              {/* 🔸 Monitoramento */}
              <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-100">
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-brand-500">
                      Monitoramento
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      Programas estratégicos
                    </p>
                  </div>
                </header>

                <div className="mt-6 space-y-5">
                  {monitoramentos.map((mon) => (
                    <div
                      key={mon.titulo}
                      className="rounded-2xl border border-brand-50 bg-brand-50/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {mon.titulo}
                          </p>
                          <p className="text-sm text-slate-500">{mon.resumo}</p>
                        </div>
                        <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-brand-600">
                          Risco {mon.risco}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Execução</span>
                          <span>{mon.progresso}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{ width: `${mon.progresso}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔸 Alertas — Centralizados verticalmente */}
              <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-6 shadow-lg shadow-brand-50 flex flex-col items-center justify-center text-center">
                <p className="text-sm uppercase tracking-wide text-brand-500">
                  Alertas e respostas
                </p>

                <div className="mt-4 space-y-5 w-full max-w-sm">
                  {alertas.map((alerta) => (
                    <div
                      key={alerta.assunto}
                      className="rounded-2xl border border-brand-100 bg-brand-50/80 p-4"
                    >
                      <p className="text-sm font-semibold text-brand-700">
                        {alerta.regiao}
                      </p>
                      <span className="block text-xs uppercase tracking-wide text-slate-500 mt-1">
                        {alerta.assunto}
                      </span>
                      <p className="mt-2 text-sm text-slate-600">
                        {alerta.detalhes}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-4 text-sm text-slate-600">
                  Painel integrado com ouvidoria digital e SAC estadual.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
