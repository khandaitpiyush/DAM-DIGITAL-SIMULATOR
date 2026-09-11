import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TIME_SERIES_MOCK } from '../../data/mockData';
import { TrendingUp, Users, Waves, Gauge } from 'lucide-react';

export const ImpactCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
      {/* 1. FLOOD DEPTH OVER TIME */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <h4 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              FLOOD DEPTH VS TIME (HELWAK STATION)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Peak: 8.4m</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TIME_SERIES_MOCK} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="depthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="depthMeters"
                name="Flood Depth (m)"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#depthGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. INFLOW VS OUTFLOW HYDROGRAPH */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h4 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              INFLOW VS OUTFLOW (ROUTING HYDROGRAPH)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Peak Outflow: 3,600 m³/s</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TIME_SERIES_MOCK} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} unit="m³/s" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Line
                type="monotone"
                dataKey="inflowM3s"
                name="Catchment Inflow (m³/s)"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="outflowM3s"
                name="Dam Outflow (m³/s)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. POPULATION EXPOSURE OVER TIME */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <h4 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              CUMULATIVE POPULATION EXPOSURE (HEADCOUNT)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-rose-400">Max: 72,000</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TIME_SERIES_MOCK} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar
                dataKey="populationExposed"
                name="Population Exposed"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. RESERVOIR LEVEL OVER TIME */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-sky-400" />
            <h4 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              RESERVOIR WATER LEVEL ELEVATION (MSL)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-amber-300">FRL 659.43m</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TIME_SERIES_MOCK} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis
                domain={[655, 660]}
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                unit="m"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Line
                type="monotone"
                dataKey="reservoirLevelMeters"
                name="Water Level (m MSL)"
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
