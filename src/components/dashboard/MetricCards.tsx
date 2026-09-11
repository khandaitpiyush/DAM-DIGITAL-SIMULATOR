import React from 'react';
import {
  Waves,
  Database,
  ArrowDownLeft,
  ArrowUpRight,
  CloudRain,
  TrendingUp,
  Info,
} from 'lucide-react';
import { ReservoirConditions, WeatherConditions } from '../../types/simulation';

interface MetricCardsProps {
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ reservoir, weather }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {/* 1. RESERVOIR LEVEL */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            RESERVOIR LEVEL
          </span>
          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded border border-cyan-800/40">
            DEMO
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-300">
          {reservoir.storagePercentage}%
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>{reservoir.waterLevelMeters.toFixed(1)} m</span>
          <span className="text-slate-500">FRL 659.4m</span>
        </div>
      </div>

      {/* 2. STORAGE */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            STORAGE
          </span>
          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded border border-cyan-800/40">
            SIMULATION
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">
          {reservoir.storageMCM.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>Mm³ (Million m³)</span>
          <span className="text-slate-500">Cap 2,797</span>
        </div>
      </div>

      {/* 3. INFLOW */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
            INFLOW
          </span>
          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded border border-cyan-800/40">
            SIMULATION
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-300">
          {reservoir.inflowM3s.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1">
          m³/s (Cumecs)
        </div>
      </div>

      {/* 4. OUTFLOW */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            OUTFLOW
          </span>
          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded border border-cyan-800/40">
            SIMULATION
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">
          {reservoir.outflowM3s.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1">
          m³/s (Spillway + Power)
        </div>
      </div>

      {/* 5. RAINFALL */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            RAINFALL
          </span>
          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded border border-cyan-800/40">
            SIMULATION
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-300">
          {weather.rainfallNowMmHr}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>mm/hr</span>
          <span className="text-amber-400">Intense</span>
        </div>
      </div>

      {/* 6. TREND */}
      <div className="bg-[#0F172A] p-3.5 rounded-lg border border-slate-800 shadow relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            TREND
          </span>
          <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1 rounded border border-amber-800/40">
            ACTIVE
          </span>
        </div>
        <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1">
          <span>↑ RISING</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1">
          +0.12 m/hr Stage Rate
        </div>
      </div>
    </div>
  );
};
