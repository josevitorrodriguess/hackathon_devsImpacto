# GESTAR — Plataforma de Gestão Educacional

GESTAR é um painel que unifica indicadores e chamados das escolas da rede municipal, com mapa/heatmap, rankings (IDEB, SAEB, rendimento) e acompanhamento de status em tempo real. As escolas enviam demandas em texto livre e o sistema usa Gemini para estruturar e priorizar.

---

## Equipe
- Artur Pereira — arturguedepereira@gmail.com
- Davi Gurgel — daviogurgel@gmail.com
- José Rodrigues — josevitorrodrigues17@gmail.com
- Luis Aranha — lhamagalhaes@gmail.com

---

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 (preview)
- Recharts para gráficos; `@vis.gl/react-google-maps` para mapas/heatmap
- Google Gemini (`@google/generative-ai`) para estruturar demandas enviadas
- CrewAI + Google embeddings para o agente conversacional

---

## Estrutura do Projeto
```
hackathon_devsImpacto/
├── frontend/
│   └── gestar-dashboard/     # App Next.js (painel secretaria/escolas + APIs)
├── backend/
│   ├── chat_agent.py         # Classe ChatSession (CrewAI + JSONSearchTool)
│   └── requirements.txt
├── scripts/
│   └── filter_indicadores.js # Limpa/filtra indicadores conforme escolas
└── README.md
```

> Status atual: demonstração offline que lê e grava dados em `frontend/gestar-dashboard/src/data`. Ideal para protótipos e validações com stakeholders.

---

## Frontend (GESTAR Dashboard)
Local: `frontend/gestar-dashboard`

### 1) Pré‑requisitos
- Node.js ≥ 18
- npm (ou pnpm/yarn)

### 2) Instalação
```bash
cd frontend/gestar-dashboard
npm install
```

### 3) Variáveis de ambiente (`frontend/gestar-dashboard/.env.local`)
```
GEMINI_API_KEY=your_google_gemini_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=browser_key_with_maps_javascript_enabled
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=optional_cloud_map_id
```
- `GEMINI_API_KEY` é usado por `/api/processarDemanda` (modelo `gemini-2.0-flash`).
- Sem a chave de mapas, o painel funciona, mas o `GlobalMap` exibirá um aviso.

### 4) Scripts
```bash
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm start       # serve o build gerado
npm run lint    # eslint
```

### 5) Páginas
- `/` ou `/secretaria`: visão macro (mapa, heatmap, ranking IDEB/SAEB, indicadores por escola).
- `/escolas`: painel para escolas, abas “Visão Geral” e “Enviar Demanda”.
- `/login/escolas` e `/login/secretaria`: fluxos mock (preenchem localStorage).

### 6) API Routes
- `GET /api/getDemanda?inep=25092570` → lê `src/data/chamados.json`, filtra pelo INEP, ordena por data.
- `POST /api/processarDemanda` → recebe `{ texto, inep, escolaId }`, usa Gemini para padronizar e salva em `src/data/chamados.json`.
- `PATCH /api/atualizarStatus` → muda status para `aceitar`, `rejeitar` ou `concluir`.

> Persistência local: o arquivo de chamados fica em `frontend/gestar-dashboard/src/data/chamados.json`.

### 7) Dados estáticos
- `src/data/escolas.json` — escolas com coordenadas.
- `src/data/indicador_*.json` — IDEB, SAEB, distorção, rendimento.
- `src/data/dashboard_stats.json` — agregados para cards.

---

## Backend (Chat Agent)
Arquivo: `backend/chat_agent.py`

O backend expõe `ChatSession`, um agente CrewAI com memória por usuário (em `./memory/session_<user_id>`) e busca semântica (`JSONSearchTool`) sobre um JSON definido na criação da sessão.

### Pré‑requisitos
- Python 3.10+
- Variáveis de ambiente:
```
GEMINI_API_KEY=your_google_gemini_key        # LLM gemini/gemini-2.5-flash-lite
GOOGLE_API_KEY=your_google_api_key           # Embeddings text-embedding-004
```

### Instalação e uso
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Exemplo:
```python
from backend.chat_agent import ChatSession

session = ChatSession(
    user_id="demo-escola-25012345",
    json_path="frontend/gestar-dashboard/src/data/chamados.json",
)
print(session.ask("Quais demandas urgentes estão abertas?"))
```

---

## Scripts de Dados
`scripts/filter_indicadores.js` filtra `indicador_*.json` para manter apenas escolas conhecidas e sanitiza `NaN → null`.

Execução:
```bash
node scripts/filter_indicadores.js
```

---

## Notas rápidas de desenvolvimento
- Para testar o fluxo de chamados, faça login em `/login/escolas`, envie uma demanda e veja atualizar `/escolas` e o mapa.
- Ao integrar com APIs reais, troque os imports de JSON por fetchers nas páginas/componentes.
- Licença MIT (arquivo `LICENSE`).

---

## Licença
[MIT](LICENSE)
