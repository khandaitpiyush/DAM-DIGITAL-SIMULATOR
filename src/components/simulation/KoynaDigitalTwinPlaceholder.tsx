import React, { useState } from 'react';
import {
  Maximize2,
  RotateCcw,
  Compass,
  Layers,
  Eye,
  EyeOff,
  Cpu,
  Crosshair,
  MapPin,
  Activity,
  Box,
  Terminal,
  Info,
} from 'lucide-react';
import { SimulationMode, SimulationResults, TimelineStep } from '../../types/simulation';

interface KoynaDigitalTwinPlaceholderProps {
  currentScenario: string;
  simulationMode: SimulationMode;
  simulationStatus: string;
  currentTimeline: TimelineStep;
  results?: SimulationResults | null;
  breachEnabled?: boolean;
}

export const KoynaDigitalTwinPlaceholder: React.FC<KoynaDigitalTwinPlaceholderProps> = ({
  currentScenario,
  simulationMode,
  simulationStatus,
  currentTimeline,
  results,
  breachEnabled = false,
}) => {
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [activeCamView, setActiveCamView] = useState<string>('ISOMETRIC');

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#070B12] rounded-lg border border-slate-800 flex flex-col overflow-hidden shadow-2xl select-none group">
      {/* Precision Tactical Blueprint Background Grid */}
      <div className="absolute inset-0 tactical-grid-cyan opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-[#070B12]/80 pointer-events-none" />

      {/* Viewport Top Bar Controls */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-[#0B0F17]/90 border-b border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
              KOYNA DIGITAL TWIN
            </span>
          </div>
          <span className="text-slate-600 text-xs">|</span>
          <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            THREE.JS SIMULATION VIEWPORT
          </span>
          <span className="hidden xl:inline-block text-[10px] font-mono text-slate-400">
            TARGET CANVAS: 1920×1080 (16:9)
          </span>
        </div>

        {/* Viewport Action Placeholders */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <button
            onClick={() => setActiveCamView('RESET')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeCamView === 'RESET'
                ? 'bg-slate-700 text-white border-slate-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Reset View]
          </button>
          <button
            onClick={() => setActiveCamView('TOP')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeCamView === 'TOP'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Top]
          </button>
          <button
            onClick={() => setActiveLayer(activeLayer === 'terrain' ? 'all' : 'terrain')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeLayer === 'terrain'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Terrain]
          </button>
          <button
            onClick={() => setActiveLayer(activeLayer === 'flood' ? 'all' : 'flood')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeLayer === 'flood'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Flood]
          </button>
          <button
            onClick={() => setActiveLayer(activeLayer === 'infra' ? 'all' : 'infra')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeLayer === 'infra'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Infrastructure]
          </button>
          <button
            onClick={() => setActiveLayer(activeLayer === 'satellite' ? 'all' : 'satellite')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeLayer === 'satellite'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            [Satellite]
          </button>
        </div>
      </div>

      {/* Main Viewport Body / Tactical HUD Display */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Viewport Corner Reticles & Technical Brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none" />

        {/* Tactical Crosshair Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-cyan-400 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-dashed border-cyan-300" />
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-400" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-400" />
        </div>

        {/* Center Blueprint Panel & Notice */}
        <div className="relative z-10 max-w-lg p-6 rounded-lg bg-[#0F172A]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          {/* Tactical Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-4">
            <Box className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold tracking-wider">
              [ THREE.JS / DIGITAL TWIN PLACEHOLDER ]
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-100 tracking-wide uppercase mb-1">
            KOYNA DAM DIGITAL TWIN
          </h2>
          <div className="text-xs font-mono text-cyan-300 mb-3">
            WebGL / Three.js Simulation Context Standby
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            "Digital Twin visualization will be integrated here."
          </p>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 text-left font-mono text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Future Model:</span>
              <span className="text-slate-200">Koyna Dam GLB + 10m DEM Terrain</span>
            </div>
            <div className="flex justify-between">
              <span>Spillway Integration:</span>
              <span className="text-cyan-400">6 Radial Gates (Dynamic Transform)</span>
            </div>
            <div className="flex justify-between">
              <span>Hydrodynamic Layer:</span>
              <span className="text-emerald-400">2D SWE Flood Inundation Mesh</span>
            </div>
            <div className="flex justify-between">
              <span>Current Time Index:</span>
              <span className="text-amber-400 font-bold">{currentTimeline}</span>
            </div>
            {breachEnabled && (
              <div className="flex justify-between text-rose-400 font-bold border-t border-slate-800 pt-1 mt-1">
                <span>Breach Visualization:</span>
                <span>ARMED & SIMULATING</span>
              </div>
            )}
          </div>
        </div>

        {/* Viewport Overlay Telemetry HUD (Left) */}
        <div className="absolute bottom-6 left-6 text-left font-mono text-[11px] text-slate-400 bg-[#0B0F17]/85 p-3 rounded border border-slate-800/80 backdrop-blur-sm pointer-events-none hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-1">
            Camera & Spatial HUD
          </div>
          <div>Azimuth: <span className="text-slate-200">214.5° SW</span></div>
          <div>Pitch / Tilt: <span className="text-slate-200">-34.0°</span></div>
          <div>FOV: <span className="text-slate-200">60.0°</span></div>
          <div>Dam Axis Coord: <span className="text-slate-200">17.3986° N, 73.7492° E</span></div>
          <div>Crest Datum: <span className="text-cyan-300 font-semibold">659.43m (MSL)</span></div>
        </div>

        {/* Viewport Overlay Telemetry HUD (Right) */}
        <div className="absolute bottom-6 right-6 text-right font-mono text-[11px] text-slate-400 bg-[#0B0F17]/85 p-3 rounded border border-slate-800/80 backdrop-blur-sm pointer-events-none hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-1">
            Simulation Stream
          </div>
          <div>Scenario: <span className="text-slate-200">{currentScenario}</span></div>
          <div>Mode: <span className="text-cyan-300">{simulationMode}</span></div>
          <div>Status: <span className="text-emerald-400">{simulationStatus}</span></div>
          <div>Temporal Step: <span className="text-amber-300 font-bold">{currentTimeline}</span></div>
          {results && (
            <div className="text-rose-400 font-bold mt-1">
              Flood Extent: {results.floodedAreaKm2} km²
            </div>
          )}
        </div>
      </div>

      {/* Viewport Bottom Status Bar */}
      <div className="px-4 py-2 bg-[#0B0F17]/95 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Grid: WGS84 / UTM Zone 43N
          </span>
          <span>•</span>
          <span>Scale: 1:15,000</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Renderer:</span>
          <span className="text-amber-400 font-medium">[STANDBY PLACEHOLDER]</span>
        </div>
      </div>
    </div>
  );
};
