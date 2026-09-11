import React from 'react';
import { Layers, ShieldAlert } from 'lucide-react';

export const GISLegend: React.FC = () => {
  return (
    <div className="bg-[#0B0F17]/95 border border-slate-800 rounded-lg p-3 font-mono text-xs shadow-2xl backdrop-blur-md select-none w-56">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span>GIS HAZARD LEGEND</span>
      </div>

      {/* Depth classification scale */}
      <div className="space-y-1.5 text-[10px]">
        <div className="text-slate-400 font-semibold mb-1">Flood Inundation Depth</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-rose-600 border border-rose-400" />
            <span className="text-slate-200">&gt; 5.0 m (Extreme)</span>
          </div>
          <span className="text-rose-400 font-bold">L4</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-400" />
            <span className="text-slate-200">2.0 – 5.0 m (Severe)</span>
          </div>
          <span className="text-amber-400 font-bold">L3</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-500 border border-sky-400" />
            <span className="text-slate-200">0.5 – 2.0 m (Moderate)</span>
          </div>
          <span className="text-sky-400 font-bold">L2</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 border border-cyan-300" />
            <span className="text-slate-200">0.1 – 0.5 m (Low)</span>
          </div>
          <span className="text-cyan-400 font-bold">L1</span>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="border-t border-slate-800 mt-2.5 pt-2 space-y-1 text-[10px] text-slate-300">
        <div className="text-slate-400 font-semibold mb-1">Key Spatial Entities</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-900" />
          <span>Dam Crest Axis (Axis 0)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Vulnerable Settlement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          <span>Critical Infrastructure Node</span>
        </div>
      </div>
    </div>
  );
};
