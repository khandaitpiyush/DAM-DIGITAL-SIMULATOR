import React, { useState } from 'react';
import { ParameterPanel } from '../components/simulation/ParameterPanel';
import { KoynaDigitalTwin } from '../components/simulation/KoynaDigitalTwin';
import { ResultsPanel } from '../components/simulation/ResultsPanel';
import { TimelineControl } from '../components/simulation/TimelineControl';
import { SimulationWorkflowModal } from '../components/simulation/SimulationWorkflowModal';
import { ScenarioCompareModal } from '../components/scenarios/ScenarioCompareModal';
import {
  BreachParameters,
  GateState,
  ReservoirConditions,
  SimulationMode,
  SimulationResults,
  SimulationStatus,
  TimelineStep,
  WeatherConditions,
  WorkflowStep,
} from '../types/simulation';
import { Scenario } from '../types/scenario';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { executeSimulationPipeline, WORKFLOW_STEPS } from '../services/simulationService';
import { Activity, ChevronDown, Layers, ShieldCheck } from 'lucide-react';

interface SimulationPageProps {
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
  gates: GateState[];
  breach: BreachParameters;
  results: SimulationResults | null;
  onUpdateReservoir: (partial: Partial<ReservoirConditions>) => void;
  onUpdateWeather: (partial: Partial<WeatherConditions>) => void;
  onUpdateGate: (gateId: number, opening: number) => void;
  onUpdateBreach: (partial: Partial<BreachParameters>) => void;
  onLoadScenario: (scenario: Scenario) => void;
  onSetResults: (results: SimulationResults) => void;
  allScenarios: Scenario[];
  isMaximized?: boolean;
  onToggleMaximize?: (maximized: boolean) => void;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({
  reservoir,
  weather,
  gates,
  breach,
  results,
  onUpdateReservoir,
  onUpdateWeather,
  onUpdateGate,
  onUpdateBreach,
  onLoadScenario,
  onSetResults,
  allScenarios,
  isMaximized = false,
  onToggleMaximize,
}) => {
  const [currentScenarioName, setCurrentScenarioName] = useState<string>('PARTIAL BREACH');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('PARTIAL_BREACH');
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('READY');
  const [currentTimeline, setCurrentTimeline] = useState<TimelineStep>('T+00');

  // 9-step simulation workflow modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(
    WORKFLOW_STEPS.map((s) => ({ ...s, status: 'pending' }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Compare Modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Handle Scenario Mode selection from header tabs
  const handleSelectMode = (mode: SimulationMode) => {
    setSimulationMode(mode);

    let match: Scenario | undefined;
    if (mode === 'NORMAL_RELEASE') match = allScenarios.find((s) => s.id === 'scen-normal-monsoon');
    else if (mode === 'HEAVY_RAINFALL') match = allScenarios.find((s) => s.id === 'scen-heavy-rainfall');
    else if (mode === 'GATE_FAILURE') match = allScenarios.find((s) => s.id === 'scen-gate-failure');
    else if (mode === 'PARTIAL_BREACH') match = allScenarios.find((s) => s.id === 'scen-partial-breach');
    else if (mode === 'FULL_DAM_BREAK') match = allScenarios.find((s) => s.id === 'scen-full-dam-break');

    if (match) {
      setCurrentScenarioName(match.name);
      onLoadScenario(match);
    } else {
      setCurrentScenarioName('CUSTOM SCENARIO');
    }
  };

  // Run Simulation Handler
  const handleRunSimulation = async () => {
    setSimulationStatus('RUNNING');
    setIsModalOpen(true);
    setCurrentStepIndex(0);

    await executeSimulationPipeline(
      (stepIdx, updatedStep) => {
        setCurrentStepIndex(stepIdx);
        setWorkflowSteps((prev) => {
          const next = [...prev];
          next[stepIdx] = updatedStep;
          return next;
        });
      },
      (newResults) => {
        onSetResults(newResults);
        setSimulationStatus('COMPLETED');
      },
      { reservoir, weather, gates, breach }
    );
  };

  const handleReset = () => {
    handleSelectMode('NORMAL_RELEASE');
    setCurrentTimeline('T+00');
    setSimulationStatus('READY');
  };

  const currentScenarioObj =
    allScenarios.find((s) => s.name === currentScenarioName) || allScenarios[0];

  return (
    <div
      className={`select-none w-full h-full flex flex-col ${
        isMaximized
          ? 'p-0 m-0 overflow-hidden bg-[#070B12]'
          : 'p-4 lg:p-6 space-y-4 max-w-[1720px] mx-auto h-[calc(100vh-4rem)]'
      }`}
    >
      {/* Header & Scenario Mode Selector (Hidden when maximized) */}
      {!isMaximized && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0F172A] border border-slate-800 p-3.5 rounded-lg shadow shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
                SIMULATION CONTROL CENTER
              </h2>
              <span className="text-slate-600 font-mono">|</span>
              <span className="text-xs text-slate-300 font-medium">
                Configure conditions, run a flood scenario and analyse downstream impact.
              </span>
            </div>
          </div>

          {/* Mode Selector Radio Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 font-mono text-[11px]">
            <span className="text-slate-500 mr-1 text-[10px] uppercase font-bold">Scenario:</span>
            {[
              { id: 'NORMAL_RELEASE', label: 'Normal Release' },
              { id: 'HEAVY_RAINFALL', label: 'Heavy Rainfall' },
              { id: 'GATE_FAILURE', label: 'Gate Failure' },
              { id: 'PARTIAL_BREACH', label: 'Partial Breach' },
              { id: 'FULL_DAM_BREAK', label: 'Full Dam Break' },
              { id: 'CUSTOM', label: 'Custom' },
            ].map((modeItem) => {
              const isSelected = simulationMode === modeItem.id;
              return (
                <button
                  key={modeItem.id}
                  onClick={() => handleSelectMode(modeItem.id as SimulationMode)}
                  className={`px-2.5 py-1 rounded transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-sm shadow-cyan-950'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? '● ' : '○ '}
                  {modeItem.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div
        className={`flex-1 min-h-0 overflow-hidden ${
          isMaximized ? 'w-full h-full flex flex-col' : 'flex flex-col md:flex-row gap-4'
        }`}
      >
        {/* Left: Parameter Panel (Hidden when maximized) */}
        {!isMaximized && (
          <ParameterPanel
            reservoir={reservoir}
            weather={weather}
            gates={gates}
            breach={breach}
            simulationStatus={simulationStatus}
            onUpdateReservoir={onUpdateReservoir}
            onUpdateWeather={onUpdateWeather}
            onUpdateGate={onUpdateGate}
            onUpdateBreach={onUpdateBreach}
            onRunSimulation={handleRunSimulation}
            onReset={handleReset}
            onSaveScenario={() => alert('Current scenario parameters saved to custom presets.')}
            onCompareScenario={() => setIsCompareOpen(true)}
          />
        )}

        {/* Center: Large Koyna Digital Twin Viewport (Takes 100% when maximized!) */}
        <div className={`h-full ${isMaximized ? 'w-full flex-1' : 'flex-1 min-h-[440px] flex flex-col'}`}>
          <KoynaDigitalTwin
            currentScenario={currentScenarioName}
            simulationMode={simulationMode}
            simulationStatus={simulationStatus}
            currentTimeline={currentTimeline}
            results={results}
            reservoir={reservoir}
            weather={weather}
            gates={gates}
            breach={breach}
            onUpdateReservoir={onUpdateReservoir}
            onUpdateWeather={onUpdateWeather}
            onUpdateGate={onUpdateGate}
            onUpdateBreach={onUpdateBreach}
            onRunSimulation={handleRunSimulation}
            isMaximized={isMaximized}
            onToggleMaximize={onToggleMaximize}
          />
        </div>

        {/* Right: Results / Live Metrics Panel (Hidden when maximized) */}
        {!isMaximized && (
          <ResultsPanel results={results} scenarioName={currentScenarioName} />
        )}
      </div>

      {/* Bottom Timeline Control (Hidden when maximized) */}
      {!isMaximized && (
        <div className="shrink-0">
          <TimelineControl
            currentStep={currentTimeline}
            onStepChange={(step) => setCurrentTimeline(step)}
          />
        </div>
      )}

      {/* 9-Step Simulation Workflow Modal */}
      <SimulationWorkflowModal
        isOpen={isModalOpen}
        steps={workflowSteps}
        currentStepIndex={currentStepIndex}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Compare Modal */}
      <ScenarioCompareModal
        isOpen={isCompareOpen}
        baseScenario={currentScenarioObj}
        allScenarios={allScenarios}
        onClose={() => setIsCompareOpen(false)}
        onRunSelected={(scen) => {
          onLoadScenario(scen);
          setCurrentScenarioName(scen.name);
        }}
      />
    </div>
  );
};
