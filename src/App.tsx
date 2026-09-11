import React, { useState } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { SimulationPage } from './pages/SimulationPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { FloodImpactPage } from './pages/FloodImpactPage';
import { LiveDataPage } from './pages/LiveDataPage';
import { GISMapPage } from './pages/GISMapPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  BreachParameters,
  GateState,
  ReservoirConditions,
  SimulationResults,
  WeatherConditions,
} from './types/simulation';
import { Scenario } from './types/scenario';
import { INITIAL_GATES, INITIAL_RESERVOIR, INITIAL_WEATHER } from './data/mockData';
import { PRESET_SCENARIOS } from './data/presetScenarios';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [systemStatus, setSystemStatus] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('NORMAL');
  const [isDigitalTwinMaximized, setIsDigitalTwinMaximized] = useState(false);

  // Shared Centralized State
  const [reservoir, setReservoir] = useState<ReservoirConditions>(INITIAL_RESERVOIR);
  const [weather, setWeather] = useState<WeatherConditions>(INITIAL_WEATHER);
  const [gates, setGates] = useState<GateState[]>(INITIAL_GATES);
  const [breach, setBreach] = useState<BreachParameters>({
    enabled: false,
    widthMeters: 30,
    depthMeters: 18,
    developmentTimeMin: 45,
    failureMode: 'PIPING',
  });
  const [results, setResults] = useState<SimulationResults | null>(PRESET_SCENARIOS[3].resultsPreview);
  const [scenarios, setScenarios] = useState<Scenario[]>(PRESET_SCENARIOS);

  // Gate change handler
  const handleGateChange = (gateId: number, opening: number) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === gateId) {
          let status = g.status;
          if (status !== 'FAILED') {
            status = opening === 0 ? 'CLOSED' : opening === 100 ? 'OPEN' : 'PARTIALLY_OPEN';
          }
          return {
            ...g,
            openingPercentage: opening,
            status,
            flowDischargeM3s: Math.round((opening / 100) * 500),
          };
        }
        return g;
      })
    );
  };

  // Gate presets
  const handleSetGatePreset = (preset: 'ROUTINE' | 'ALL_CLOSED' | 'HIGH_FLOOD') => {
    if (preset === 'ROUTINE') {
      setGates(INITIAL_GATES);
    } else if (preset === 'ALL_CLOSED') {
      setGates((prev) =>
        prev.map((g) => ({
          ...g,
          openingPercentage: 0,
          status: g.status === 'FAILED' ? 'FAILED' : 'CLOSED',
          flowDischargeM3s: 0,
        }))
      );
    } else if (preset === 'HIGH_FLOOD') {
      setGates((prev) =>
        prev.map((g) => ({
          ...g,
          openingPercentage: 65,
          status: g.status === 'FAILED' ? 'FAILED' : 'OPEN',
          flowDischargeM3s: 325,
        }))
      );
    }
  };

  // Load Scenario from Scenarios page or presets
  const handleRunScenario = (scenario: Scenario) => {
    setReservoir(scenario.reservoir);
    setWeather(scenario.weather);
    setGates(scenario.gates);
    setBreach(scenario.breach);
    setResults(scenario.resultsPreview);
    setSystemStatus(scenario.riskLevel === 'CRITICAL' ? 'CRITICAL' : scenario.riskLevel === 'HIGH' ? 'WARNING' : 'NORMAL');
    setCurrentPage('simulation');
  };

  const handleAddScenario = (newScen: Scenario) => {
    setScenarios((prev) => [newScen, ...prev]);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 font-sans">
      {/* Desktop Persistent Sidebar (Hidden if 3D Digital Twin is Maximized) */}
      {!isDigitalTwinMaximized && (
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
          systemHealth={systemStatus}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header (Hidden if 3D Digital Twin is Maximized) */}
        {!isDigitalTwinMaximized && (
          <Topbar
            systemStatus={systemStatus}
            onStatusChange={(newStatus) => setSystemStatus(newStatus)}
          />
        )}

        {/* Scrollable Page Body */}
        <main className={`flex-1 ${isDigitalTwinMaximized ? 'overflow-hidden p-0 m-0' : 'overflow-y-auto bg-[#090D14]'}`}>
          {currentPage === 'dashboard' && (
            <DashboardPage
              reservoir={reservoir}
              weather={weather}
              gates={gates}
              systemStatus={systemStatus}
              onGateChange={handleGateChange}
              onSetGatePreset={handleSetGatePreset}
              onNavigateToSimulation={() => setCurrentPage('simulation')}
            />
          )}

          {currentPage === 'simulation' && (
            <SimulationPage
              reservoir={reservoir}
              weather={weather}
              gates={gates}
              breach={breach}
              results={results}
              onUpdateReservoir={(p) => setReservoir((prev) => ({ ...prev, ...p }))}
              onUpdateWeather={(p) => setWeather((prev) => ({ ...prev, ...p }))}
              onUpdateGate={handleGateChange}
              onUpdateBreach={(p) => setBreach((prev) => ({ ...prev, ...p }))}
              onLoadScenario={handleRunScenario}
              onSetResults={(r) => setResults(r)}
              allScenarios={scenarios}
              isMaximized={isDigitalTwinMaximized}
              onToggleMaximize={(maximized) => setIsDigitalTwinMaximized(maximized)}
            />
          )}

          {currentPage === 'scenarios' && (
            <ScenariosPage
              scenarios={scenarios}
              onRunScenario={handleRunScenario}
              onAddScenario={handleAddScenario}
              onDeleteScenario={handleDeleteScenario}
            />
          )}

          {currentPage === 'impact' && <FloodImpactPage />}

          {currentPage === 'livedata' && <LiveDataPage />}

          {currentPage === 'gis' && <GISMapPage />}

          {currentPage === 'reports' && <ReportsPage />}

          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
