import React from 'react';
import { Sliders, AlertTriangle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { GateState } from '../../types/simulation';

interface GateStatusProps {
  gates: GateState[];
  onGateChange?: (gateId: number, opening: number) => void;
  onSetPreset?: (preset: 'ROUTINE' | 'ALL_CLOSED' | 'HIGH_FLOOD') => void;
}

export const GateStatus: React.FC<GateStatusProps> = ({ gates, onGateChange, onSetPreset }) => {
  const totalDischarge = gates.reduce(
    (sum, g) => sum + (g.status === 'FAILED' ? 0 : Math.round((g.openingPercentage / 100) * 500)),
    0
  );

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              KOYNA SPILLWAY RADIAL GATES (6 UNITS)
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Crest Radial Gates (12.5m × 7.6m) • Total Spillway Discharge: <span className="text-cyan-400 font-bold">{totalDischarge} m³/s</span>
          </p>
        </div>

        {/* Quick Presets */}
        {onSetPreset && (
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <button
              onClick={() => onSetPreset('ROUTINE')}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              Preset: Routine (20%)
            </button>
            <button
              onClick={() => onSetPreset('ALL_CLOSED')}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              All Closed
            </button>
            <button
              onClick={() => onSetPreset('HIGH_FLOOD')}
              className="px-2.5 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300"
            >
              High Flood (65%)
            </button>
          </div>
        )}
      </div>

      {/* 6 Radial Gates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {gates.map((gate) => {
          const isOpen = gate.openingPercentage === 100;
          const isClosed = gate.openingPercentage === 0;
          const isPartial = gate.openingPercentage > 0 && gate.openingPercentage < 100;
          const isFailed = gate.status === 'FAILED';

          let statusBadge = 'CLOSED';
          let statusClasses = 'bg-slate-800 text-slate-400 border-slate-700';

          if (isFailed) {
            statusBadge = 'FAILED';
            statusClasses = 'bg-rose-950/80 text-rose-400 border-rose-800';
          } else if (isOpen) {
            statusBadge = 'OPEN';
            statusClasses = 'bg-cyan-950/90 text-cyan-300 border-cyan-700';
          } else if (isPartial) {
            statusBadge = 'PARTIAL';
            statusClasses = 'bg-sky-950/80 text-sky-300 border-sky-700';
          }

          return (
            <div
              key={gate.id}
              className={`bg-[#0B0F17] p-3 rounded-lg border transition-all ${
                isFailed
                  ? 'border-rose-800/80 bg-rose-950/10'
                  : isPartial || isOpen
                  ? 'border-cyan-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-200">
                  {gate.label}
                </span>
                <span
                  className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border uppercase ${statusClasses}`}
                >
                  {statusBadge}
                </span>
              </div>

              {/* Radial Gate Visualization Graphic */}
              <div className="relative h-16 w-full bg-slate-900 rounded border border-slate-800/80 mb-2 overflow-hidden flex flex-col justify-end">
                {/* Gate Aperture Arc Graphic */}
                <div
                  className="w-full bg-cyan-500/30 border-t border-cyan-400 transition-all duration-300 relative flex items-center justify-center"
                  style={{ height: `${Math.max(6, gate.openingPercentage)}%` }}
                >
                  {gate.openingPercentage > 0 && (
                    <div className="w-full h-full bg-gradient-to-t from-cyan-600/40 to-cyan-400/20 animate-pulse" />
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-slate-200 drop-shadow">
                  {gate.openingPercentage}%
                </div>
              </div>

              {/* Interactive Slider if handler provided */}
              {onGateChange && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  disabled={isFailed}
                  value={gate.openingPercentage}
                  onChange={(e) => onGateChange(gate.id, parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded disabled:opacity-30 mb-1"
                />
              )}

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Discharge:</span>
                <span className="text-slate-200 font-semibold">
                  {Math.round((gate.openingPercentage / 100) * 500)} m³/s
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
