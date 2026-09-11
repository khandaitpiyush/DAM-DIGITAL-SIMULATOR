import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  MapPin,
  Crosshair,
  Info,
  Maximize2,
  Navigation,
} from 'lucide-react';
import { GIS_LAYERS_CONFIG, GIS_MARKERS } from '../../data/mockData';
import { GISLayer, GISLocationMarker } from '../../types/gis';
import { LayerControls } from './LayerControls';
import { GISLegend } from './GISLegend';

export const GISWorkspace: React.FC = () => {
  const [layers, setLayers] = useState<GISLayer[]>(GIS_LAYERS_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(13);
  const [selectedMarker, setSelectedMarker] = useState<GISLocationMarker | null>(GIS_MARKERS[0]);

  const handleToggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleChangeOpacity = (id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  };

  const filteredMarkers = GIS_MARKERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 select-none max-w-[1600px] mx-auto">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F172A] border border-slate-800 p-3 rounded-lg shadow">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search spatial settlements, bridges, gauges, shelters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-700 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="hidden md:inline-block">Spatial Reference:</span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-cyan-300">
            EPSG:4326 (WGS 84) • UTM Zone 43N
          </span>
          <span className="bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/40 text-cyan-400 font-bold">
            GIS WORKSPACE
          </span>
        </div>
      </div>

      {/* Main Split: Layer Controls (Left) + Interactive Map Canvas (Center/Right) */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Layer Controls Sidebar */}
        <LayerControls
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onChangeOpacity={handleChangeOpacity}
        />

        {/* Tactical Map Viewport Placeholder */}
        <div className="flex-1 bg-[#070B12] rounded-lg border border-slate-800 relative overflow-hidden flex flex-col shadow-2xl">
          {/* Tactical Blueprint Grid */}
          <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />

          {/* Top HUD Floating Info */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0B0F17]/90 border border-slate-800 p-2 rounded-lg backdrop-blur-sm font-mono text-xs text-slate-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Center: 17.3986° N, 73.7492° E</span>
            <span className="text-slate-600">|</span>
            <span>Elevation: 659.43m</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">Zoom {zoomLevel}x</span>
          </div>

          {/* Map Controls Floating (Right) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 font-mono text-xs">
            <div className="bg-[#0B0F17]/90 border border-slate-800 rounded flex flex-col overflow-hidden shadow">
              <button
                onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                className="p-2 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-slate-800" />
              <button
                onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
                className="p-2 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-slate-800" />
              <button
                onClick={() => setZoomLevel(13)}
                className="p-2 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Reset Extent"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tactical Vector Canvas Area with River Route & Settlements */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Synthetic Vector River Corridor & Inundation Graphic */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-80" viewBox="0 0 1000 600">
              <defs>
                <linearGradient id="floodInundation" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#0284C7" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#0369A1" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Dynamic Flood Inundation Envelope (Toggled via layer) */}
              {layers.find((l) => l.id === 'layer-flood-extent')?.visible && (
                <path
                  d="M 120,180 Q 280,240 440,290 T 720,380 T 940,490 L 920,530 Q 700,430 420,340 T 100,220 Z"
                  fill="url(#floodInundation)"
                  stroke="#06B6D4"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              )}

              {/* Perennial River Course */}
              {layers.find((l) => l.id === 'layer-river-network')?.visible && (
                <path
                  d="M 110,200 Q 280,250 430,310 T 710,400 T 930,510"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}

              {/* Secondary Tributaries */}
              <path
                d="M 300,100 Q 360,200 430,310"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Koyna Dam Axis Line */}
              <line x1="110" y1="160" x2="110" y2="240" stroke="#EF4444" strokeWidth="4" />
              <text x="70" y="150" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold">
                KOYNA DAM CREST (0.0 km)
              </text>
            </svg>

            {/* Spatial Markers on Canvas */}
            <div className="absolute inset-0 pointer-events-auto">
              {filteredMarkers.map((marker, index) => {
                // Approximate coordinate projection on 1000x600 canvas
                const leftPct = 12 + index * 16;
                const topPct = 30 + index * 8 + (index % 2 === 0 ? -4 : 6);

                const isSelected = selectedMarker?.id === marker.id;

                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-1.5 rounded-full border shadow-lg transition-transform ${
                          isSelected
                            ? 'scale-125 bg-cyan-400 border-white text-slate-950 ring-4 ring-cyan-500/40'
                            : marker.risk === 'CRITICAL'
                            ? 'bg-rose-900/90 border-rose-500 text-rose-300 group-hover:scale-110'
                            : 'bg-slate-900 border-cyan-500/60 text-cyan-300 group-hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="mt-1 font-mono text-[10px] font-bold text-slate-200 bg-[#0B0F17]/90 px-1.5 py-0.5 rounded border border-slate-800 shadow whitespace-nowrap">
                        {marker.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Floating Legend (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-10">
              <GISLegend />
            </div>

            {/* Selected Marker Detail Card (Bottom Left) */}
            {selectedMarker && (
              <div className="absolute bottom-4 left-4 z-10 bg-[#0B0F17]/95 border border-slate-700 rounded-lg p-3.5 max-w-xs shadow-2xl backdrop-blur-md font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <span className="font-bold text-slate-100">{selectedMarker.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      selectedMarker.risk === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {selectedMarker.risk}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div>Type: <span className="text-slate-200">{selectedMarker.type}</span></div>
                  <div>Coords: <span className="text-slate-200">{selectedMarker.lat}° N, {selectedMarker.lng}° E</span></div>
                  <div>Ground Elevation: <span className="text-slate-200">{selectedMarker.elevationM} m MSL</span></div>
                  <div>Projected Flood Depth: <span className="text-rose-400 font-bold">{selectedMarker.depthEstM} m</span></div>
                  <div>Arrival Time: <span className="text-amber-400 font-bold">{selectedMarker.arrivalMin} min</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Notice */}
          <div className="p-2.5 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              GIS Placeholder Viewport — MapLibre / PostGIS / Cesium integration target
            </span>
            <span className="text-slate-500">Koyna-Krishna Catchment Polygon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
