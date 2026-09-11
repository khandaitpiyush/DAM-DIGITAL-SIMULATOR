import React from 'react';
import { Waves, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { ReservoirConditions } from '../../types/simulation';
import { KOYNA_CONFIG } from '../../data/mockData';

interface ReservoirStatusProps {
  reservoir: ReservoirConditions;
}

export const ReservoirStatus: React.FC<ReservoirStatusProps> = ({ reservoir }) => {
  const availableCapacity = Math.max(0, KOYNA_CONFIG.totalStorageMCM - reservoir.storageMCM);
  const freeboardMeters = +(KOYNA_CONFIG.fullReservoirLevelMeters - reservoir.waterLevelMeters).toFixed(2);

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              RESERVOIR STATUS & STORAGE GAUGE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Shivsagar Lake Stage • Catchment Area: 891.78 km²
          </p>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-2 py-1 rounded flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>SYNTHETIC TELEMETRY</span>
        </div>
      </div>

      {/* Main Grid: Gauge Graphic (Left) + Breakdown Metrics (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Dam Cross-Section Stage Visualizer */}
        <div className="md:col-span-5 bg-[#0B0F17] p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Elevation (MSL)</span>
            <span className="text-cyan-300 font-bold">{reservoir.waterLevelMeters.toFixed(2)} m</span>
          </div>

          {/* Graphical Dam Elevation Column */}
          <div className="relative h-44 w-full bg-slate-900 rounded border border-slate-800 overflow-hidden flex flex-col justify-end">
            {/* Top Flood Buffer (MWL 662m to FRL 659.43m) */}
            <div className="absolute top-0 inset-x-0 h-8 border-b border-dashed border-rose-500/50 bg-rose-950/20 flex items-center justify-between px-2 text-[9px] font-mono text-rose-400">
              <span>MWL 662.00m (High Surcharge)</span>
              <span>2.57m Cushion</span>
            </div>

            {/* FRL Line */}
            <div className="absolute top-8 inset-x-0 border-b-2 border-amber-500/80 z-10 flex items-center justify-between px-2 text-[9px] font-mono text-amber-300">
              <span className="bg-slate-950/80 px-1 rounded">FRL 659.43m</span>
              <span className="bg-slate-950/80 px-1 rounded">Freeboard: {freeboardMeters}m</span>
            </div>

            {/* Water Reservoir Body */}
            <div
              className="w-full bg-gradient-to-t from-cyan-900/90 via-cyan-600/70 to-cyan-400/90 transition-all duration-500 relative flex items-start justify-center"
              style={{ height: `${Math.min(96, Math.max(15, reservoir.storagePercentage))}%` }}
            >
              {/* Ripple water surface effect */}
              <div className="w-full h-1.5 bg-cyan-200/60 shadow-sm shadow-cyan-300" />
              <div className="absolute top-2 text-[10px] font-mono font-bold text-slate-950 bg-cyan-200/90 px-2 py-0.5 rounded shadow">
                Active Pool: {reservoir.storagePercentage}%
              </div>
            </div>

            {/* Dead Storage Bed Level */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between px-2 text-[9px] font-mono text-slate-500">
              <span>DSL: 609.60m (Dead Storage)</span>
              <span>Silt Bed</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Rubble Concrete Gravity Dam</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Structural Dam Monitored
            </span>
          </div>
        </div>

        {/* Right: Technical Metric Breakdown Table */}
        <div className="md:col-span-7 grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Current Stage</div>
            <div className="text-lg font-bold text-cyan-300">{reservoir.waterLevelMeters.toFixed(2)} m</div>
            <div className="text-[10px] text-slate-500">2,154.8 ft MSL</div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Full Reservoir Level (FRL)</div>
            <div className="text-lg font-bold text-slate-200">{KOYNA_CONFIG.fullReservoirLevelMeters} m</div>
            <div className="text-[10px] text-slate-500">2,163.5 ft MSL</div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Live Storage Volume</div>
            <div className="text-lg font-bold text-slate-100">{reservoir.storageMCM.toLocaleString()} Mm³</div>
            <div className="text-[10px] text-slate-500">~93.8 TMC Equivalent</div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Available Buffer Capacity</div>
            <div className="text-lg font-bold text-amber-300">{availableCapacity} Mm³</div>
            <div className="text-[10px] text-slate-500">{(100 - reservoir.storagePercentage).toFixed(1)}% remaining</div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Current Inflow Rate</div>
            <div className="text-base font-bold text-cyan-400">{reservoir.inflowM3s.toLocaleString()} m³/s</div>
            <div className="text-[10px] text-emerald-400">Catchment Discharge</div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase mb-0.5">Spillway & Turbine Outflow</div>
            <div className="text-base font-bold text-slate-200">{reservoir.outflowM3s.toLocaleString()} m³/s</div>
            <div className="text-[10px] text-slate-500">Spillway: 284 m³/s</div>
          </div>
        </div>
      </div>
    </div>
  );
};
