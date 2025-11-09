const indicadoresEscola = [
  {
    title: "Frequência média",
    value: "93%",
    detail: "Alta consistência nas últimas 4 semanas",
  },
  {
    title: "Solicitações pendentes",
    value: "12",
    detail: "Manutenção, transporte e TI",
  },
  {
    title: "Entregas merenda",
    value: "98%",
    detail: "Municípios abastecidos nesta semana",
  },
];

const agendaEscola = [
  {
    date: "Seg, 12 Ago",
    title: "Reunião com coordenação pedagógica",
    tag: "Pedagógico",
  },
  {
    date: "Qua, 14 Ago",
    title: "Treinamento de transporte escolar",
    tag: "Logística",
  },
  {
    date: "Sex, 16 Ago",
    title: "Envio de boletim alimentar",
    tag: "Operacional",
  },
];

const comunicados = [
  {
    title: "Atualização do censo escolar",
    desc: "Valide turmas e turnos até 20/08 para liberar o relatório estadual.",
  },
  {
    title: "Monitoramento climático",
    desc: "Envie alertas de rotas alternativas para zonas rurais.",
  },
];

const acoesRapidas = [
  { title: "Registrar ocorrência", desc: "Infraestrutura, TI, segurança" },
  { title: "Emitir declaração", desc: "Histórico escolar e transferência" },
  { title: "Atualizar cardápio", desc: "Nutrição e merenda escolar" },
  { title: "Submeter relatório", desc: "Prestação de contas mensal" },
];

const statusTransporte = [
  { title: "Zona Norte", value: "92%", detail: "2 rotas com atraso leve" },
  { title: "Zona Oeste", value: "100%", detail: "Operação normal" },
  { title: "Zona Rural", value: "84%", detail: "Ajustes após chuvas" },
];

export default function EscolasPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-white via-brand-50 to-white p-10 shadow-2xl shadow-brand-100">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">
                Escolas conectadas
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Operação diária com dados e alertas em tempo real.
              </h1>
              <p className="text-base text-slate-600">
                Acompanhe frequência, logística, repasses e comunicação oficial
                em um painel desenhado para diretores, coordenadores e equipes
                administrativas.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700">
                  Exportar relatório
                </button>
                <button className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-white">
                  Compartilhar com comunidade
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-brand-100 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-500">
                Resumo diário
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
                {[
                  { label: "Presenças confirmadas", value: "18.402" },
                  { label: "Alertas resolvidos", value: "47" },
                  { label: "Chamados abertos", value: "9" },
                  { label: "Boletins enviados", value: "312" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                    <p className="text-2xl font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {indicadoresEscola.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow shadow-brand-50 backdrop-blur"
            >
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
              <button className="mt-4 text-sm font-semibold text-brand-600">
                Ver detalhes →
              </button>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-50">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-brand-500">
                  Agenda da semana
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Prioridades e visitas técnicas
                </h2>
              </div>
              <button className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                Ver calendário completo
              </button>
            </header>
            <div className="mt-6 space-y-4">
              {agendaEscola.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand-50 bg-brand-50/60 p-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-brand-500">
                      {item.tag}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Equipe responsável: direção e coordenação
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-50">
              <p className="text-sm uppercase tracking-wide text-brand-500">
                Comunicados oficiais
              </p>
              <div className="mt-4 space-y-4">
                {comunicados.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-brand-50 bg-brand-50/70 p-4"
                  >
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-2xl border border-brand-200 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                Criar comunicado
              </button>
            </div>

            <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-50">
              <p className="text-sm uppercase tracking-wide text-brand-500">
                Ações rápidas
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {acoesRapidas.map((acao) => (
                  <button
                    key={acao.title}
                    className="rounded-3xl border border-brand-100 bg-brand-50/60 p-4 text-left transition hover:border-brand-500"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {acao.title}
                    </p>
                    <p className="text-xs text-slate-500">{acao.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-brand-200 bg-white/90 p-8 shadow-inner shadow-brand-50">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-500">
                Transporte escolar
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Rotas monitoradas e alertas recentes
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                Ver mapa
              </button>
              <button className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                Atualizar status
              </button>
            </div>
          </header>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {statusTransporte.map((zona) => (
              <div
                key={zona.title}
                className="rounded-3xl border border-brand-100 bg-brand-50/80 p-5"
              >
                <p className="text-sm font-medium text-slate-500">
                  {zona.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {zona.value}
                </p>
                <p className="text-xs text-slate-500">{zona.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
