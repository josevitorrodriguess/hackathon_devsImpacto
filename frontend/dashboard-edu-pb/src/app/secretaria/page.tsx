const metas = [
  { title: "Investimento liberado", value: "R$ 38,6 mi", detail: "Infraestrutura e kits pedagógicos" },
  { title: "Projetos em execução", value: "74", detail: "Obras e reformas supervisionadas" },
  { title: "Municípios alinhados", value: "209/223", detail: "Planos homologados nesta quinzena" },
];

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
  return (
    <div className="min-h-screen bg-surface-muted px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="rounded-3xl border border-brand-100 bg-gradient-to-r from-white via-brand-50 to-white p-10 shadow-2xl shadow-brand-100">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-600">
                Secretaria de Educação
              </p>
              <h1 className="text-4xl font-bold leading-tight">
                Painel executivo e de governança.
              </h1>
              <p className="text-base text-slate-600">
                Indicadores estratégicos para secretários, subsecretários e
                gerências regionais acompanharem execução orçamentária,
                programas prioritários e respostas ao cidadão.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-white/70 px-5 py-4 text-sm text-slate-600 shadow">
              Última sincronização:{" "}
              <span className="font-semibold text-slate-900">há 18 minutos</span>
              <button className="ml-4 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-700">
                Atualizar agora
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {metas.map((meta) => (
            <div
              key={meta.title}
              className="rounded-3xl border border-brand-100 bg-white p-6 shadow shadow-brand-50"
            >
              <p className="text-sm font-medium text-slate-500">
                {meta.title}
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900">
                {meta.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{meta.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
              <button className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                Ver todos
              </button>
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

          <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-6 shadow-lg shadow-brand-50">
            <p className="text-sm uppercase tracking-wide text-brand-500">
              Alertas e respostas
            </p>
            <div className="mt-4 space-y-5">
              {alertas.map((alerta) => (
                <div
                  key={alerta.assunto}
                  className="rounded-2xl border border-brand-100 bg-brand-50/80 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-brand-700">
                      {alerta.regiao}
                    </p>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {alerta.assunto}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{alerta.detalhes}</p>
                  <button className="mt-3 text-sm font-semibold text-brand-600">
                    Ver detalhe →
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-4 text-sm text-slate-600">
              Painel integrado com ouvidoria digital e SAC estadual.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-50">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-500">
                Integração aberta
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                Indicadores públicos prontos para divulgação
              </p>
            </div>
            <button className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Compartilhar boletim
            </button>
          </header>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                titulo: "Fundeb & execução financeira",
                resumo:
                  "Relatório automático com empenhos, liquidações e pagamentos por macro região.",
              },
              {
                titulo: "Avaliação de aprendizagem",
                resumo:
                  "Comparativo trimestral com destaque para escolas que superaram a meta.",
              },
            ].map((item) => (
              <div
                key={item.titulo}
                className="rounded-2xl border border-brand-100 bg-brand-50/80 p-5"
              >
                <p className="text-base font-semibold text-slate-900">
                  {item.titulo}
                </p>
                <p className="text-sm text-slate-600">{item.resumo}</p>
                <button className="mt-3 text-sm font-semibold text-brand-600">
                  Gerar link público →
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
