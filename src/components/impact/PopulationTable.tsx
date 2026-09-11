import React from 'react';
import { Users, AlertTriangle, Hospital, School, Anchor, Zap } from 'lucide-react';
import { DOWNSTREAM_SETTLEMENTS } from '../../data/mockData';
import { StatusPill } from '../layout/StatusPill';

export const PopulationTable: React.FC = () => {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              DOWNSTREAM SETTLEMENTS & EVACUATION PRIORITY MATRIX
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Koyna Valley River Corridor: Dam Axis (km 0.0) to Sangli Confluence (km 132.0)
          </p>
        </div>

        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/70 border border-rose-800/40 px-2 py-1 rounded">
          NDMA PROTOCOL LEVEL-3
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
              <th className="pb-2.5 font-semibold">Settlement Cluster</th>
              <th className="pb-2.5 font-semibold">Distance (km)</th>
              <th className="pb-2.5 font-semibold">Wave Arrival</th>
              <th className="pb-2.5 font-semibold">Peak Depth</th>
              <th className="pb-2.5 font-semibold">Population at Risk</th>
              <th className="pb-2.5 font-semibold">Evacuation Order</th>
              <th className="pb-2.5 font-semibold">Critical Assets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {DOWNSTREAM_SETTLEMENTS.map((settlement) => (
              <tr key={settlement.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 font-semibold text-slate-100">
                  <div>{settlement.name}</div>
                  <span className="text-[10px] text-slate-500">{settlement.id}</span>
                </td>
                <td className="py-3 text-cyan-300 font-bold">{settlement.distanceKm} km</td>
                <td className="py-3 text-amber-400 font-bold">{settlement.estimatedArrivalMin} min</td>
                <td className="py-3 text-rose-300 font-bold">{settlement.projectedMaxDepthM} m</td>
                <td className="py-3 font-bold text-slate-100">
                  {settlement.populationAtRisk.toLocaleString()}
                </td>
                <td className="py-3">
                  <StatusPill status={settlement.evacuationPriority} size="sm" />
                </td>
                <td className="py-3 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-3">
                    <span title="Hospitals" className="flex items-center gap-1 text-slate-300">
                      <Hospital className="w-3 h-3 text-rose-400" />
                      {settlement.criticalFacilities.hospitals}
                    </span>
                    <span title="Schools / Shelters" className="flex items-center gap-1 text-slate-300">
                      <School className="w-3 h-3 text-cyan-400" />
                      {settlement.criticalFacilities.schools}
                    </span>
                    <span title="Bridges" className="flex items-center gap-1 text-slate-300">
                      <Anchor className="w-3 h-3 text-amber-400" />
                      {settlement.criticalFacilities.bridges}
                    </span>
                    <span title="Power Substations" className="flex items-center gap-1 text-slate-300">
                      <Zap className="w-3 h-3 text-amber-300" />
                      {settlement.criticalFacilities.substations}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
