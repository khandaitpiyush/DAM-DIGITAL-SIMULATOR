import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Database,
  Map,
  Bell,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  Globe,
  Gauge,
} from 'lucide-react';
import { KOYNA_CONFIG } from '../../data/mockData';

export const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ENGINE' | 'DATA' | 'GIS' | 'THRESHOLDS' | 'ROLES'>('ENGINE');
  const [manningsN, setManningsN] = useState('0.035');
  const [timeStepDt, setTimeStepDt] = useState('0.5');
  const [gridResolution, setGridResolution] = useState('10m');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-mono text-lg font-bold text-slate-100 tracking-wider uppercase">
              PLATFORM SYSTEM CONFIGURATION
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Hydrodynamic Solver, Ingestion Gateways & Disaster Alert Calibration
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow"
        >
          <Save className="w-4 h-4" />
          <span>SAVE CONFIGURATION</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded flex items-center gap-2 text-emerald-300 font-mono text-xs animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>Configuration parameters persisted to local EOC profile cache.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('ENGINE')}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
            activeTab === 'ENGINE'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>SIMULATION ENGINE</span>
        </button>

        <button
          onClick={() => setActiveTab('DATA')}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
            activeTab === 'DATA'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>DATA SOURCES & SCADA</span>
        </button>

        <button
          onClick={() => setActiveTab('GIS')}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
            activeTab === 'GIS'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>GIS COORDINATE SYSTEM</span>
        </button>

        <button
          onClick={() => setActiveTab('THRESHOLDS')}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
            activeTab === 'THRESHOLDS'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>ALERT THRESHOLDS</span>
        </button>

        <button
          onClick={() => setActiveTab('ROLES')}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
            activeTab === 'ROLES'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>USERS & RBAC</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-6 shadow-xl text-xs font-mono">
        {/* 1. ENGINE */}
        {activeTab === 'ENGINE' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">HYDRODYNAMIC 2D SOLVER</h3>
                <p className="text-slate-400 font-sans mt-0.5">
                  Configure numerical stability criteria and hydrodynamic parameters for 2D Shallow Water Equations.
                </p>
              </div>
              <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-1 rounded border border-amber-800">
                ADVANCED / FUTURE ENGINE CONFIGURATION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Manning's Roughness Coefficient (n)</label>
                <input
                  type="text"
                  value={manningsN}
                  onChange={(e) => setManningsN(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Natural rocky riverbed with vegetation: 0.035 - 0.045</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Integration Time Step Δt (seconds)</label>
                <input
                  type="text"
                  value={timeStepDt}
                  onChange={(e) => setTimeStepDt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Courant-Friedrichs-Lewy (CFL) limit &le; 0.85</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mesh Grid Resolution</label>
                <select
                  value={gridResolution}
                  onChange={(e) => setGridResolution(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="5m">5m High Precision Mesh (Compute Intensive)</option>
                  <option value="10m">10m Operational Mesh (Standard Recommended)</option>
                  <option value="30m">30m Rapid Inundation Envelope (Fast Preview)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hydrodynamic Solver Core</label>
                <input
                  type="text"
                  disabled
                  value="Godunov-type Finite Volume Method (Roe / HLLC)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. DATA SOURCES */}
        {activeTab === 'DATA' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">REAL-TIME INGESTION GATEWAYS</h3>
              <p className="text-slate-400 font-sans mt-0.5">
                Centralized endpoint configurations for Central Water Commission, IMD, and WRD Maharashtra.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">CWC SCADA Telemetry API</div>
                  <div className="text-[10px] text-slate-500">Endpoint: https://api.cwc.gov.in/v2/telemetry/koyna</div>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800">
                  CONNECTED (MOCK)
                </span>
              </div>

              <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">IMD AWS Doppler Radar Stream</div>
                  <div className="text-[10px] text-slate-500">Radar Site: Mahabaleshwar C-Band Radar (Station 43111)</div>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800">
                  CONNECTED (MOCK)
                </span>
              </div>

              <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">ISRO MOSDAC Satellite Inundation Alert</div>
                  <div className="text-[10px] text-slate-500">Feed: INSAT-3DR Rapid Precipitation Products</div>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800">
                  CONNECTED (MOCK)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. GIS */}
        {activeTab === 'GIS' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">GIS SPATIAL CONFIGURATION</h3>
              <p className="text-slate-400 font-sans mt-0.5">
                Projections, DEM layers, and downstream administrative boundary overlays.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Spatial Coordinate Reference</label>
                <input
                  type="text"
                  disabled
                  value="EPSG:4326 (WGS 84) / EPSG:32643 (UTM 43N)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DEM Surface Elevation Source</label>
                <input
                  type="text"
                  disabled
                  value="Cartosat-1 10m DEM (Koyna Catchment Tile)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. THRESHOLDS */}
        {activeTab === 'THRESHOLDS' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">EOC ALERT STAGE THRESHOLDS</h3>
              <p className="text-slate-400 font-sans mt-0.5">
                Define automated alert trigger levels for reservoir stage and downstream river gauges.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Reservoir Warning Level (m)</label>
                <input
                  type="number"
                  defaultValue={657.5}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reservoir Danger Level (m)</label>
                <input
                  type="number"
                  defaultValue={659.43}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. ROLES */}
        {activeTab === 'ROLES' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">ROLE-BASED ACCESS CONTROL (RBAC)</h3>
              <p className="text-slate-400 font-sans mt-0.5">
                Disaster management privileges and simulation control rights.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Chief Hydrologist / Simulation Commander</div>
                  <div className="text-[10px] text-slate-500">Full control over simulations, breach triggers & reports</div>
                </div>
                <span className="text-emerald-400 font-bold">LEVEL 4 CLEARANCE</span>
              </div>

              <div className="p-3 bg-[#0B0F17] rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">District Disaster Management Officer (Satara)</div>
                  <div className="text-[10px] text-slate-500">Downstream evacuation views and hazard broadcast</div>
                </div>
                <span className="text-cyan-400 font-bold">LEVEL 3 CLEARANCE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
