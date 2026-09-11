import React from 'react';
import { MetricCards } from '../components/dashboard/MetricCards';
import { ReservoirStatus } from '../components/dashboard/ReservoirStatus';
import { GateStatus } from '../components/dashboard/GateStatus';
import { WeatherPanel } from '../components/dashboard/WeatherPanel';
import { ReservoirChart } from '../components/dashboard/ReservoirChart';
import { GateState, ReservoirConditions, WeatherConditions } from '../types/simulation';
import { StatusPill } from '../components/layout/StatusPill';

interface DashboardPageProps {
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
  gates: GateState[];
  systemStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  onGateChange: (gateId: number, opening: number) => void;
  onSetGatePreset: (preset: 'ROUTINE' | 'ALL_CLOSED' | 'HIGH_FLOOD') => void;
  onNavigateToSimulation: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  reservoir,
  weather,
  gates,
  systemStatus,
  onGateChange,
  onSetGatePreset,
  onNavigateToSimulation,
}) => {
  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-xl font-bold text-slate-100 tracking-wider uppercase">
              KOYNA DAM
            </h2>
            <span className="text-slate-600 font-mono text-base">|</span>
            <span className="text-sm font-semibold text-slate-300">
              Emergency & Flood Simulation Center
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
            <span>River: Koyna</span>
            <span>•</span>
            <span>Station ID: KYN-MH-01</span>
            <span>•</span>
            <span className="text-cyan-400">Catchment: Western Ghats Crest</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Dam Safety Condition:</span>
            <StatusPill status={systemStatus} size="lg" />
          </div>

          <button
            onClick={onNavigateToSimulation}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            LAUNCH SIMULATION WORKSPACE →
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <MetricCards reservoir={reservoir} weather={weather} />

      {/* Reservoir Status & Visual Level Gauge */}
      <ReservoirStatus reservoir={reservoir} />

      {/* Dam Operations: 6 Spillway Radial Gates */}
      <GateStatus
        gates={gates}
        onGateChange={onGateChange}
        onSetPreset={onSetGatePreset}
      />

      {/* Weather Panel */}
      <WeatherPanel weather={weather} />

      {/* Inflow vs Outflow Hydrograph */}
      <ReservoirChart />
    </div>
  );
};
