import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  Sliders,
  Play,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';
import { Koyna3DScene } from './three/Koyna3DScene';
import { CameraPreset, CameraTelemetry } from './three/CameraController';
import { KoynaSimulationState } from '../../data/koynaConfig';
import {
  BreachParameters,
  GateState,
  ReservoirConditions,
  SimulationMode,
  SimulationResults,
  TimelineStep,
  WeatherConditions,
} from '../../types/simulation';

export interface KoynaDigitalTwinProps {
  currentScenario: string;
  simulationMode: SimulationMode;
  simulationStatus: string;
  currentTimeline: TimelineStep;
  results?: SimulationResults | null;
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
  gates: GateState[];
  breach: BreachParameters;
  onUpdateReservoir: (partial: Partial<ReservoirConditions>) => void;
  onUpdateWeather?: (partial: Partial<WeatherConditions>) => void;
  onUpdateGate: (gateId: number, opening: number) => void;
  onUpdateBreach: (partial: Partial<BreachParameters>) => void;
  onRunSimulation: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: (maximized: boolean) => void;
}

export const KoynaDigitalTwin: React.FC<KoynaDigitalTwinProps> = ({
  currentScenario,
  simulationMode,
  simulationStatus,
  currentTimeline,
  results,
  reservoir,
  weather,
  gates,
  breach,
  onUpdateReservoir,
  onUpdateWeather,
  onUpdateGate,
  onUpdateBreach,
  onRunSimulation,
  isMaximized: isMaximizedProp = false,
  onToggleMaximize,
}) => {
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isMaximized = isMaximizedProp !== undefined ? isMaximizedProp : internalMaximized;

  const handleToggleMaximize = (newMaximized: boolean) => {
    setInternalMaximized(newMaximized);
    onToggleMaximize?.(newMaximized);
  };

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('RESET');
  const [showTerrain, setShowTerrain] = useState(true);
  const [showFlood, setShowFlood] = useState(true);
  const [, setCameraTelemetry] = useState<CameraTelemetry>({
    azimuthDeg: 214.5,
    pitchDeg: -34.0,
    fov: 48,
    position: { x: 34, y: 24, z: 42 },
  });

  // Calculate total outflow based on realistic Koyna design discharge capacity (~5,465 m³/s total, ~910 m³/s per gate)
  const spillwayDischarge = gates.reduce(
    (sum, g) => sum + (g.status === 'FAILED' ? 0 : Math.round((g.openingPercentage / 100) * 910)),
    0
  );
  const totalOutflow = spillwayDischarge + (breach.enabled ? Math.round(breach.widthMeters * breach.depthMeters * 8.5) : 0);

  // Map to Three.js simulation state
  const simulationState: KoynaSimulationState = {
    reservoirLevelMeters: reservoir.waterLevelMeters,
    storagePercentage: reservoir.storagePercentage,
    inflow: reservoir.inflowM3s,
    outflow: totalOutflow,
    rainfallIntensity: weather.rainfallNowMmHr,
    gateOpenings: gates.map((g) => (g.status === 'FAILED' ? 0 : g.openingPercentage)),
    breach: {
      enabled: breach.enabled,
      width: breach.widthMeters,
      depth: breach.depthMeters,
      developmentTime: breach.developmentTimeMin,
    },
    simulationTime: 0,
    timelineStep: currentTimeline,
    simulationStatus,
  };

  const isRunning = simulationStatus === 'RUNNING';

  // Keyboard shortcut: Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        handleToggleMaximize(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  // Content for the 3D scene and floating controls
  const sceneContent = (
    <div
      className={`w-full h-full bg-[#070B12] overflow-hidden select-none flex flex-col ${
        isMaximized
          ? 'fixed inset-0 z-[99999] w-screen h-screen m-0 p-0'
          : 'relative min-h-[460px] rounded-lg border border-slate-800 shadow-2xl'
      }`}
    >
      {/* 
        NON-MAXIMIZED TOOLBAR 
        (Only shown when in normal dashboard/split view)
      */}
      {!isMaximized && (
        <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-[#0B0F17]/95 border-b border-slate-800/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
                KOYNA DIGITAL TWIN
              </span>
            </div>

            <span className="text-slate-600 text-xs">|</span>

            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
              DAYLIGHT 3D SIMULATION
            </span>
          </div>

          {/* Camera Presets & Maximize Button */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <button
              onClick={() => setActiveCameraPreset('RESET')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                activeCameraPreset === 'RESET'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="Dam & Reservoir Overview"
            >
              [Reset View]
            </button>

            <button
              onClick={() => setActiveCameraPreset('TOP')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                activeCameraPreset === 'TOP'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="Bird's Eye Top View"
            >
              [Top]
            </button>

            <button
              onClick={() => setActiveCameraPreset('SPILLWAY')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                activeCameraPreset === 'SPILLWAY'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="6 Radial Gates Close-Up"
            >
              [Spillway]
            </button>

            <button
              onClick={() => setActiveCameraPreset('DOWNSTREAM')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                activeCameraPreset === 'DOWNSTREAM'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="Downstream River Canyon"
            >
              [Downstream]
            </button>

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            {/* MAXIMIZE BUTTON */}
            <button
              onClick={() => handleToggleMaximize(true)}
              className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md"
              title="Maximize to fit entire screen (3D Digital Twin with Input Parameters)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>MAXIMIZE</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        3D THREE.JS CANVAS CONTAINER 
        Takes 100% of viewport. In maximized mode, this covers 100vw × 100vh!
      */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        <Koyna3DScene
          simulationState={simulationState}
          activePreset={activeCameraPreset}
          onCameraUpdate={(tel) => setCameraTelemetry(tel)}
          showTerrainLayer={showTerrain}
          showFloodLayer={showFlood}
        />

        {/* 
          FULLSCREEN MODE: FLOATING MINIMAL TOP-RIGHT CONTROLS 
          (Exit Fullscreen button, camera presets, telemetry & layer toggles)
        */}
        {isMaximized && (
          <div className="absolute top-4 right-4 z-[10000] flex items-center gap-2 font-mono text-xs">
            {/* Realtime Outflow Badge */}
            <div className="hidden md:flex items-center gap-2 bg-[#0B0F17]/90 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-2xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-400 text-[11px]">OUTFLOW:</span>
              <span className="text-cyan-300 font-bold text-[11px]">{totalOutflow} m³/s</span>
            </div>

            {/* Camera Presets Pill */}
            <div className="bg-[#0B0F17]/90 border border-slate-700 rounded-lg p-1 shadow-2xl backdrop-blur-md flex items-center gap-1">
              <button
                onClick={() => setActiveCameraPreset('RESET')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                  activeCameraPreset === 'RESET'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reset
              </button>
              <button
                onClick={() => setActiveCameraPreset('TOP')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                  activeCameraPreset === 'TOP'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setActiveCameraPreset('SPILLWAY')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                  activeCameraPreset === 'SPILLWAY'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Spillway
              </button>
              <button
                onClick={() => setActiveCameraPreset('DOWNSTREAM')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                  activeCameraPreset === 'DOWNSTREAM'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Downstream
              </button>
            </div>

            {/* Layer Toggles */}
            <div className="bg-[#0B0F17]/90 border border-slate-700 rounded-lg p-1 shadow-2xl backdrop-blur-md flex items-center gap-1">
              <button
                onClick={() => setShowTerrain(!showTerrain)}
                className={`px-2 py-1 rounded text-[11px] transition-colors ${
                  showTerrain ? 'text-emerald-400 bg-emerald-950/60 font-bold' : 'text-slate-500'
                }`}
                title="Toggle Terrain Canyon"
              >
                Terrain
              </button>
              <button
                onClick={() => setShowFlood(!showFlood)}
                className={`px-2 py-1 rounded text-[11px] transition-colors ${
                  showFlood ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'text-slate-500'
                }`}
                title="Toggle Flood Water"
              >
                Flood
              </button>
            </div>

            {/* EXIT FULLSCREEN / RESTORE BUTTON */}
            <button
              onClick={() => handleToggleMaximize(false)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 border border-slate-600 text-slate-100 font-bold flex items-center gap-2 transition-all shadow-2xl backdrop-blur-md active:translate-y-0.5"
              title="Exit Fullscreen (or press Esc)"
            >
              <Minimize2 className="w-4 h-4 text-cyan-400" />
              <span>EXIT FULLSCREEN</span>
            </button>
          </div>
        )}

        {/* 
          FULLSCREEN MODE: ONLY INPUT PARAMETERS PANEL (ON THE LEFT)
          Exact requirement: "on maximize it should be on full screen like the three.js simulation / digital twin should be maximized and only input parameters should be visible"
        */}
        {isMaximized && (
          <div
            className={`absolute top-5 bottom-5 left-5 z-[10000] transition-all duration-300 flex ${
              isLeftPanelOpen ? 'w-84 lg:w-92' : 'w-12'
            }`}
          >
            {isLeftPanelOpen ? (
              <div className="w-full h-full bg-[#0B0F17]/90 border border-slate-700/90 rounded-xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden font-mono text-xs">
                {/* Header */}
                <div className="p-3.5 bg-[#090D14]/95 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-slate-100 tracking-wider uppercase">
                      INPUT PARAMETERS
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLeftPanelOpen(false)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    title="Collapse Parameters"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Controls */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* 1. RESERVOIR */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-1 flex justify-between items-center">
                      <span>RESERVOIR CONDITIONS</span>
                      <span className="text-slate-400 font-normal">{reservoir.waterLevelMeters.toFixed(1)}m</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Water Level</span>
                        <span className="text-cyan-300 font-bold">{reservoir.waterLevelMeters.toFixed(2)} m</span>
                      </div>
                      <input
                        type="range"
                        min="620"
                        max="665"
                        step="0.1"
                        value={reservoir.waterLevelMeters}
                        onChange={(e) => {
                          const level = parseFloat(e.target.value);
                          const pct = Math.min(100, Math.max(10, Math.round(((level - 609.6) / (659.43 - 609.6)) * 100)));
                          onUpdateReservoir({
                            waterLevelMeters: level,
                            storagePercentage: pct,
                            storageMCM: Math.round((pct / 100) * 2797),
                          });
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-1">Storage %</span>
                        <input
                          type="number"
                          value={reservoir.storagePercentage}
                          onChange={(e) => onUpdateReservoir({ storagePercentage: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-1">Inflow (m³/s)</span>
                        <input
                          type="number"
                          value={reservoir.inflowM3s}
                          onChange={(e) => onUpdateReservoir({ inflowM3s: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. WEATHER & RAINFALL */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-1 flex justify-between items-center">
                      <span>WEATHER & RAINFALL</span>
                      <span className="text-slate-400 font-normal">{weather.rainfallNowMmHr} mm/h</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Current Rainfall</span>
                        <span className="text-amber-300 font-bold">{weather.rainfallNowMmHr} mm/h</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="5"
                        value={weather.rainfallNowMmHr}
                        onChange={(e) => onUpdateWeather?.({ rainfallNowMmHr: Number(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-1">Forecast (mm/h)</span>
                        <input
                          type="number"
                          value={weather.forecastRainfallMmHr}
                          onChange={(e) => onUpdateWeather?.({ forecastRainfallMmHr: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-1">Condition</span>
                        <span className="inline-block w-full bg-slate-900 border border-slate-800 rounded p-1 text-cyan-300 text-[10px] font-mono text-center">
                          {weather.rainfallNowMmHr > 80 ? 'EXTREME FLOOD' : weather.rainfallNowMmHr > 30 ? 'HEAVY RAIN' : 'MODERATE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. SPILLWAY GATES */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-1 flex justify-between items-center">
                      <span>SPILLWAY GATES (6 UNITS)</span>
                      <span className="text-cyan-300 font-bold">{spillwayDischarge} m³/s</span>
                    </div>

                    {/* Quick presets */}
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => gates.forEach((g) => onUpdateGate(g.id, 100))}
                        className="flex-1 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        All 100%
                      </button>
                      <button
                        type="button"
                        onClick={() => gates.forEach((g) => onUpdateGate(g.id, 30))}
                        className="flex-1 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        Routine 30%
                      </button>
                      <button
                        type="button"
                        onClick={() => gates.forEach((g) => onUpdateGate(g.id, 0))}
                        className="flex-1 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-300 transition-colors"
                      >
                        All Close 0%
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {gates.map((g) => (
                        <div key={g.id} className="bg-slate-900/80 p-2 rounded border border-slate-800">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-300 font-semibold">{g.label}</span>
                            <span className="text-cyan-300 font-bold">{g.openingPercentage}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={g.openingPercentage}
                            onChange={(e) => onUpdateGate(g.id, parseInt(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. BREACH SIMULATOR */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                        BREACH SIMULATOR
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={breach.enabled}
                          onChange={(e) => onUpdateBreach({ enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>

                    {breach.enabled && (
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-1">Breach Width (m)</span>
                          <input
                            type="number"
                            value={breach.widthMeters}
                            onChange={(e) => onUpdateBreach({ widthMeters: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-rose-900 rounded p-1 text-rose-300 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-1">Breach Depth (m)</span>
                          <input
                            type="number"
                            value={breach.depthMeters}
                            onChange={(e) => onUpdateBreach({ depthMeters: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-rose-900 rounded p-1 text-rose-300 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary RUN SIMULATION Button */}
                <div className="p-3.5 bg-[#090D14]/95 border-t border-slate-800">
                  <button
                    onClick={onRunSimulation}
                    disabled={isRunning}
                    className={`w-full py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isRunning
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-700 animate-pulse cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:translate-y-0.5 shadow-cyan-500/20'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isRunning ? 'SIMULATION RUNNING...' : '▶ RUN SIMULATION'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLeftPanelOpen(true)}
                className="w-12 h-14 bg-[#0B0F17]/95 border border-slate-700 rounded-r-xl flex items-center justify-center text-cyan-400 shadow-2xl backdrop-blur-md hover:bg-slate-900"
                title="Expand Parameter Panel"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* NON-MAXIMIZED FOOTER */}
      {!isMaximized && (
        <div className="px-4 py-2 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Coordinates: 17.3986° N, 73.7492° E
            </span>
            <span>•</span>
            <span>Dam Axis Elevation: 659.43m</span>
            <span>•</span>
            <span>Outflow: {totalOutflow} m³/s</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Render Mode:</span>
            <span className="text-emerald-400 font-medium">Daylight WebGL (60 FPS)</span>
          </div>
        </div>
      )}
    </div>
  );

  return sceneContent;
};
