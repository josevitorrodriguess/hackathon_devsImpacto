"use client";

import React, { useMemo, useState } from "react";
import dashboardData from "@/data/dashboard_stats.json";
import escolasData from "@/data/escolas.json";
import chamadosData from "@/data/chamados.json";

type Summary = { accepted: number; rejected: number; in_progress: number };

export default function SchoolDashboard() {
  // build a list of known schools (for mock-login buttons)
  const schools = useMemo(() => {
    const s: { id: string; nome: string }[] = [];
    const raw = (dashboardData as any).schools || {};
    Object.keys(raw).forEach((k) => s.push({ id: k, nome: raw[k].nome }));
    return s;
  }, []);

  const [loggedInep, setLoggedInep] = useState<string | null>(null);

  // restore mock login from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const inep = window.localStorage.getItem("inep");
    if (inep) setLoggedInep(inep);
  }, []);

  // compute selectedData from chamados.json for the logged school
  const selectedData = useMemo(() => {
    const key = loggedInep;
    // default empty
    const empty = { nome: "—", summary: { accepted: 0, rejected: 0, in_progress: 0 }, demandTypes: {} as Record<string, number> };
    if (!key) return empty;

    // filter chamados for this school
    const chamados = (chamadosData as any[]).filter((c) => (c.inep || c.codigoINEP || c.escolaId || "").toString() === key.toString());

    // count statuses
    let accepted = 0;
    let rejected = 0;
    let in_progress = 0;
    const demandMap: Record<string, number> = {};

    chamados.forEach((c: any) => {
      const status = (c.status || "").toString().toLowerCase();
      if (/conclu|resolvid|finaliz|aceit|fechado|resolut/i.test(status)) accepted += 1;
      else if (/rejeit|recus|negad/i.test(status)) rejected += 1;
      else in_progress += 1;

      const tipo = (c.tipo || c.categoria || "Outros").toString();
      demandMap[tipo] = (demandMap[tipo] || 0) + 1;
    });

    // try to find a friendly name
    const schoolFromDashboard = (dashboardData as any).schools?.[key]?.nome;
    const escolaFromList = (escolasData as any[]).find((e) => e.inep?.toString() === key.toString());
    const nome = schoolFromDashboard || escolaFromList?.nome_escola || key;

    return { nome, summary: { accepted, rejected, in_progress }, demandTypes: demandMap };
  }, [loggedInep]);

  const totalCount = useMemo(() => {
    const s: Summary = selectedData.summary || { accepted: 0, rejected: 0, in_progress: 0 };
    return s.accepted + s.rejected + s.in_progress;
  }, [selectedData]);

  const demandEntries = useMemo(() => Object.entries(selectedData.demandTypes || {}), [selectedData]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg mb-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-slate-900">Operação diária — {selectedData.nome}</h3>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-500">Escola</label>
              {loggedInep ? (
                <div className="rounded-full border px-4 py-2 text-sm bg-brand-50">{schools.find(s => s.id === loggedInep)?.nome || loggedInep}</div>
              ) : (
                <div className="rounded-full border px-4 py-2 text-sm text-slate-500">Nenhuma sessão ativa</div>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-600">Resumo rápido das demandas da escola selecionada. Use este painel para priorizar ações.</p>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-xs text-slate-500">ABERTOS</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{selectedData.summary?.in_progress ?? 0}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs text-slate-500">ACEITOS</div>
              <div className="mt-2 text-2xl font-bold text-green-600">{selectedData.summary?.accepted ?? 0}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs text-slate-500">RECUSADOS</div>
              <div className="mt-2 text-2xl font-bold text-red-600">{selectedData.summary?.rejected ?? 0}</div>
            </div>
          </div>
        </div>

        {/* gráfico de barras */}
        <div className="w-[350px] rounded-xl border p-4 bg-surface-muted">
          <div className="text-sm text-slate-600">Tipos de demandas mais comuns</div>
          <div className="mt-3 space-y-3">
            {demandEntries.length === 0 && <div className="text-sm text-slate-500">Sem dados mockados</div>}
            {demandEntries.map(([type, value]: any) => {
              const v = Number(value || 0);
              const max = Math.max(...demandEntries.map(([, val]) => Number(val || 0)), 1);
              const pct = Math.round((v / max) * 100);
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="text-sm w-28 text-slate-700">{type}</div>
                  <div className="flex-1">
                    <div className="h-3 rounded-full bg-white border">
                      <div
                        className="h-3 rounded-full bg-brand-600"
                        style={{ width: `${pct}%`, transition: "width 400ms" }}
                        title={`${v} demandas`}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-slate-600">{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Login mock: se não houver INEP no localStorage, oferecemos botões para simular um usuário de escola */}
      {!loggedInep && (
        <div className="mt-4 flex items-center gap-3">
          <div className="text-sm text-slate-600">Simular login como:</div>
          {Object.entries((dashboardData as any).schools || {}).map(([id, info]: any) => (
            <button
              key={id}
              onClick={() => {
                  try {
                    localStorage.setItem("inep", id);
                  } catch {}
                  setLoggedInep(id);
                }}
              className="rounded-full border px-3 py-1 text-sm hover:bg-brand-50"
            >
              {info.nome}
            </button>
          ))}
        </div>
      )}

      {/* Se houver usuário simulado, mostrar opção de logout */}
      {loggedInep && (
        <div className="mt-3">
          <button
            onClick={() => {
              try { localStorage.removeItem("inep"); } catch {}
              setLoggedInep(null);
            }}
            className="text-sm text-red-600 underline"
          >
            Encerrar sessão de teste
          </button>
        </div>
      )}
    </section>
  );
}
