import React from 'react';
import {
  Building2,
  Route,
  Anchor,
  Hospital,
  School,
  Zap,
  Gauge,
  TrendingUp,
  Clock,
  Timer,
  AlertTriangle,
} from 'lucide-react';

export const InfrastructureCards: React.FC = () => {
  return (
    <div className="space-y-4 select-none">
      {/* 6 Infrastructure Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        {/* Buildings */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              BUILDINGS
            </span>
            <span className="text-rose-400 font-bold">HIGH</span>
          </div>
          <div className="text-xl font-bold text-slate-100">1,420</div>
          <div className="text-[10px] text-slate-500 mt-1">1,180 Residential</div>
        </div>

        {/* Roads */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <Route className="w-3.5 h-3.5 text-amber-400" />
              ROADS CUT OFF
            </span>
            <span className="text-amber-400 font-bold">52 km</span>
          </div>
          <div className="text-xl font-bold text-slate-100">52.4 <span className="text-xs text-slate-500">km</span></div>
          <div className="text-[10px] text-slate-500 mt-1">SH-78 Submerged</div>
        </div>

        {/* Bridges */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <Anchor className="w-3.5 h-3.5 text-rose-400" />
              BRIDGES
            </span>
            <span className="text-rose-400 font-bold">CRITICAL</span>
          </div>
          <div className="text-xl font-bold text-rose-400">4 <span className="text-xs text-slate-500">Submerged</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Patan & Helwak</div>
        </div>

        {/* Hospitals */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <Hospital className="w-3.5 h-3.5 text-emerald-400" />
              HOSPITALS
            </span>
            <span className="text-emerald-400 font-bold">ALERT</span>
          </div>
          <div className="text-xl font-bold text-slate-100">5 <span className="text-xs text-slate-500">Units</span></div>
          <div className="text-[10px] text-slate-500 mt-1">1 Evacuation Priority</div>
        </div>

        {/* Schools */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-cyan-400" />
              SCHOOLS / RELIEF
            </span>
            <span className="text-cyan-400 font-bold">28 CAMPS</span>
          </div>
          <div className="text-xl font-bold text-slate-100">28 <span className="text-xs text-slate-500">Designated</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Safe Above High Flood</div>
        </div>

        {/* Power Substations */}
        <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              POWER GRIDS
            </span>
            <span className="text-rose-400 font-bold">3 SHUT</span>
          </div>
          <div className="text-xl font-bold text-slate-100">6 <span className="text-xs text-slate-500">110kV Nodes</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Patan Substation Isol.</div>
        </div>
      </div>

      {/* Hydrological Critical Parameters Bar */}
      <div className="bg-[#0F172A] p-4 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Maximum Flood Depth</div>
            <div className="text-base font-bold text-cyan-300">8.60 meters</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Maximum Flow Velocity</div>
            <div className="text-base font-bold text-slate-100">5.80 m/s (Supercritical)</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-amber-950/80 border border-amber-500/30 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">First Arrival (Koynanagar)</div>
            <div className="text-base font-bold text-amber-300">18 minutes</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-rose-950/80 border border-rose-500/30 text-rose-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Inundation Duration</div>
            <div className="text-base font-bold text-rose-300">36.5 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};
