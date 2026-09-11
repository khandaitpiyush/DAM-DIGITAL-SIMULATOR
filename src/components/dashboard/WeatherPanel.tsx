import React from 'react';
import { CloudRain, Wind, Droplets, Info, Compass } from 'lucide-react';
import { WeatherConditions } from '../../types/simulation';

interface WeatherPanelProps {
  weather: WeatherConditions;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather }) => {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              CATCHMENT HYDRO-METEOROLOGY
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Mahabaleshwar & Koyna Ghats High-Intensity Rainfall Telemetry
          </p>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-2 py-1 rounded flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>SIMULATION DATA</span>
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Rainfall Now</div>
          <div className="text-xl font-bold text-cyan-300">{weather.rainfallNowMmHr} <span className="text-xs text-slate-400">mm/hr</span></div>
          <div className="text-[10px] text-amber-400 mt-1">Convective Cell</div>
        </div>

        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Last 1 Hour</div>
          <div className="text-xl font-bold text-slate-200">{weather.last1HrMm} <span className="text-xs text-slate-400">mm</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Catchment Avg</div>
        </div>

        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Last 6 Hours</div>
          <div className="text-xl font-bold text-slate-200">{weather.last6HrsMm} <span className="text-xs text-slate-400">mm</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Accumulated Infiltration</div>
        </div>

        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Last 24 Hours</div>
          <div className="text-xl font-bold text-amber-300">{weather.last24HrsMm} <span className="text-xs text-slate-400">mm</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Saturated Catchment</div>
        </div>

        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Forecast Peak</div>
          <div className="text-xl font-bold text-cyan-300">{weather.forecastRainfallMmHr} <span className="text-xs text-slate-400">mm/hr</span></div>
          <div className="text-[10px] text-rose-400 mt-1">IMD Heavy Warning</div>
        </div>

        <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase mb-0.5">Forecast Duration</div>
          <div className="text-xl font-bold text-slate-200">{weather.forecastDurationHrs} <span className="text-xs text-slate-400">hrs</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Monsoon Depressional Axis</div>
        </div>
      </div>
    </div>
  );
};
