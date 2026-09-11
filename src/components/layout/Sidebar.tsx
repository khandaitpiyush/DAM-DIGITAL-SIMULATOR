import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Layers,
  AlertTriangle,
  Radio,
  Map,
  FileText,
  Sliders,
  ShieldAlert,
  Server,
  Droplets,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'simulation'
  | 'scenarios'
  | 'impact'
  | 'livedata'
  | 'gis'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  systemHealth?: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'cyan' | 'amber' | 'emerald';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulation', label: 'Simulation', icon: Activity, badge: 'FLAGSHIP', badgeType: 'cyan' },
  { id: 'scenarios', label: 'Scenarios', icon: Layers, badge: '5 PRESETS', badgeType: 'emerald' },
  { id: 'impact', label: 'Flood Impact', icon: AlertTriangle },
  { id: 'livedata', label: 'Live Data', icon: Radio, badge: 'SYNTHETIC', badgeType: 'amber' },
  { id: 'gis', label: 'GIS / Map', icon: Map },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Sliders },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage, systemHealth = 'NORMAL' }) => {
  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Brand / Header */}
      <div>
        <div className="p-4 border-b border-slate-800/70 bg-[#0F172A]/50">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
              <Droplets className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 tracking-wider text-sm">KOYNA</span>
                <span className="text-cyan-400 font-mono font-semibold text-xs tracking-widest px-1 py-0.2 bg-cyan-950/70 rounded border border-cyan-500/30">
                  FLOODSIM
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
                Dam Break & Inundation Suite
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-slate-400">SIH 2026</span>
            <span className="text-cyan-400 font-medium bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              SIH26161
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            Command Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border-l-2 border-cyan-400 shadow-inner'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      item.badgeType === 'cyan'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                        : item.badgeType === 'emerald'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Diagnostic Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#090D14] space-y-2">
        <div className="bg-[#0F172A] p-2.5 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-mono">
              <Server className="w-3 h-3 text-slate-400" />
              System Status
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OPERATIONAL
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Hydro Engine:</span>
            <span className="text-cyan-400">READY (MOCK)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
            <span>3D Digital Twin:</span>
            <span className="text-amber-400">PORT STANDBY</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-400">
          <span>Koyna Dam Stage</span>
          <span className="text-slate-300 font-semibold">656.8m (89%)</span>
        </div>
      </div>
    </aside>
  );
};
