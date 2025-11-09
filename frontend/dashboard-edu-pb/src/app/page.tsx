"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlobalMap from "@/components/global-map";
import chamadosData from "@/data/chamados.json";
import escolasData from "@/data/escolas.json";

type Escola = {
  id: string;
  nome: string;
  pos: { lat: number; lng: number };
  endereco: string;
  codigoINEP?: string;
};

type Chamado = {
  status?: string;
  tipo?: string;
  prioridade?: string;
  inep?: string;
  codigoINEP?: string;
  codigo_inep?: string;
  escola_inep?: string;
  id_escola?: string;
  escolaId?: string;
};

const pieColors = ["#ef4444", "#f97316", "#fbbf24", "#10b981", "#3b82f6", "#6366f1"];
const idebScores = [7.9, 7.7, 7.6, 7.4, 7.3, 7.1, 7.0, 6.9, 6.8, 6.6];
const MAX_SUGGESTIONS = 6;

const getChamadoSchoolId = (chamado: Chamado) =>
  chamado.inep ||
  chamado.codigoINEP ||
  chamado.codigo_inep ||
  chamado.escola_inep ||
  chamado.id_escola ||
  chamado.escolaId ||
  null;

export default function SecretariaPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const escolas = useMemo<Escola[]>(() => {
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

  const chamadosArray = useMemo(() => {
    return Array.isArray(chamadosData) ? (chamadosData as Chamado[]) : [];
  }, []);

  const chamadosCounts = useMemo(() => {
    const map: Record<string, number> = {};
    chamadosArray.forEach((chamado) => {
      const schoolId = getChamadoSchoolId(chamado);
      if (!schoolId) return;
      map[schoolId] = (map[schoolId] || 0) + 1;
    });
    return map;
  }, [chamadosArray]);

  const chamadosPorEscola = useMemo(() => {
    const map: Record<string, Chamado[]> = {};
    chamadosArray.forEach((chamado) => {
      const schoolId = getChamadoSchoolId(chamado);
      if (!schoolId) return;
      if (!map[schoolId]) map[schoolId] = [];
      map[schoolId].push(chamado);
    });
    return map;
  }, [chamadosArray]);

  const escolasComPeso = useMemo(() => {
    const arr = escolas.map((escola) => ({
      ...escola,
      count: chamadosCounts[escola.codigoINEP || escola.id] || 0,
    }));
    const maxCount = arr.reduce((acc, escola) => Math.max(acc, escola.count || 0), 0);
    if (maxCount === 0) return arr.map((escola) => ({ ...escola, weight: 1 }));

    return arr.map((escola) => {
      const ratio = Math.sqrt((escola.count || 0) / maxCount);
      const normalized = Math.round(1 + ratio * (60 - 1));
      return { ...escola, weight: Math.max(1, normalized) };
    });
  }, [escolas, chamadosCounts]);

  const idebRanking = useMemo(() => {
    return escolas
      .slice(0, 10)
      .map((escola, index) => ({
        posicao: index + 1,
        nome: escola.nome,
        ideb: idebScores[index] ?? 6.5,
      }))
      .sort((a, b) => b.ideb - a.ideb);
  }, [escolas]);

  const selectedSchool = useMemo(() => {
    if (!selectedSchoolId) return null;
    return (
      escolas.find((escola) => (escola.codigoINEP || escola.id) === selectedSchoolId) || null
    );
  }, [escolas, selectedSchoolId]);

  const selectedChamados = useMemo(() => {
    if (!selectedSchoolId) return [];
    return chamadosPorEscola[selectedSchoolId] || [];
  }, [selectedSchoolId, chamadosPorEscola]);

  const selectedStatusDistribution = useMemo(() => {
    return selectedChamados.reduce<Record<string, number>>((acc, chamado) => {
      if (!chamado.status) return acc;
      acc[chamado.status] = (acc[chamado.status] || 0) + 1;
      return acc;
    }, {});
  }, [selectedChamados]);

  const selectedCategoriaDistribution = useMemo(() => {
    return selectedChamados.reduce<Record<string, number>>((acc, chamado) => {
      if (!chamado.tipo) return acc;
      acc[chamado.tipo] = (acc[chamado.tipo] || 0) + 1;
      return acc;
    }, {});
  }, [selectedChamados]);

  const selectedHighPriorityCount = useMemo(() => {
    return selectedChamados.filter((chamado) =>
      ["Alta", "Urgente"].includes(chamado.prioridade || "")
    ).length;
  }, [selectedChamados]);

  const selectedTotalChamados = selectedChamados.length;
  const selectedAguardando = selectedStatusDistribution["Aguardando Confirmação da Escola"] || 0;
  const selectedResolvidos = selectedStatusDistribution["Concluído"] || 0;
  const selectedResolucaoPercent = selectedTotalChamados
    ? Math.round((selectedResolvidos / selectedTotalChamados) * 100)
    : 0;

  const selectedStatusChartData = useMemo(() => {
    return Object.entries(selectedStatusDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [selectedStatusDistribution]);

  const selectedCategoriaChartData = useMemo(() => {
    return Object.entries(selectedCategoriaDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [selectedCategoriaDistribution]);

  const filteredSchools = useMemo(() => {
    if (!searchValue.trim()) return [];
    const term = searchValue.toLowerCase();
    return escolas
      .filter((escola) => escola.nome.toLowerCase().includes(term))
      .slice(0, MAX_SUGGESTIONS);
  }, [escolas, searchValue]);

  const baseTotalChamados = chamadosArray.length;

  const handleSelectSchool = (school: Escola) => {
    setSelectedSchoolId(school.codigoINEP || school.id);
    setSearchValue(school.nome);
    setShowSuggestions(false);
  };

  const handleMapSelection = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    const match = escolas.find((escola) => (escola.codigoINEP || escola.id) === schoolId);
    if (match) {
      setSearchValue(match.nome);
    }
  };

  const clearSelection = () => {
    setSelectedSchoolId(null);
    setSearchValue("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-surface-muted text-slate-900">
      <div className="px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <header className="text-center">
            <p className="text-sm uppercase tracking-wider text-brand-600">Educação municipal</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Inteligência territorial conectada aos chamados
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
              Clique em uma escola no mapa ou busque pelo nome para destravar o dashboard dinâmico
              com o volume de chamados, status e categorias daquela unidade.
            </p>
          </header>

          <section className="space-y-4">
            <div className="rounded-3xl border border-brand-50 bg-white/80 p-5 shadow-brand-50 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <label className="text-xs uppercase tracking-wide text-brand-600">
                    Buscar escola
                  </label>
                  <div className="relative mt-2">
                    <input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                      placeholder="Digite parte do nome ou código INEP"
                      className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                    {showSuggestions && filteredSchools.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-brand-50 bg-white shadow-xl">
                        {filteredSchools.map((escola) => (
                          <button
                            key={escola.id}
                            type="button"
                            onClick={() => handleSelectSchool(escola)}
                            className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-brand-50"
                          >
                            <p className="font-semibold text-slate-900">{escola.nome}</p>
                            <p className="text-xs text-slate-500">INEP {escola.codigoINEP}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-slate-500 sm:text-right">
                  <span>Base com {baseTotalChamados} chamados agregados</span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={!selectedSchoolId && !searchValue}
                    className="self-start rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:self-end"
                  >
                    Limpar seleção
                  </button>
                </div>
              </div>
            </div>

            <section aria-label="Mapa das escolas" className="w-full">
              <GlobalMap
                escolas={escolas}
                escolasComPeso={escolasComPeso}
                showHeatmap={showHeatmap}
                setShowHeatmap={setShowHeatmap}
                onSelectSchool={handleMapSelection}
                selectedSchoolId={selectedSchoolId}
              />
            </section>

            <div className="rounded-2xl border border-dashed border-brand-100 bg-white/90 px-4 py-3 text-sm text-slate-600">
              {selectedSchool ? (
                <span>
                  Exibindo dados agregados de{" "}
                  <span className="font-semibold text-slate-900">{selectedSchool.nome}</span> — INEP{" "}
                  {selectedSchool.codigoINEP}
                </span>
              ) : (
                <span>
                  Selecione uma escola no mapa ou utilize a busca para visualizar o dashboard de
                  chamados dessa unidade.
                </span>
              )}
            </div>
          </section>

          {selectedSchool ? (
            <section
              aria-label="Painel de indicadores por escola"
              className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-lg shadow-brand-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wider text-brand-500">
                    Dashboard {selectedSchool.nome}
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">Chamados da unidade</h2>
                </div>
                <span className="text-sm text-slate-500">
                  {selectedTotalChamados > 0
                    ? `${selectedTotalChamados} registros sincronizados`
                    : "Nenhum chamado registrado para esta escola"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Chamados totais"
                  value={selectedTotalChamados}
                  helper="Últimos registros"
                />
                <MetricCard
                  label="Aguardando escola"
                  value={selectedAguardando}
                  helper="Pendências locais"
                />
                <MetricCard
                  label="Alta/Urgente"
                  value={selectedHighPriorityCount}
                  helper="Prioridade crítica"
                />
                <MetricCard
                  label="Taxa de resolução"
                  value={`${selectedResolucaoPercent}%`}
                  helper={`${selectedResolvidos} concluídos`}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-brand-50 bg-surface-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Distribuição por status</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-500">Chamados</span>
                  </div>
                  <div className="mt-4 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedStatusChartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {selectedStatusChartData.map((entry, index) => (
                            <Cell key={`status-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value} chamados`, "Total"]}
                          contentStyle={{ borderRadius: "12px", borderColor: "#ffe4e6" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-brand-50 bg-surface-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Top categorias</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Últimos registros
                    </span>
                  </div>
                  <div className="mt-4 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedCategoriaChartData} barCategoryGap={20}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value: number) => [`${value} chamados`, "Categoria"]}
                          contentStyle={{ borderRadius: "12px", borderColor: "#ffe4e6" }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-brand-50 bg-surface-card p-6 text-center text-slate-500 shadow-sm">
              O dashboard detalhado será exibido após selecionar uma escola.
            </section>
          )}

          <section
            aria-label="Ranking IDEB"
            className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-50"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wider text-brand-500">Ranking por IDEB</p>
                <h2 className="text-2xl font-semibold text-slate-900">Top 10 escolas</h2>
              </div>
              <span className="text-sm text-slate-500">Fonte: dados simulados 2024</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-50">
              <div className="grid grid-cols-[90px_auto_120px] sm:grid-cols-[110px_auto_140px] bg-surface-accent px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                <span>Posição</span>
                <span>Escola</span>
                <span className="text-right">IDEB</span>
              </div>
              <div className="divide-y divide-border-soft bg-white text-sm text-slate-700">
                {idebRanking.map((item) => (
                  <div
                    key={item.nome}
                    className="grid grid-cols-[90px_auto_120px] sm:grid-cols-[110px_auto_140px] items-center px-4 py-4 sm:text-base"
                  >
                    <span className="font-semibold text-slate-500">{item.posicao}º</span>
                    <span className="font-medium text-slate-900">{item.nome}</span>
                    <span className="text-right font-semibold text-brand-600">
                      {item.ideb.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: number | string;
  helper?: string;
};

const MetricCard = ({ label, value, helper }: MetricCardProps) => {
  return (
    <div className="rounded-2xl border border-brand-50 bg-surface-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
};
