# Hackathon Devs Impacto — EDU PB Dashboard
Painel experimental construído para o hackathon Devs Impacto com foco em visibilidade dos dados educacionais da rede municipal da Paraíba. O repositório reúne:
- **Frontend (Next.js 16 / React 19)** com duas experiências: visão macro para a Secretaria de Educação (`/secretaria`) e painel operacional para escolas (`/escolas`), incluindo mapa interativo, rankings e fluxo de abertura de chamados usando Gemini.
- **Backend em Python (CrewAI)** que mantém sessões de chat com memória por usuário, fazendo RAG em cima dos mesmos dados JSON exibidos no dashboard.
- **Scripts utilitários** para cuidar dos dados públicos de indicadores (IDEB, SAEB, distorção idade-série etc.).
> **Status atual:** ambiente de demonstração offline que lê e grava dados em arquivos JSON em `frontend/dashboard-edu-pb/src/data`. Ideal para protótipos rápidos e validações com stakeholders.
---
## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 (preview)
- Recharts para gráficos; `@vis.gl/react-google-maps` para mapas/heatmap
- Google Gemini (`@google/generative-ai`) para estruturar demandas enviadas
- CrewAI + Google embeddings para o agente conversacional
## Project Structure
```
hackathon_devsImpacto/
├── frontend/
│   └── dashboard-edu-pb/     # App Next.js (painel secretaria/escolas + APIs)
├── backend/
│   ├── chat_agent.py         # Classe ChatSession (CrewAI + JSONSearchTool)
│   └── requirements.txt
├── scripts/
│   └── filter_indicadores.js # Limpa indicadores usando a lista de escolas
└── README.md
```
---
## Frontend Dashboard (`frontend/dashboard-edu-pb`)
### 1. Pré-requisitos
- Node.js ≥ 18
- npm (ou pnpm/yarn, adapte os comandos)
### 2. Instalação
```bash
cd frontend/dashboard-edu-pb
npm install
```
### 3. Variáveis de ambiente (`frontend/dashboard-edu-pb/.env.local`)
```
GEMINI_API_KEY=your_google_gemini_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=browser_key_with_maps_javascript_enabled
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=optional_cloud_map_id
```
- `GEMINI_API_KEY` é usado pelos handlers de API (`/api/processarDemanda`) para invocar `gemini-2.0-flash`.
- Sem a chave de mapas o painel continua funcionando, porém o componente `GlobalMap` mostra um aviso.
### 4. Scripts principais
```bash
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm start       # serve o build gerado
npm run lint    # eslint
```
### 5. Experiência disponível
- `/` ou `/secretaria`: visão macro para o time gestor (mapas, ranking IDEB/SAEB, painel de indicadores e heatmap de chamados por escola).
- `/escolas`: painel operacional com abas “Visão Geral” e “Enviar Demanda”, além de modal para acompanhar status dos chamados.
- `/login/escolas` e `/login/secretaria`: fluxos mockados que apenas populam o `localStorage` para fins de demonstração.
### 6. API Routes relevantes
| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/getDemanda?inep=25092570` | GET | Lê `src/data/chamados.json`, filtra pelos dígitos do INEP e retorna em ordem cronológica inversa. |
| `/api/processarDemanda` | POST | Recebe `{ texto, inep, escolaId }`, chama Gemini para padronizar campos do chamado e persiste em `src/data/chamados.json`. |
| `/api/atualizarStatus` | PATCH | Atualiza `status` de um chamado existente para `aceitar`, `rejeitar` ou `concluir`. |
> **Persistência local:** todos os handlers escrevem em `frontend/dashboard-edu-pb/src/data/chamados.json`. Para começar do zero, apague ou edite esse arquivo manualmente.
### 7. Dados estáticos
- `src/data/escolas.json`: base de escolas com coordenadas (usada para mapear e para filtrar indicadores).
- `src/data/indicador_*.json`: indicadores IDEB, SAEB, distorção e rendimento.
- `src/data/dashboard_stats.json`: números agregados para cards do painel.
---
## Backend Chat Agent (`backend/chat_agent.py`)
O backend expõe a classe `ChatSession`, que encapsula um agente CrewAI com memória automática por usuário (armazenada em `./memory/session_<user_id>`) e busca semântica sobre um JSON definido na criação da sessão.
### Pré-requisitos
- Python 3.10+
- Variáveis de ambiente:
  ```
  GEMINI_API_KEY=your_google_gemini_key        # usado pelo LLM gemini/gemini-2.5-flash-lite
  GOOGLE_API_KEY=your_google_api_key           # usado pelos embeddings (text-embedding-004)
  ```
### Instalação e uso rápido
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
Exemplo de uso em outro módulo:
```python
from backend.chat_agent import ChatSession
session = ChatSession(
    user_id="demo-escola-25012345",
    json_path="frontend/dashboard-edu-pb/src/data/chamados.json",
)
print(session.ask("Quais demandas urgentes estão abertas?"))
```
- `ask(message)` inclui instruções rígidas para responder apenas com base no JSON daquela sessão.
- `reset()` remove a pasta de memória do usuário.
---
## Data Utilities (`scripts/filter_indicadores.js`)
Script Node.js usado para deixar os arquivos `indicador_*.json` alinhados com as escolas mapeadas:
```bash
node scripts/filter_indicadores.js
```
- Cria backups `.bak` antes de sobrescrever.
- Remove linhas com INEP inexistente em `src/data/escolas.json` e normaliza tokens `NaN → null`.
---
## Useful Development Notes
- Para testar o fluxo de chamados rapidamente, abra `/login/escolas`, use as credenciais de exemplo e envie uma demanda. O JSON será salvo localmente e refletido tanto no mapa quanto nos cards da escola.
- Todos os dados carregados no browser podem ser substituídos por APIs reais posteriormente — basta trocar os imports dos JSONs por fetchers nas páginas/components.
- O repositório usa licença MIT (ver `LICENSE`).
---
## License
[MIT](LICENSE) — sinta-se livre para reutilizar e adaptar o projeto.