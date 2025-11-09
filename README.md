# GESTAR — Painel Inteligente para Rede Municipal

GESTAR nasceu no Hackathon Devs Impacto para dar transparência aos indicadores e chamados das escolas municipais. O painel reúne visão territorial (mapa e heatmap), rankings IDEB/SAEB/rendimento e um fluxo de abertura de demandas que usa Gemini, orquestrado pelo **n8n**, para padronizar cada chamado e priorizar o atendimento.

---

## Equipe
- **Artur Pereira** — arturguedepereira@gmail.com
- **Davi Gurgel** — daviogurgel@gmail.com
- **José Rodrigues** — josevitorrodrigues17@gmail.com
- **Luis Aranha** — lhamagalhaes@gmail.com

---

## Stack utilizada
- **Next.js 16 + React 19 + TypeScript** (App Router) para o dashboard.
- **Tailwind CSS 4 (preview)** para design system rápido.
- **Recharts** e **@vis.gl/react-google-maps** para visualizações e mapa/heatmap.
- **Google Gemini** via SDK `@google/generative-ai`, com prompts controlados pelo **n8n** (sem uso de CrewAI no fluxo atual).
- **JSON local** em `frontend/dashboard-edu-pb/src/data` para persistência offline do protótipo.
- **Scripts Node.js** (`scripts/filter_indicadores.js`) para higienizar indicadores públicos.

---

## Arquitetura e diretórios
```
hackathon_devsImpacto/
├── frontend/
│   └── dashboard-edu-pb/        # App Next.js + APIs internas
├── backend/                     # Protótipo legado (não utilizado no fluxo n8n)
│   ├── chat_agent.py
│   └── requirements.txt
├── scripts/
│   └── filter_indicadores.js    # Limpeza de indicadores x escolas
└── README.md
```

> Status atual: demo offline. Os dados são lidos e gravados em `frontend/dashboard-edu-pb/src/data`.

---

## Configuração do Frontend (`frontend/dashboard-edu-pb`)

1. **Pré-requisitos**
   - Node.js ≥ 18
   - npm (ou pnpm/yarn)

2. **Instalação**
   ```bash
   cd frontend/dashboard-edu-pb
   npm install
   ```

3. **Variáveis de ambiente (`.env.local`)**
   ```
   GEMINI_API_KEY=your_google_gemini_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=browser_key_with_maps_javascript_enabled
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=optional_cloud_map_id
   N8N_WEBHOOK_URL=https://<seu-servidor-n8n>/webhook/gestar
   ```
   - `GEMINI_API_KEY` habilita o endpoint `/api/processarDemanda`.
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` libera mapa e heatmap.
   - `N8N_WEBHOOK_URL` aponta para o fluxo que conversa com Gemini.

4. **Scripts úteis**
   ```bash
   npm run dev     # http://localhost:3000
   npm run build   # build de produção
   npm start       # servir build
   npm run lint    # lint com ESLint
   ```

5. **Principais páginas**
   - `/` ou `/secretaria`: visão territorial, ranking e painel comparativo por escola.
   - `/escolas`: painel operacional com abas “Visão Geral” e “Enviar Demanda”.
   - `/login/escolas` e `/login/secretaria`: logins mock que populam o `localStorage` para demos.

6. **Rotas de API (Next.js)**
   | Rota | Método | Descrição |
   |------|--------|-----------|
   | `/api/getDemanda?inep=25092570` | GET | Carrega `src/data/chamados.json`, filtra pelo INEP e ordena por data. |
   | `/api/processarDemanda` | POST | Envia `{ texto, inep, escolaId }` para o webhook do n8n/Gemini, recebe o chamado estruturado e salva no JSON. |
   | `/api/atualizarStatus` | PATCH | Atualiza o status local (`aceitar`, `rejeitar`, `concluir`). |

7. **Dados estáticos**
   - `src/data/escolas.json` — escolas com geolocalização.
   - `src/data/indicador_*.json` — IDEB, SAEB, distorção idade-série, rendimento.
   - `src/data/dashboard_stats.json` — agregados para cards.
   - `src/data/chamados.json` — base de chamados persistida pelas rotas.

---

## Fluxo de IA (n8n + Gemini)
1. O frontend posta a demanda em `/api/processarDemanda`.
2. A rota repassa o payload para um **webhook no n8n** (`N8N_WEBHOOK_URL`).
3. O n8n executa:
   - validação básica e enriquecimento (INEP, sessão, timestamps);
   - prompt no **Gemini** para gerar título, descrição, categoria e prioridade padronizados;
   - registros em data stores do n8n (histórico/memória) e opcionalmente em base relacional;
   - resposta JSON síncrona para o frontend, que salva no arquivo local.
4. Fluxos adicionais do n8n podem consumir os mesmos dados para relatórios ou responder perguntas (sem depender do código em `backend/`).

> A pasta `backend/` permanece apenas como referência de um protótipo legado, mas não é utilizada no fluxo atual.

---

## Scripts de dados
`node scripts/filter_indicadores.js`
- Cria backups `.bak` e remove indicadores cujo INEP não existe em `src/data/escolas.json`.
- Substitui tokens `NaN` por `null` para manter JSON válido.

---

## Notas rápidas
- Para testar: acesse `/login/escolas`, use o mock exibido na tela, abra uma demanda e confira a atualização em `/escolas` e no mapa.
- Em produção, troque os arquivos JSON por uma API/banco (Postgres, Firestore etc.) e proteja as rotas com autenticação real.
- Sempre mantenha as chaves (`GEMINI_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) fora do versionamento.

---

## Licença
[MIT](LICENSE)
