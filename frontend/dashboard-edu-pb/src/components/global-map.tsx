"use client";

import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import HeatmapMap from "@/components/heatmap-map";

interface Escola {
	id: string;
	nome: string;
	pos: { lat: number; lng: number };
	endereco: string;
	codigoINEP?: string; // ✅ agora string
	weight?: number; // ✅ peso também string para evitar conflito
}

interface GlobalMapProps {
	escolas: Escola[];
	escolasComPeso?: Escola[];
	showHeatmap?: boolean;
	setShowHeatmap?: (value: boolean) => void;
	onSelectSchool?: (schoolId: string) => void;
	selectedSchoolId?: string | null;
}

export default function GlobalMap({
	escolas,
	escolasComPeso = [],
	showHeatmap,
	setShowHeatmap,
	onSelectSchool,
	selectedSchoolId,
}: GlobalMapProps) {
	const [internalShowHeatmap, setInternalShowHeatmap] = useState(false);

	// controle interno se o pai não passar
	const heatmapAtivo = showHeatmap ?? internalShowHeatmap;
	const toggle = setShowHeatmap ?? setInternalShowHeatmap;

	const center = { lat: -7.11532, lng: -34.861 };

	return (
		<div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-2xl shadow-brand-100">
			<div className="flex items-start justify-between px-2 pb-2">
				<div>
					<p className="text-xs uppercase tracking-wide text-brand-500">Mapa</p>
					<p className="text-lg font-semibold text-slate-900">
						João Pessoa — {escolas.length} escolas mapeadas
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => toggle(false)}
						className={`rounded-full px-3 py-1 text-sm font-semibold transition ${!heatmapAtivo
							? "bg-brand-600 text-white"
							: "border border-brand-200 bg-white text-brand-700"
							}`}
					>
						Marcadores
					</button>
					<button
						onClick={() => toggle(true)}
						className={`rounded-full px-3 py-1 text-sm font-semibold transition ${heatmapAtivo
							? "bg-brand-600 text-white"
							: "border border-brand-200 bg-white text-brand-700"
							}`}
					>
						Mapa de calor
					</button>
				</div>
			</div>

			<div className="h-[460px] w-full overflow-hidden rounded-2xl relative">
				{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
					heatmapAtivo ? (
						<HeatmapMap
							schools={escolasComPeso.map((e) => ({
								...e,
								codigoINEP: e.codigoINEP?.toString(), 
								weight: e.weight ? Number(e.weight) : 0, 
							}))}
							center={center}
						/>
					) : (
						<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
							<Map
								defaultCenter={center}
								defaultZoom={12}
								gestureHandling="greedy"
								disableDefaultUI
								mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
								style={{ width: "100%", height: "100%" }}
								styles={[
									{ featureType: "poi", stylers: [{ visibility: "off" }] },
									{ featureType: "poi.business", stylers: [{ visibility: "off" }] },
									{ featureType: "poi.school", stylers: [{ visibility: "off" }] },
								]}
							>
								{escolas.map((e) => (
									<Marker
										key={e.id}
										position={e.pos}
										title={e.nome}
										onClick={() => onSelectSchool?.(e.codigoINEP || e.id)}
										label={
											selectedSchoolId === (e.codigoINEP || e.id)
												? {
														text: "●",
														color: "#ad0c2f",
														fontSize: "24px",
													}
												: undefined
										}
									/>
								))}
							</Map>
						</APIProvider>
					)
				) : (
					<div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">
						<div className="text-center">
							<p className="text-sm font-medium">Mapa não disponível</p>
							<p className="mt-1 text-xs">Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
						</div>
					</div>
				)}

				{/* 🔹 Legenda condicional */}
				{heatmapAtivo ? (
					<div className="absolute left-3 bottom-3 z-50 w-44 rounded-md bg-white/90 p-2 text-[11px] text-slate-800 shadow">
						<div className="font-semibold text-xs mb-1">Legenda — Chamados em aberto</div>
						<div
							className="h-2 w-full rounded mb-1 overflow-hidden"
							style={{
								background:
									"linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff5f0 10%, #ffee80 30%, #ffc850 50%, #ff8c3c 70%, #dc3c3c 85%, #8c1414 100%)",
							}}
						/>
						<div className="mt-0 flex justify-between text-[10px] text-slate-600">
							<span>0</span>
							<span>6</span>
							<span>12</span>
							<span>18</span>
							<span>24</span>
							<span>31+</span>
						</div>
						<div className="mt-1 text-[11px] text-slate-700">
							Tons claros: menor incidência
							<br />
							Tons escuros: maior incidência
						</div>
					</div>
				) : (
					<div className="absolute left-3 bottom-3 z-50 rounded-md bg-white/80 px-2 py-1 text-xs text-slate-800 shadow flex items-center gap-2">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden
						>
							<path
								d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z"
								fill="#ef4444"
							/>
							<circle cx="12" cy="8" r="2.5" fill="#fff" />
						</svg>
						<span className="whitespace-nowrap">Chave — Escolas municipais</span>
					</div>
				)}
			</div>
		</div>
	);
}
