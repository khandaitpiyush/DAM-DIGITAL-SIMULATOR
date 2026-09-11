import React from 'react';
import { AlertTriangle, Users, Building, Waves, Info } from 'lucide-react';
import { PopulationTable } from '../components/impact/PopulationTable';
import { InfrastructureCards } from '../components/impact/InfrastructureCards';
import { ImpactCharts } from '../components/impact/ImpactCharts';

export const FloodImpactPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-rose-950 border border-rose-500/40 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold text-slate-100 tracking-wider uppercase">
                DOWNSTREAM FLOOD IMPACT & CASUALTY ASSESSMENT
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Hydrodynamic Inundation Vulnerability • Population & Infrastructure Exposure
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-rose-950/70 text-rose-400 border border-rose-800 px-2.5 py-1 rounded">
            HAZARD SEVERITY: HIGH SURGE
          </span>
        </div>
      </div>

      {/* 1. Infrastructure & Hydrology summary */}
      <InfrastructureCards />

      {/* 2. Population & Settlements Table */}
      <PopulationTable />

      {/* 3. Recharts Impact Charts (Depth, Inflow/Outflow, Population, Reservoir Level) */}
      <ImpactCharts />
    </div>
  );
};
