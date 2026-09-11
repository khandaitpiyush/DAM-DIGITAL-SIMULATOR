import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TIME_SERIES_MOCK } from '../../data/mockData';
import { Info, TrendingUp } from 'lucide-react';

export const ReservoirChart: React.FC = () => {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
              INFLOW VS OUTFLOW HYDROGRAPH & WATER ELEVATION
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            24-Hour Catchment Routing & Flood Attenuation Simulation Curve
          </p>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-2 py-1 rounded flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>SIMULATED HYDROGRAPH</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TIME_SERIES_MOCK} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" m³/s" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="inflowM3s"
              name="Inflow (m³/s)"
              stroke="#06B6D4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInflow)"
            />
            <Area
              type="monotone"
              dataKey="outflowM3s"
              name="Outflow (m³/s)"
              stroke="#38BDF8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutflow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
