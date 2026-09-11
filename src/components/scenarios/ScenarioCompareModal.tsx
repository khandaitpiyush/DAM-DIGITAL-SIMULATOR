import React, { useState } from 'react';
import { X, Scale, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Scenario } from '../../types/scenario';
import { StatusPill } from '../layout/StatusPill';

interface ScenarioCompareModalProps {
  isOpen: boolean;
  baseScenario: Scenario;
  allScenarios: Scenario[];
  onClose: () => void;
  onRunSelected: (scenario: Scenario) => void;
}

export const ScenarioCompareModal: React.FC<ScenarioCompareModalProps> = ({
  isOpen,
  baseScenario,
  allScenarios,
  onClose,
  onRunSelected,
}) => {
  const [selectedCompareId, setSelectedCompareId] = useState<string>(
    allScenarios.find((s) => s.id !== baseScenario.id)?.id || allScenarios[0]?.id
  );

  if (!isOpen) return null;

  const targetScenario = allScenarios.find((s) => s.id === selectedCompareId) || allScenarios[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-4xl bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#0B0F17] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              SCENARIO COMPARATIVE HYDRODYNAMIC ANALYSIS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compare Selector Bar */}
        <div className="p-4 bg-[#090D14] border-b border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Baseline Scenario:</span>
            <span className="text-cyan-300 font-bold bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800">
              {baseScenario.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Compare with:</span>
            <select
              value={selectedCompareId}
              onChange={(e) => setSelectedCompareId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              {allScenarios
                .filter((s) => s.id !== baseScenario.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="p-5 grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto text-xs font-mono">
          {/* Left: Baseline */}
          <div className="bg-[#0B0F17] p-4 rounded border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="text-[10px] text-cyan-400 font-bold uppercase">{baseScenario.code}</div>
                <div className="font-bold text-slate-100 text-sm">{baseScenario.name}</div>
              </div>
              <StatusPill status={baseScenario.riskLevel} size="sm" />
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Reservoir Stage:</span>
                <span className="text-slate-200 font-bold">{baseScenario.reservoir.waterLevelMeters} m ({baseScenario.reservoir.storagePercentage}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Rainfall:</span>
                <span className="text-cyan-300 font-bold">{baseScenario.weather.rainfallNowMmHr} mm/hr</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Breach Width:</span>
                <span className={baseScenario.breach.enabled ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {baseScenario.breach.enabled ? `${baseScenario.breach.widthMeters} m` : 'None (Intact)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Flooded Area:</span>
                <span className="text-slate-100 font-bold">{baseScenario.resultsPreview.floodedAreaKm2} km²</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Max Flood Depth:</span>
                <span className="text-slate-100 font-bold">{baseScenario.resultsPreview.maxDepthMeters} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Arrival at Helwak:</span>
                <span className="text-amber-400 font-bold">{baseScenario.resultsPreview.floodArrivalMin} min</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Population at Risk:</span>
                <span className="text-rose-400 font-bold">{baseScenario.resultsPreview.populationAtRisk.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onRunSelected(baseScenario);
                onClose();
              }}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
            >
              LOAD BASELINE SCENARIO
            </button>
          </div>

          {/* Right: Target Comparison */}
          <div className="bg-[#0B0F17] p-4 rounded border border-cyan-800/60 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="text-[10px] text-cyan-400 font-bold uppercase">{targetScenario.code}</div>
                <div className="font-bold text-slate-100 text-sm">{targetScenario.name}</div>
              </div>
              <StatusPill status={targetScenario.riskLevel} size="sm" />
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Reservoir Stage:</span>
                <span className="text-slate-200 font-bold">{targetScenario.reservoir.waterLevelMeters} m ({targetScenario.reservoir.storagePercentage}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Rainfall:</span>
                <span className="text-cyan-300 font-bold">{targetScenario.weather.rainfallNowMmHr} mm/hr</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Breach Width:</span>
                <span className={targetScenario.breach.enabled ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {targetScenario.breach.enabled ? `${targetScenario.breach.widthMeters} m` : 'None (Intact)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Flooded Area:</span>
                <span className="text-slate-100 font-bold">{targetScenario.resultsPreview.floodedAreaKm2} km²</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Max Flood Depth:</span>
                <span className="text-slate-100 font-bold">{targetScenario.resultsPreview.maxDepthMeters} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Arrival at Helwak:</span>
                <span className="text-amber-400 font-bold">{targetScenario.resultsPreview.floodArrivalMin} min</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Population at Risk:</span>
                <span className="text-rose-400 font-bold">{targetScenario.resultsPreview.populationAtRisk.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onRunSelected(targetScenario);
                onClose();
              }}
              className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shadow"
            >
              LOAD & SIMULATE THIS SCENARIO
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
          >
            CLOSE COMPARISON
          </button>
        </div>
      </div>
    </div>
  );
};
