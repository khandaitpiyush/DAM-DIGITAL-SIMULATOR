import React from 'react';
import {
  Activity,
  AlertTriangle,
  Building,
  Clock,
  Compass,
  Gauge,
  Info,
  MapPin,
  TrendingUp,
  Users,
  Waves,
} from 'lucide-react';
import { SimulationResults } from '../../types/simulation';
import { StatusPill } from '../layout/StatusPill';

interface ResultsPanelProps {
  results: SimulationResults | null;
  scenarioName: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, scenarioName }) => {
  if (!results) {
    return (
      <div className="w-72 lg:w-80 bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center select-none">
        <Activity className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
        <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          AWAITING SIMULATION
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
          Configure parameters and click <span className="text-cyan-400 font-mono">▶ RUN SIMULATION</span> to generate downstream hydrodynamic results.
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 lg:w-80 bg-[#0F172A] border border-slate-800 rounded-lg flex flex-col h-full overflow-hidden shadow-xl select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-[#0B0F17] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
              SIMULATION RESULTS
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
            {scenarioName}
          </div>
        </div>

        <StatusPill status={results.riskLevel} size="sm" />
      </div>

      {/* Synthetic Output Watermark Banner */}
      <div className="px-3.5 py-1.5 bg-cyan-950/40 border-b border-cyan-800/30 flex items-center justify-between text-[10px] font-mono text-cyan-300">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          SIMULATION OUTPUT
        </span>
        <span className="text-cyan-400 font-semibold">SYNTHETIC ESTIMATE</span>
      </div>

      {/* Metrics Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {/* Top 2 Primary Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Flooded Area */}
          <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              Flooded Area
            </div>
            <div className="text-lg font-bold font-mono text-cyan-300">
              {results.floodedAreaKm2} <span className="text-xs text-slate-400">km²</span>
            </div>
          </div>

          {/* Maximum Depth */}
          <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              Max Flood Depth
            </div>
            <div className="text-lg font-bold font-mono text-slate-100">
              {results.maxDepthMeters} <span className="text-xs text-slate-400">m</span>
            </div>
          </div>
        </div>

        {/* Velocity & Arrival Time */}
        <div className="grid grid-cols-2 gap-2">
          {/* Flow Velocity */}
          <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Peak Velocity
            </div>
            <div className="text-base font-bold font-mono text-slate-100">
              {results.maxVelocityMs} <span className="text-xs text-slate-400">m/s</span>
            </div>
          </div>

          {/* Flood Arrival Time */}
          <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Helwak Arrival
            </div>
            <div className="text-base font-bold font-mono text-amber-400">
              {results.floodArrivalMin} <span className="text-xs text-slate-400">min</span>
            </div>
          </div>
        </div>

        {/* Population & Buildings Impact Card */}
        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80 pb-1 flex items-center justify-between">
            <span>Downstream Exposure</span>
            <Users className="w-3 h-3 text-slate-400" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-mono text-[11px]">Population at Risk:</span>
            <span className="text-rose-400 font-mono font-bold text-sm">
              {results.populationAtRisk.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-mono text-[11px]">Buildings Affected:</span>
            <span className="text-slate-200 font-mono font-semibold">
              {results.buildingsAffected.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-mono text-[11px]">Roads Submerged:</span>
            <span className="text-slate-200 font-mono font-semibold">
              {results.roadsAffectedKm} km
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-mono text-[11px]">Critical Facilities:</span>
            <span className="text-amber-400 font-mono font-semibold">
              {results.criticalLocations} Nodes
            </span>
          </div>
        </div>

        {/* Risk Classification Banner */}
        <div
          className={`p-2.5 rounded border font-mono text-xs ${
            results.riskLevel === 'CRITICAL'
              ? 'bg-rose-950/50 border-rose-800 text-rose-300'
              : results.riskLevel === 'HIGH'
              ? 'bg-amber-950/50 border-amber-800 text-amber-300'
              : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold uppercase mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hazard Level: {results.riskLevel}</span>
          </div>
          <p className="text-[10px] leading-relaxed opacity-90">
            {results.riskLevel === 'CRITICAL'
              ? 'Immediate downstream evacuation required for Koynanagar and Helwak settlements.'
              : results.riskLevel === 'HIGH'
              ? 'Elevated river stages expected. Alert Tehsil and bridge checkpoints.'
              : 'Controlled discharge within river channel capacity.'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Solver: SWE-2D (Mock)</span>
        <span className="text-cyan-400">Δt = 0.5s</span>
      </div>
    </div>
  );
};
