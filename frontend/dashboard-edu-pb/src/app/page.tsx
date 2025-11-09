"use client";

import { useMemo, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import escolasData from "@/data/escolas.json";
import chamadosData from "@/data/chamados.json";
import HeatmapMap from "@/components/heatmap-map";

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

  // agrupa chamados por INEP, se houver campo identificador
  const chamadosCounts = useMemo(() => {
    try {
      const arr = Array.isArray(chamadosData) ? chamadosData : [];
      const map: Record<string, number> = {};
      arr.forEach((c: any) => {
        const id = c.inep || c.codigoINEP || c.codigo_inep || c.escola_inep || c.id_escola || c.escolaId;
        if (id) map[id] = (map[id] || 0) + 1;
      });
      return map;
    } catch (err) {
      return {};
    }
  }, []);

  // anexa peso (weight) para cada escola — usado pelo heatmap
  const escolasComPeso = useMemo(() => {
    // primeiro atribui counts
    const arr = escolas.map((e) => ({ ...e, count: chamadosCounts[e.codigoINEP || e.id] || 0 }));
    const maxCount = arr.reduce((m, x) => Math.max(m, x.count || 0), 0);
    // normaliza para weight visível: se maxCount=0, damos um peso base para todas
    if (maxCount === 0) {
      return arr.map((x) => ({ ...x, weight: 1 }));
    }
    // mapear count -> weight entre 1 e 60 usando escala sqrt para suavizar valores extremos
    // (usar sqrt reduz contraste exagerado entre poucos e muitos chamados)
    return arr.map((x) => {
      const ratio = maxCount > 0 ? Math.sqrt((x.count || 0) / maxCount) : 0;
      const normalized = Math.round(1 + ratio * (60 - 1));
      return { ...x, weight: Math.max(1, normalized) };
    });
  }, [escolas, chamadosCounts]);

  return (
    <div className="min-h-screen bg-surface-muted text-slate-900">
      <div className="px-4 py-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* MAPA À ESQUERDA + ANÁLISE DE DADOS À DIREITA */}
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* ESQUERDA: MAPA com marcadores */}
            <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-2xl shadow-brand-100">
              <div className="flex items-start justify-between px-2 pb-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-500">Mapa</p>
                  <p className="text-lg font-semibold text-slate-900">
                    João Pessoa — {escolas.length} escolas mapeadas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHeatmap(false)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      !showHeatmap ? "bg-brand-600 text-white" : "border border-brand-200 bg-white text-brand-700"
                    }`}
                  >
                    Marcadores
                  </button>
                  <button
                    onClick={() => setShowHeatmap(true)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      showHeatmap ? "bg-brand-600 text-white" : "border border-brand-200 bg-white text-brand-700"
                    }`}
                  >
                    Mapa de calor
                  </button>
                </div>
              </div>

              <div className="h-[460px] w-full overflow-hidden rounded-2xl relative">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  showHeatmap ? (
                    <HeatmapMap
                      schools={escolasComPeso}
                      center={{ lat: -7.11532, lng: -34.861 }}
                    />
                  ) : (
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                      <Map
                        defaultCenter={{ lat: -7.11532, lng: -34.861 }}
                        defaultZoom={12}
                        gestureHandling="greedy"
                        disableDefaultUI
                        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                        style={{ width: "100%", height: "100%" }}
                        styles={[
                          {
                            featureType: "poi",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.business",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.attraction",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.government",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.medical",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.park",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.place_of_worship",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.school",
                            stylers: [{ visibility: "off" }],
                          },
                          {
                            featureType: "poi.sports_complex",
                            stylers: [{ visibility: "off" }],
                          },
                        ]}
                      >
                        {escolas.map((e) => (
                          <Marker key={e.id} position={e.pos} title={e.nome} />
                        ))}
                      </Map>
                    </APIProvider>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">
                    <div className="text-center">
                      <p className="text-sm font-medium">Mapa não disponível</p>
                      <p className="mt-1 text-xs">Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
                    </div>
                  </div>
                )}

                {/* Legenda / badge condicional — aparece apenas no heatmap */}
                {showHeatmap ? (
                  <div className="absolute left-3 bottom-3 z-50 w-44 rounded-md bg-white/90 p-2 text-[11px] text-slate-800 shadow">
                    <div className="font-semibold text-xs mb-1">Legenda — Chamados em aberto</div>
                    <div className="h-2 w-full rounded mb-1 overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff5f0 10%, #ffee80 30%, #ffc850 50%, #ff8c3c 70%, #dc3c3c 85%, #8c1414 100%)' }} />
                    <div className="mt-0 flex justify-between text-[10px] text-slate-600">
                      <span>0</span>
                      <span>6</span>
                      <span>12</span>
                      <span>18</span>
                      <span>24</span>
                      <span>31+</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-700">
                      Tons claros: menor incidência

Tons escuros: maior incidência
                    </div>
                  </div>
                ) : (
                  <div className="absolute left-3 bottom-3 z-50 rounded-md bg-white/80 px-2 py-1 text-xs text-slate-800 shadow flex items-center gap-2">
                    {/* inline marker SVG */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" fill="#ef4444" />
                      <circle cx="12" cy="8" r="2.5" fill="#fff" />
                    </svg>
                    <span className="whitespace-nowrap">Chave — Escolas municipais</span>
                  </div>
                )}

              </div>
            </div>

            {/* DIREITA: Programas + Alertas */}
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-100">
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-brand-500">Monitoramento</p>
                    <p className="text-2xl font-semibold text-slate-900">Programas estratégicos</p>
                  </div>
                </header>
                <div className="mt-6 space-y-5">
                  {monitoramentos.map((mon) => (
                    <div key={mon.titulo} className="rounded-2xl border border-brand-50 bg-brand-50/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{mon.titulo}</p>
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

              <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-6 shadow-lg shadow-brand-50">
                <p className="text-sm uppercase tracking-wide text-brand-500">Alertas e respostas</p>
                <div className="mt-4 space-y-5">
                  {alertas.map((alerta) => (
                    <div key={alerta.assunto} className="rounded-2xl border border-brand-100 bg-brand-50/80 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-brand-700">{alerta.regiao}</p>
                        <span className="text-xs uppercase tracking-wide text-slate-500">{alerta.assunto}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{alerta.detalhes}</p>
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
