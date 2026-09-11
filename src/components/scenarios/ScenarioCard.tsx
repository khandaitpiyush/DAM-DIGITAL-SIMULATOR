import React from 'react';
import {
  Play,
  Copy,
  Scale,
  Trash2,
  Edit,
  AlertTriangle,
  Waves,
  CloudRain,
  Sliders,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { Scenario } from '../../types/scenario';
import { StatusPill } from '../layout/StatusPill';

interface ScenarioCardProps {
  scenario: Scenario;
  onRun: (scenario: Scenario) => void;
  onDuplicate: (scenario: Scenario) => void;
  onCompare: (scenario: Scenario) => void;
  onDelete?: (scenarioId: string) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onRun,
  onDuplicate,
  onCompare,
  onDelete,
}) => {
  const isCustom = scenario.id.startsWith('scen-custom');

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg flex flex-col justify-between group hover:border-cyan-500/40 transition-all select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {scenario.code}
              </span>
              <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wide group-hover:text-cyan-300 transition-colors">
                {scenario.name}
              </h3>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              By {scenario.author} • {scenario.createdAt}
            </div>
          </div>

          <StatusPill status={scenario.riskLevel} size="sm" />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[36px]">
          {scenario.description}
        </p>

        {/* Technical Parameters Matrix */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 bg-[#0B0F17] p-3 rounded border border-slate-800/90">
          <div>
            <span className="text-slate-500 block text-[10px]">Reservoir Stage:</span>
            <span className="text-slate-200 font-semibold">
              {scenario.reservoir.waterLevelMeters}m ({scenario.reservoir.storagePercentage}%)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Precipitation:</span>
            <span className="text-cyan-300 font-semibold">
              {scenario.weather.rainfallNowMmHr} mm/hr ({scenario.weather.forecastDurationHrs}h)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Spillway Status:</span>
            <span className="text-slate-200 font-semibold">
              {scenario.gates.filter((g) => g.status === 'FAILED').length > 0
                ? 'Gate Jammed'
                : `${scenario.gates.filter((g) => g.openingPercentage > 0).length} Gates Discharging`}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Breach Breach:</span>
            <span
              className={`font-semibold ${
                scenario.breach.enabled ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {scenario.breach.enabled
                ? `${scenario.breach.widthMeters}m (${scenario.breach.failureMode})`
                : 'Intact (No Breach)'}
            </span>
          </div>
        </div>

        {/* Results Preview Banner */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] font-mono text-slate-400 mb-4">
          <span>Est. Flood Extent: <strong className="text-slate-200">{scenario.resultsPreview.floodedAreaKm2} km²</strong></span>
          <span>Arrival: <strong className="text-amber-400">{scenario.resultsPreview.floodArrivalMin}m</strong></span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onRun(scenario)}
          className="flex-1 py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>RUN SIMULATION</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(scenario)}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            title="Duplicate Scenario"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onCompare(scenario)}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800"
            title="Compare Scenario"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          {isCustom && onDelete && (
            <button
              onClick={() => onDelete(scenario.id)}
              className="p-1.5 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800"
              title="Delete Scenario"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
