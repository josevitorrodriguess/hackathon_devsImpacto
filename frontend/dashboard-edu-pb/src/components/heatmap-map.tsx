"use client";

import { useEffect, useRef } from "react";

type School = {
  id: string;
  nome: string;
  pos: { lat: number; lng: number };
  codigoINEP?: string;
  weight?: number;
};

function loadGoogleMaps(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no-window"));
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.visualization) return resolve();

    const existing = document.querySelector(`script[data-gmaps-heatmap]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script-load-error")));
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-gmaps-heatmap", "1");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&v=weekly`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("failed to load google maps"));
    document.head.appendChild(script);
  });
}

export default function HeatmapMap({ schools, center }: { schools: School[]; center: { lat: number; lng: number } }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let mounted = true;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (!mounted || !ref.current) return;
        const google = (window as any).google;
        mapRef.current = new google.maps.Map(ref.current, {
          center,
          zoom: 12,
          gestureHandling: "greedy",
          disableDefaultUI: true,
        });

        // prepare heatmap data (supports weighted points)
        const heatData = schools.map((s) => {
          const latLng = new google.maps.LatLng(s.pos.lat, s.pos.lng);
          return s.weight && s.weight > 0 ? { location: latLng, weight: s.weight } : latLng;
        });

        // compute a dynamic maxIntensity from weights so colors scale smoothly
        const maxWeight = Math.max(...schools.map((s) => (s.weight || 0)), 0);

        const gradient = [
          "rgba(255,255,255,0)",
          "rgba(255,247,235,0.6)",
          "rgba(255,237,160,0.75)",
          "rgba(255,210,100,0.85)",
          "rgba(255,170,70,0.95)",
          "rgba(255,120,60,1)",
          "rgba(220,60,60,1)",
          "rgba(180,30,30,1)",
        ];

        const heatmapOptions: any = {
          data: heatData,
          // radius controls spread: aumentei um pouco para baixa densidade, mas não tanto
          radius: 30,
          // opacidade um pouco menor para não bloquear detalhes do mapa
          opacity: 0.75,
          gradient,
          dissipating: true,
        };

        if (maxWeight > 0) {
          // define um teto dinâmico para normalizar as cores — evita cortes bruscos
          heatmapOptions.maxIntensity = Math.max(10, Math.round(maxWeight * 1.2));
        }

        heatmapRef.current = new google.maps.visualization.HeatmapLayer(heatmapOptions);

        heatmapRef.current.setMap(mapRef.current);
      })
      .catch((err) => {
        // silently fail — caller already shows message if API key missing
        console.error("Heatmap load error:", err);
      });

    return () => {
      mounted = false;
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      if (mapRef.current) {
        // try to remove map event listeners if any
        mapRef.current = null;
      }
    };
  }, [schools, center]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
