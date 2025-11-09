"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ChatbotFab() {
  const [open, setOpen] = useState(false);
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
  return (
    <>
      {/* overlay que borra o fundo quando o chat está aberto */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* painel do chatbot — fica maior (70vw) quando aberto */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full transform flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out ${
          open ? "w-[70vw] translate-x-0 opacity-100" : "w-0 translate-x-1/4 opacity-0 pointer-events-none"
        }`}
        style={{ maxWidth: "1000px" }}
        role="dialog"
        aria-modal={open}
      >
        <div className="relative flex h-full flex-col">
          {/* cabeçalho do chat */}
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

            {/* X no canto do painel */}
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

          {/* conteúdo principal */}
          <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700">
            <p className="mb-4 text-[13px] text-slate-500">Converse com o assistente. Integração com backend de chatbot pode ser feita aqui.</p>
            {/* mensagens mock — aqui você pode renderizar o histórico real */}
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-100 p-3 text-[13px]">Olá! Posso ajudar com informações sobre chamados e serviços.</div>
              <div className="rounded-lg self-end bg-brand-600 p-3 text-white text-[13px]">Quais escolas possuem mais chamados?</div>
            </div>
          </div>

          {/* rodapé com campo de entrada */}
          <div className="border-t px-6 py-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                className="flex-1 rounded-full border px-4 py-3 text-sm outline-none"
                placeholder="Digite sua pergunta..."
                aria-label="Digite sua pergunta"
              />
              <button className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Enviar</button>
            </div>
          </div>
        </div>
      </div>

      {/* FAB fixo no canto inferior direito */}
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
