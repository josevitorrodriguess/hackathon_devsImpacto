import os
import shutil
from crewai import Agent, LLM
from crewai_tools import JSONSearchTool

# !!! Lembrar de criar a instância do ChatSession no frontend com o user_id e o json_path dos dados de chamados !!!

class ChatSession:
    def __init__(self, user_id: str, json_path: str):
        """
        Cria uma nova sessão de chat com memória automática e base JSON.
        - user_id: identificador do usuário (para isolar sessões)
        - json_path: caminho do arquivo JSON base para as respostas
        """
        self.user_id = user_id
        self.json_path = json_path

        # Cada usuário terá uma pasta de memória separada
        self.memory_dir = f"./memory/session_{user_id}"
        os.environ["CREWAI_STORAGE_DIR"] = self.memory_dir

        # Configura o LLM Gemini (usa GOOGLE_API_KEY)
        self.llm = LLM(
            model="gemini/gemini-2.5-flash-lite",
            api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.3
            )

        # Ferramenta de busca no JSON
        json_tool = JSONSearchTool(
            json_path=json_path,
            config={
                "vectordb": {
                    "provider": "chroma",
                    "config": {
                        "collection_name": f"docs_user_{user_id}",
                        "dir": "chromadb/",
                        "allow_reset": True
                    }
                },
                "embedder": {
                    "provider": "google",
                    "config": {
                        "model": "text-embedding-004"
                    }
                }
            }
        )

        # Cria o agente com memória automática habilitada
        self.agent = Agent(
            role="Assistente de Dados Educacionais",
            goal=(
                "Responder perguntas do usuário com base exclusivamente "
                "no conteúdo do arquivo JSON fornecido, usando a JSONSearchTool "
                "para localizar informações relevantes, baseado no interesse do usuário."
            ),
            backstory=(
                "Sou um assistente educacional especializado em interpretar dados "
                "de escolas e comunidades. Analiso cuidadosamente o JSON recebido, "
                "explicando as informações de forma clara, empática e acessível, "
                "sem inventar nada que não esteja nos dados."
            ),
            tools=[json_tool],
            llm=self.llm,
            memory=True,   # ✅ memória automática ativada
            verbose=True,
        )

    def ask(self, message: str) -> str:
        """Envia a pergunta do usuário e retorna a resposta do agente."""
        instructions = (
            "Responda apenas com base no JSON desta sessão. "
            "Use a JSONSearchTool para encontrar dados relevantes. "
            "Se não houver informação no JSON, diga que não foi encontrada."
        )
        prompt = f"{instructions}\n\nUsuário: {message}"
        result = self.agent.kickoff(prompt)
        return getattr(result, "raw", str(result))

    def reset(self):
        """Apaga o histórico e cria uma nova memória limpa."""
        shutil.rmtree(self.memory_dir, ignore_errors=True)
