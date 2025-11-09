// '[project]/hackaton_devsImpacto/frontend/dashboard-edu-pb/src/app/api/chat/route.ts'

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// URL do Webhook do n8n
const N8N_WEBHOOK_URL = "https://hackathondevsimpacto.app.n8n.cloud/webhook-test/7f202385-4deb-4c2f-bcb4-fd53552ae014";

// Manipulador de requisições POST
export async function POST(req: NextRequest) {
  const { texto} = await req.json(); // Obtém os dados da requisição

  // Verificação de parâmetros obrigatórios
  if (!texto ) {
    return NextResponse.json({ error: "Campos obrigatórios: texto" }, { status: 400 });
  }

  try {
    // Enviando os dados para o n8n
    const response = await axios.post(N8N_WEBHOOK_URL, {
      message: texto, // Envia o texto para o n8n
    });

    console.log("Resposta do n8n:", response.data); // Log da resposta para debugar

    // Verifique se a resposta está no formato esperado
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Aqui estamos assumindo que o campo "output" existe no primeiro item do array
      const botMessage = response.data[0].output || "Desculpe, não entendi a sua pergunta.";
      return NextResponse.json({ reply: botMessage });
    } else {
      return NextResponse.json({ error: "Erro ao processar a resposta do n8n." }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro ao enviar a requisição para o n8n:", error);
    return NextResponse.json({ error: "Erro ao processar a demanda." }, { status: 500 });
  }
}
