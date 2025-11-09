"use client";

import { useMemo } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import escolasData from "@/data/escolas.json";

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

  return (
    <div className="min-h-screen bg-surface-muted text-slate-900">
      <div className="px-4 py-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* MAPA À ESQUERDA + ANÁLISE DE DADOS À DIREITA */}
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* ESQUERDA: MAPA com marcadores */}
            <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-2xl shadow-brand-100">
              <div className="px-2 pb-2">
                <p className="text-xs uppercase tracking-wide text-brand-500">Mapa</p>
                <p className="text-lg font-semibold text-slate-900">
                  João Pessoa — {escolas.length} escolas mapeadas
                </p>
              </div>

              <div className="h-[460px] w-full overflow-hidden rounded-2xl">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
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
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">
                    <div className="text-center">
                      <p className="text-sm font-medium">Mapa não disponível</p>
                      <p className="mt-1 text-xs">Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
                    </div>
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
