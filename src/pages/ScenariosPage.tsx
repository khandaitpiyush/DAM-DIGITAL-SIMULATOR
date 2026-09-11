import React, { useState } from 'react';
import { Layers, Plus, Search, Filter } from 'lucide-react';
import { Scenario } from '../types/scenario';
import { ScenarioCard } from '../components/scenarios/ScenarioCard';
import { NewScenarioModal } from '../components/scenarios/NewScenarioModal';
import { ScenarioCompareModal } from '../components/scenarios/ScenarioCompareModal';

interface ScenariosPageProps {
  scenarios: Scenario[];
  onRunScenario: (scenario: Scenario) => void;
  onAddScenario: (scenario: Scenario) => void;
  onDeleteScenario: (scenarioId: string) => void;
}

export const ScenariosPage: React.FC<ScenariosPageProps> = ({
  scenarios,
  onRunScenario,
  onAddScenario,
  onDeleteScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [compareBase, setCompareBase] = useState<Scenario | null>(null);

  const handleDuplicate = (scenario: Scenario) => {
    const duplicated: Scenario = {
      ...scenario,
      id: `scen-custom-${Date.now()}`,
      code: `${scenario.code}-COPY`,
      name: `${scenario.name} (DUPLICATE)`,
      createdAt: '11 Sep 2026',
      author: 'Local Operator',
    };
    onAddScenario(duplicated);
  };

  const filteredScenarios = scenarios.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold text-slate-100 tracking-wider uppercase">
                SCENARIO CATALOG & DISASTER PLANNING
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Standard Inflow surges, Gate jams, and Dam breach failure modes
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ CREATE NEW SCENARIO</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0F172A] border border-slate-800 p-3 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scenario catalog by name, code or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-700 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Catalog:</span>
          <span className="text-cyan-400 font-bold">{filteredScenarios.length} Scenarios</span>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onRun={onRunScenario}
            onDuplicate={handleDuplicate}
            onCompare={(s) => setCompareBase(s)}
            onDelete={onDeleteScenario}
          />
        ))}
      </div>

      {/* New Scenario Modal */}
      <NewScenarioModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={(newScen) => onAddScenario(newScen)}
      />

      {/* Compare Modal */}
      {compareBase && (
        <ScenarioCompareModal
          isOpen={true}
          baseScenario={compareBase}
          allScenarios={scenarios}
          onClose={() => setCompareBase(null)}
          onRunSelected={(s) => {
            setCompareBase(null);
            onRunScenario(s);
          }}
        />
      )}
    </div>
  );
};
