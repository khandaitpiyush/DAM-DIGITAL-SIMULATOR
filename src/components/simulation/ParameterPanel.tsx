import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Save,
  Scale,
  Sliders,
  CloudRain,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  AlertOctagon,
} from 'lucide-react';
import {
  BreachParameters,
  GateState,
  ReservoirConditions,
  SimulationMode,
  SimulationStatus,
  WeatherConditions,
} from '../../types/simulation';

interface ParameterPanelProps {
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
  gates: GateState[];
  breach: BreachParameters;
  simulationStatus: SimulationStatus;
  onUpdateReservoir: (partial: Partial<ReservoirConditions>) => void;
  onUpdateWeather: (partial: Partial<WeatherConditions>) => void;
  onUpdateGate: (gateId: number, opening: number) => void;
  onUpdateBreach: (partial: Partial<BreachParameters>) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  onSaveScenario: () => void;
  onCompareScenario: () => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  reservoir,
  weather,
  gates,
  breach,
  simulationStatus,
  onUpdateReservoir,
  onUpdateWeather,
  onUpdateGate,
  onUpdateBreach,
  onRunSimulation,
  onReset,
  onSaveScenario,
  onCompareScenario,
}) => {
  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    reservoir: true,
    weather: true,
    gates: true,
    breach: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isRunning = simulationStatus === 'RUNNING';

  return (
    <div className="w-80 lg:w-88 bg-[#0F172A] border border-slate-800 rounded-lg flex flex-col h-full overflow-hidden shadow-xl select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800 bg-[#0B0F17] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
            SIMULATION PARAMETERS
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/50">
          INPUT BOUNDARY
        </span>
      </div>

      {/* Scrollable Accordion Sections */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 text-xs">
        {/* 1. RESERVOIR CONDITIONS */}
        <div>
          <button
            onClick={() => toggleSection('reservoir')}
            className="w-full px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-left font-mono font-semibold text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">01</span>
              <span>RESERVOIR CONDITIONS</span>
            </div>
            {openSections.reservoir ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.reservoir && (
            <div className="p-3.5 space-y-3 bg-[#0F172A]/40">
              {/* Water Level Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
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
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                  <span>DSL: 609.6m</span>
                  <span>FRL: 659.43m</span>
                  <span>MWL: 662.0m</span>
                </div>
              </div>

              {/* Storage % & MCM */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Storage %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="105"
                      value={reservoir.storagePercentage}
                      onChange={(e) => {
                        const pct = Number(e.target.value);
                        onUpdateReservoir({
                          storagePercentage: pct,
                          storageMCM: Math.round((pct / 100) * 2797),
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Storage (Mm³)
                  </label>
                  <input
                    type="number"
                    value={reservoir.storageMCM}
                    onChange={(e) => onUpdateReservoir({ storageMCM: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Inflow vs Outflow */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Current Inflow
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="50"
                      value={reservoir.inflowM3s}
                      onChange={(e) => onUpdateReservoir({ inflowM3s: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">m³/s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Current Outflow
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="50"
                      value={reservoir.outflowM3s}
                      onChange={(e) => onUpdateReservoir({ outflowM3s: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">m³/s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. WEATHER & CATCHMENT */}
        <div>
          <button
            onClick={() => toggleSection('weather')}
            className="w-full px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-left font-mono font-semibold text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">02</span>
              <span>WEATHER & CATCHMENT</span>
            </div>
            {openSections.weather ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.weather && (
            <div className="p-3.5 space-y-3 bg-[#0F172A]/40">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Rainfall Intensity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weather.rainfallNowMmHr}
                      onChange={(e) => onUpdateWeather({ rainfallNowMmHr: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">mm/h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Rainfall Duration
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weather.forecastDurationHrs}
                      onChange={(e) => onUpdateWeather({ forecastDurationHrs: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">hrs</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Forecast Rainfall
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weather.forecastRainfallMmHr}
                      onChange={(e) => onUpdateWeather({ forecastRainfallMmHr: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">mm/h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Upstream Inflow
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weather.upstreamInflowM3s}
                      onChange={(e) => onUpdateWeather({ upstreamInflowM3s: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">m³/s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. SPILLWAY GATES (6 Radial Gates) */}
        <div>
          <button
            onClick={() => toggleSection('gates')}
            className="w-full px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-left font-mono font-semibold text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">03</span>
              <span>SPILLWAY GATES (6 RADIAL)</span>
            </div>
            {openSections.gates ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.gates && (
            <div className="p-3.5 space-y-2.5 bg-[#0F172A]/40">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                <span>Gate Designation</span>
                <span>Opening %</span>
              </div>

              {gates.map((g) => (
                <div key={g.id} className="bg-slate-900/70 p-2 rounded border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-300 font-semibold">{g.label}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        g.status === 'FAILED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : g.openingPercentage > 0
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {g.status === 'FAILED' ? 'FAILED' : `${g.openingPercentage}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    disabled={g.status === 'FAILED'}
                    value={g.openingPercentage}
                    onChange={(e) => onUpdateGate(g.id, parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded disabled:opacity-40"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. BREACH SIMULATOR */}
        <div>
          <button
            onClick={() => toggleSection('breach')}
            className="w-full px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-left font-mono font-semibold text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-rose-400">04</span>
              <span>BREACH PARAMETERS</span>
            </div>
            {openSections.breach ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.breach && (
            <div className="p-3.5 space-y-3 bg-[#0F172A]/40">
              {/* Breach Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertOctagon
                    className={`w-4 h-4 ${breach.enabled ? 'text-rose-400' : 'text-slate-500'}`}
                  />
                  <div>
                    <div className="font-mono text-xs font-semibold text-slate-200">
                      Enable Breach
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Dam failure condition
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breach.enabled}
                    onChange={(e) => onUpdateBreach({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {breach.enabled && (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Breach Width (m)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="150"
                      value={breach.widthMeters}
                      onChange={(e) => onUpdateBreach({ widthMeters: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-rose-900/60 rounded px-2.5 py-1 text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Breach Depth (m)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={breach.depthMeters}
                      onChange={(e) => onUpdateBreach({ depthMeters: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-rose-900/60 rounded px-2.5 py-1 text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Breach Development Time (min)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="180"
                      value={breach.developmentTimeMin}
                      onChange={(e) =>
                        onUpdateBreach({ developmentTimeMin: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-rose-900/60 rounded px-2.5 py-1 text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Panel Bottom Controls & Actions */}
      <div className="p-3.5 bg-[#0B0F17] border-t border-slate-800 space-y-2">
        {/* Large Primary Action: RUN SIMULATION */}
        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className={`w-full py-2.5 px-4 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            isRunning
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-700 cursor-not-allowed animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/20 active:translate-y-0.5'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRunning ? 'SIMULATION IN PROGRESS...' : '▶ RUN SIMULATION'}</span>
        </button>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
          <button
            onClick={onSaveScenario}
            className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1"
          >
            <Save className="w-3 h-3 text-cyan-400" />
            <span>SAVE</span>
          </button>
          <button
            onClick={onReset}
            className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>RESET</span>
          </button>
          <button
            onClick={onCompareScenario}
            className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1"
          >
            <Scale className="w-3 h-3 text-emerald-400" />
            <span>COMPARE</span>
          </button>
        </div>

        {/* State Monitor */}
        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Engine State:</span>
          <span
            className={`font-semibold ${
              simulationStatus === 'RUNNING'
                ? 'text-cyan-400'
                : simulationStatus === 'COMPLETED'
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            ● {simulationStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
