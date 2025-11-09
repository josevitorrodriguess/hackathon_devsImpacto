"use client";

import { memo, useState } from "react";
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

const defaultMarkerIcon =
	"data:image/svg+xml;charset=UTF-8," +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="8" fill="#ad0c2f" fill-opacity=".92"/><circle cx="14" cy="14" r="4" fill="#ffffff"/></svg>',
	);

const selectedMarkerIcon =
	"data:image/svg+xml;charset=UTF-8," +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" fill="#ffffff" fill-opacity=".88"/><circle cx="14" cy="14" r="7.5" fill="#e4193b"/><circle cx="14" cy="14" r="3.2" fill="#ffffff"/></svg>',
	);

function GlobalMap({
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
										icon={
											selectedSchoolId === (e.codigoINEP || e.id)
												? selectedMarkerIcon
												: defaultMarkerIcon
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
					<div className="absolute left-3 bottom-3 z-50 rounded-md bg-white/85 px-2 py-1 text-xs text-slate-800 shadow flex items-center gap-2">
						<svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
							<circle cx="14" cy="14" r="8" fill="#ad0c2f" fillOpacity="0.92" />
							<circle cx="14" cy="14" r="4" fill="#ffffff" />
						</svg>
						<span className="whitespace-nowrap">Chave — Escolas municipais</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(GlobalMap);
