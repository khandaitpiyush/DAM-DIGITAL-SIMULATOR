import React, { useState } from 'react';
import { X, Plus, Sliders, Shield } from 'lucide-react';
import { Scenario } from '../../types/scenario';
import { INITIAL_GATES, INITIAL_RESERVOIR, INITIAL_WEATHER } from '../../data/mockData';

interface NewScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newScenario: Scenario) => void;
}

export const NewScenarioModal: React.FC<NewScenarioModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [waterLevel, setWaterLevel] = useState(656.8);
  const [rainfall, setRainfall] = useState(45);
  const [duration, setDuration] = useState(12);
  const [enableBreach, setEnableBreach] = useState(false);
  const [breachWidth, setBreachWidth] = useState(40);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const storagePct = Math.min(100, Math.round(((waterLevel - 609.6) / (659.43 - 609.6)) * 100));

    const newScen: Scenario = {
      id: `scen-custom-${Date.now()}`,
      code: `CS-${Math.floor(100 + Math.random() * 900)}`,
      name: name.toUpperCase(),
      description: description || 'Operator-defined custom hydrological test scenario.',
      riskLevel: enableBreach ? 'CRITICAL' : rainfall > 40 ? 'HIGH' : 'MODERATE',
      createdAt: '11 Sep 2026',
      author: 'EOC Command Terminal',
      reservoir: {
        ...INITIAL_RESERVOIR,
        waterLevelMeters: waterLevel,
        storagePercentage: storagePct,
        storageMCM: Math.round((storagePct / 100) * 2797),
      },
      weather: {
        ...INITIAL_WEATHER,
        rainfallNowMmHr: rainfall,
        forecastDurationHrs: duration,
      },
      gates: INITIAL_GATES,
      breach: {
        enabled: enableBreach,
        widthMeters: breachWidth,
        depthMeters: 20,
        developmentTimeMin: 45,
        failureMode: 'OVERTOPPING',
      },
      resultsPreview: {
        floodedAreaKm2: enableBreach ? 84.2 : +(rainfall * 0.9 + 12).toFixed(1),
        maxDepthMeters: enableBreach ? 9.2 : 4.5,
        maxVelocityMs: enableBreach ? 6.1 : 3.2,
        floodArrivalMin: enableBreach ? 24 : 85,
        buildingsAffected: enableBreach ? 1650 : 380,
        roadsAffectedKm: enableBreach ? 58.0 : 18.2,
        populationAtRisk: enableBreach ? 52000 : 12400,
        criticalLocations: enableBreach ? 11 : 4,
        riskLevel: enableBreach ? 'CRITICAL' : 'HIGH',
      },
    };

    onCreate(newScen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#0B0F17] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              CREATE CUSTOM FLOOD SCENARIO
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Scenario Name</label>
            <input
              type="text"
              required
              placeholder="e.g. FLASH SURGE 2026 - TEST B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Scenario Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of initial conditions and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Initial Water Stage (m)</label>
              <input
                type="number"
                step="0.1"
                min="620"
                max="662"
                value={waterLevel}
                onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">FRL: 659.43m</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Rainfall Intensity (mm/hr)</label>
              <input
                type="number"
                min="0"
                max="150"
                value={rainfall}
                onChange={(e) => setRainfall(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Breach Toggle in Modal */}
          <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Include Dam Breach Mechanism</span>
              <input
                type="checkbox"
                checked={enableBreach}
                onChange={(e) => setEnableBreach(e.target.checked)}
                className="w-4 h-4 accent-rose-500 cursor-pointer"
              />
            </div>

            {enableBreach && (
              <div>
                <label className="block text-slate-400 mb-1">Breach Crest Width (meters)</label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={breachWidth}
                  onChange={(e) => setBreachWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-rose-900 rounded p-2 text-rose-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow"
            >
              SAVE & REGISTER SCENARIO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
