"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; 
import escolasData from "@/data/escolas.json";
import dashboardData from "@/data/dashboard_stats.json";

const identityConfigs = [
  {
    match: (pathname: string) => pathname.startsWith("/escolas"),
    title: "EM Professor Durmeval",
    subtitle: "Direção conectada",
  },
  {
    match: (pathname: string) => pathname.startsWith("/secretaria"),
    title: "Secretaria de Educação",
    subtitle: "Gestor estadual",
  },
];

const loginOptions = [
  {
    href: "/login/secretaria",
    title: "Secretaria",
    subtitle: "Gestores e equipes centrais",
  },
  {
    href: "/login/escolas",
    title: "Escolas",
    subtitle: "Diretores e coordenadores",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionIdentity, setSessionIdentity] = useState<{ title: string; subtitle: string } | null>(null);

  const resolveSchoolName = (inep?: string | null) => {
    if (!inep) return null;
    const normalized = inep.replace(/[^\d]/g, "");
    if (!normalized) return null;

    const fromDashboard =
      (dashboardData as any)?.schools?.[normalized]?.nome ||
      (dashboardData as any)?.schools?.[inep]?.nome;

    if (fromDashboard) return fromDashboard;

    const fromList = (escolasData as any[]).find(
      (escola) =>
        escola?.inep?.toString().replace(/[^\d]/g, "") === normalized ||
        escola?.["código_inep"]?.toString().replace(/[^\d]/g, "") === normalized
    );

    return fromList?.nome_escola || normalized;
  };

  useEffect(() => {
    if (!pathname || pathname.startsWith("/login") || !pathname.startsWith("/escolas")) {
      setSessionIdentity(null);
      return;
    }

    try {
      const usuarioRaw = localStorage.getItem("usuario");
      const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
      const storedInep = usuario?.inep || localStorage.getItem("inep");
      const schoolName = resolveSchoolName(storedInep);

      if (schoolName) {
        setSessionIdentity({
          title: schoolName,
          subtitle: "Direção conectada",
        });
      } else {
        setSessionIdentity(null);
      }
    } catch {
      setSessionIdentity(null);
    }
  }, [pathname]);

  const isLoginRoute = pathname?.startsWith("/login");
  const identity =
    !isLoginRoute && pathname
      ? identityConfigs.find((config) => config.match(pathname))
      : undefined;
  const displayIdentity = sessionIdentity ?? identity;

  return (
    <header className="border-b border-brand-100 bg-surface-muted">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3" aria-label="Ir para a página inicial">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600">
            {/* ✅ imagem otimizada */}
            <Image
              src="/images/logo_gestar_icone_HD.png"
              alt="Logo GESTAR"
              width={44}
              height={44}
              className="rounded-lg object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">GESTAR-JP</p>
            <p className="text-xs text-slate-500">Dados em tempo real</p>
          </div>
        </Link>

        {/* IDENTIDADE OU LOGIN */}
        {displayIdentity ? (
          <div className="rounded-full border border-brand-100 bg-brand-50 px-5 py-2 text-right shadow-sm">
            <p className="text-sm font-semibold text-brand-700">{displayIdentity.title}</p>
            <p className="text-xs text-slate-500">{displayIdentity.subtitle}</p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700"
            >
              Login
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-2xl border border-brand-100 bg-white p-2 shadow-xl">
                  {loginOptions.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-brand-50"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{option.title}</p>
                        <p className="text-xs text-slate-500">{option.subtitle}</p>
                      </div>
                      <span aria-hidden="true" className="text-xs font-semibold text-brand-600">
                        &gt;
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
