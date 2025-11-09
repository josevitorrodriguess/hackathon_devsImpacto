"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Olá! Posso ajudar com informações sobre chamados e serviços.", sender: "bot" },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  const sendMessage = async (message: string) => {
    // Adiciona a mensagem do usuário ao estado
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);

    try {
      // Envia a mensagem para o n8n
      const response = await fetch('https://hackathondevsimpacto.app.n8n.cloud/webhook-test/7f202385-4deb-4c2f-bcb4-fd53552ae014', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        console.error(`Erro: resposta do servidor com status ${response.status}`);
        throw new Error(`Erro na resposta do n8n: ${response.status}`);
      }

      // Converte a resposta em JSON
      const data = await response.json();
      console.log("Resposta completa do n8n:", data); // Imprime a resposta inteira

      // Verifica se a propriedade 'reply' existe
      if (!data.reply) {
        console.error("Resposta não contém a propriedade 'reply'.");
        throw new Error("A resposta não contém a propriedade 'reply'.");
      }

      // Acessa a resposta do bot, garantindo que a propriedade existe
      const botMessage = data.reply || "Desculpe, não entendi a sua pergunta.";

      // Adiciona a resposta do bot ao estado
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, sender: "bot" },
      ]);
    } catch (error) {
      // Exibe o erro detalhado
      console.error("Erro ao enviar a mensagem para o n8n:", error);
    }
  };



  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full transform flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out ${open ? "w-[70vw] translate-x-0 opacity-100" : "w-0 translate-x-1/4 opacity-0 pointer-events-none"
          }`}
        style={{ maxWidth: "1000px" }}
        role="dialog"
        aria-modal={open}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                <img src="/images/logochat.png" alt="Foto do chatbot" className="object-cover h-full w-full" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Assistente Edu</div>
                <div className="text-[12px] text-slate-500">Como posso ajudar hoje?</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700">
            <p className="mb-4 text-[13px] text-slate-500">Converse com o assistente. Integração com backend de chatbot pode ser feita aqui.</p>
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 text-[13px] ${msg.sender === "bot" ? "bg-slate-100" : "self-end bg-brand-600 text-white"}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                className="flex-1 rounded-full border px-4 py-3 text-sm outline-none"
                placeholder="Digite sua pergunta..."
                aria-label="Digite sua pergunta"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputRef.current) {
                    sendMessage(inputRef.current.value);
                    inputRef.current.value = ""; // Limpa o campo de entrada
                  }
                }}
              />
              <button
                className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white"
                onClick={() => {
                  if (inputRef.current) {
                    sendMessage(inputRef.current.value);
                    inputRef.current.value = ""; // Limpa o campo de entrada
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
      {!open && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir chatbot"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 shadow-xl ring-1 ring-black/10 transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
              <img src="/images/logochat.png" alt="Chatbot" className="object-cover h-full w-full" />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
