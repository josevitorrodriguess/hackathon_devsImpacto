"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  // set default position after mount (bottom-right) or load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("chatbotFabPos");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setPos(p);
        return;
      } catch {}
    }
    const defaultX = window.innerWidth - 24 - 64; // 24px margin, 64px button
    const defaultY = window.innerHeight - 24 - 64;
    setPos({ x: Math.max(8, defaultX), y: Math.max(8, defaultY) });
  }, []);

  // When chat opens, nudge FAB if it's overlapping the typical send-button area
  useEffect(() => {
    if (!open || !pos || typeof window === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // if FAB is within bottom-right quadrant near the panel, move it up
    if (pos.x > vw - 320 && pos.y > vh - 220) {
      const newY = Math.max(8, pos.y - 160);
      const newPos = { x: pos.x, y: newY };
      setPos(newPos);
      window.localStorage.setItem("chatbotFabPos", JSON.stringify(newPos));
    }
  }, [open, pos]);

  // drag handlers
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current || !pos) return;
      let clientX = 0,
        clientY = 0;
      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      const newX = Math.min(Math.max(8, clientX - dragOffsetRef.current.x), window.innerWidth - 64 - 8);
      const newY = Math.min(Math.max(8, clientY - dragOffsetRef.current.y), window.innerHeight - 64 - 8);
      const newPos = { x: newX, y: newY };
      setPos(newPos);
    }

    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (pos) window.localStorage.setItem("chatbotFabPos", JSON.stringify(pos));
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [pos]);

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

      {/* FAB draggable */}
      {pos && (
        <div
          className="fixed z-50"
          style={{ left: pos.x, top: pos.y, width: 64, height: 64 }}
        >
          <button
            onClick={() => setOpen((s) => !s)}
            onMouseDown={(e) => {
              draggingRef.current = true;
              dragOffsetRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
            }}
            onTouchStart={(e) => {
              draggingRef.current = true;
              const t = e.touches[0];
              dragOffsetRef.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
            }}
            onDoubleClick={() => {
              // reset position to default bottom-right
              const defaultX = window.innerWidth - 24 - 64;
              const defaultY = window.innerHeight - 24 - 64;
              const newPos = { x: Math.max(8, defaultX), y: Math.max(8, defaultY) };
              setPos(newPos);
              window.localStorage.setItem("chatbotFabPos", JSON.stringify(newPos));
            }}
            aria-label="Abrir chatbot"
            className="relative h-16 w-16 rounded-full bg-brand-600 shadow-xl ring-1 ring-black/10 active:scale-95 transition-transform touch-none"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab" }}
          >
            <div className="h-14 w-14 overflow-hidden rounded-full bg-white">
              <img src="/images/logochat.png" alt="Chatbot" className="object-cover h-full w-full" />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
