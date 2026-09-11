import React, { useState } from 'react';
import {
  Bell,
  User,
  Shield,
  Clock,
  ChevronDown,
  Info,
  CheckCircle,
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { StatusPill } from './StatusPill';

interface TopbarProps {
  systemStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  onStatusChange: (status: 'NORMAL' | 'WARNING' | 'CRITICAL') => void;
  simulationRunning?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  systemStatus,
  onStatusChange,
  simulationRunning = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <header className="h-16 bg-[#0B0F17] border-b border-slate-800/80 px-6 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Dam Title & Critical Status Mode */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              KOYNA DAM
            </h1>
            <span className="text-xs text-slate-400 font-medium">|</span>
            <span className="text-xs font-medium text-slate-300">
              Simulation Control Center
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <span>Satara Dist, Maharashtra</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">Krishna Basin</span>
          </div>
        </div>

        {/* Prominent Demo/Simulation Data Integrity Watermark */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-300 font-mono text-xs">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold tracking-wider">DATA MODE: DEMO / SIMULATION</span>
          <span className="text-[10px] text-cyan-400/80 font-sans border-l border-cyan-800 pl-1.5">
            SIH26161
          </span>
        </div>
      </div>

      {/* Right: Telemetry Time, Status Selector, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Last updated timestamp */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded font-mono text-[11px] text-slate-400">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Last Telemetry Sync:</span>
          <span className="text-slate-200 font-semibold">11 Sep 2026 • 22:12 IST</span>
        </div>

        {/* Dynamic System Status Selector (NORMAL / WARNING / CRITICAL) */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <span className="text-[11px] text-slate-400 font-mono">EOC Alert:</span>
            <StatusPill status={systemStatus} size="sm" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showStatusDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-slate-700 rounded shadow-xl py-1 z-30 font-mono text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase text-slate-400 font-semibold border-b border-slate-800">
                Override EOC Alert Level
              </div>
              <button
                onClick={() => {
                  onStatusChange('NORMAL');
                  setShowStatusDropdown(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-emerald-400"
              >
                <span>● NORMAL (Stage Safe)</span>
                {systemStatus === 'NORMAL' && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  onStatusChange('WARNING');
                  setShowStatusDropdown(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-amber-400"
              >
                <span>● WARNING (Surge Watch)</span>
                {systemStatus === 'WARNING' && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  onStatusChange('CRITICAL');
                  setShowStatusDropdown(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-rose-400"
              >
                <span>● CRITICAL (Spillway/Breach)</span>
                {systemStatus === 'CRITICAL' && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors relative"
            title="EOC Bulletins & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl py-2 z-30">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-200">
                  EOC ALERTS & BULLETINS (3)
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">LIVE FEED</span>
              </div>
              <div className="divide-y divide-slate-800/60 text-xs">
                <div className="p-3 hover:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Inflow Surge Alert</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Mahabaleshwar catchment recorded 48 mm/hr. Estimated Koyna reservoir inflow rising toward 1,450 m³/s.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">12 mins ago • IMD Station</span>
                </div>
                <div className="p-3 hover:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Radial Gates 01 & 02 Operating</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Both spillway crest gates opened 20% (Discharge: 284 m³/s) to maintain flood storage cushion.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">28 mins ago • Dam Control Room</span>
                </div>
                <div className="p-3 hover:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Downstream Helwak Gauge Nominal</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Helwak river gauge at 4.82m (Warning level 5.50m). Drainage channels clear.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">45 mins ago • CWC Node 098</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-xs font-semibold">
              KH
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-medium text-slate-200">Chief Hydrologist</div>
              <div className="text-[10px] text-slate-400 font-mono">EOC Shift A • Satara</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl p-3 z-30 font-sans text-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                  KH
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Executive Engineer (Hydrology)</div>
                  <div className="text-[11px] text-cyan-400 font-mono">Maharashtra WRD / CWC</div>
                </div>
              </div>
              <div className="py-2.5 space-y-1.5 text-slate-400 text-[11px] font-mono">
                <div>Role: <span className="text-slate-200">Simulation Commander</span></div>
                <div>Session ID: <span className="text-slate-200">KYN-2026-EOC-994</span></div>
                <div>Clearance: <span className="text-emerald-400">Level 4 (Disaster Response)</span></div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Platform:</span>
                <span className="text-cyan-400 font-mono">SIH26161 Engine</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
