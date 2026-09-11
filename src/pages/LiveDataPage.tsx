import React, { useState, useEffect } from 'react';
import {
  Radio,
  RefreshCw,
  Info,
  Server,
  AlertCircle,
  Database,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { TELEMETRY_FEED } from '../data/mockData';
import { TelemetrySource } from '../types/hydrology';
import { StatusPill } from '../components/layout/StatusPill';

export const LiveDataPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetrySource[]>(TELEMETRY_FEED);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('11 Sep 2026 • 22:12:45 IST');

  // Simulated live telemetry tick every 4 seconds
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setTelemetry((prev) =>
        prev.map((item) => {
          if (typeof item.value === 'number') {
            const jitter = (Math.random() - 0.5) * (item.value * 0.015);
            return {
              ...item,
              value: +(item.value + jitter).toFixed(2),
              lastUpdated: 'Just now • Auto Sync',
            };
          }
          return item;
        })
      );
      setLastSyncTime(`11 Sep 2026 • ${new Date().toLocaleTimeString('en-GB')} IST`);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold text-slate-100 tracking-wider uppercase">
                HYDROLOGICAL TELEMETRY & SENSOR INGESTION
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                CWC Gauging Nodes • IMD Weather Automated Stations • SCADA Sensors
              </div>
            </div>
          </div>
        </div>

        {/* Live Stream Simulator Switch */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded flex items-center gap-2 border transition-all ${
              isLiveStreaming
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>{isLiveStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}</span>
          </button>

          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400 text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync: {lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Prominent Data Integrity Notice Banner */}
      <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <div className="font-bold text-cyan-300 tracking-wide uppercase">
            DATA INTEGRITY DISCLAIMER — SYNTHETIC / DEMO SENSOR STREAM
          </div>
          <p className="text-slate-300 font-sans leading-relaxed">
            The readings below illustrate the data ingestion pipeline for Smart India Hackathon 2026 Problem Statement SIH26161. In the operational phase, these feeds will map directly to verified Central Water Commission (CWC) telemetry, India Meteorological Department (IMD) radar feeds, and Maharashtra Water Resources Department SCADA gateways.
          </p>
        </div>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Configured Stations</div>
          <div className="text-xl font-bold text-slate-100 mt-1">8 / 8 Active</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% Signal Quality</div>
        </div>

        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Average Ingestion Latency</div>
          <div className="text-xl font-bold text-cyan-300 mt-1">140 ms</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Edge Broker (MQTT)</div>
        </div>

        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Catchment Rainfall Peak</div>
          <div className="text-xl font-bold text-amber-300 mt-1">48.5 mm/hr</div>
          <div className="text-[10px] text-amber-400 mt-0.5">Station: Mahabaleshwar</div>
        </div>

        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Confluence Stage Status</div>
          <div className="text-xl font-bold text-slate-100 mt-1">7.15 m</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Karad Bridge Stn</div>
        </div>
      </div>

      {/* Main Telemetry Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            CONNECTED TELEMETRY SENSORS & GAUGING PLATFORMS
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            AUTO-REFRESH: 4s INTERVAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-3 font-semibold">Sensor ID & Station</th>
                <th className="pb-3 font-semibold">Source Description</th>
                <th className="pb-3 font-semibold">Telemetry Value</th>
                <th className="pb-3 font-semibold">Unit / Scale</th>
                <th className="pb-3 font-semibold">Normal Operating Range</th>
                <th className="pb-3 font-semibold">Feed Status</th>
                <th className="pb-3 font-semibold">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {telemetry.map((source) => (
                <tr key={source.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-slate-100">{source.stationName}</div>
                    <span className="text-[10px] text-slate-500">{source.id}</span>
                  </td>
                  <td className="py-3 text-slate-300 font-sans text-xs">
                    {source.source}
                  </td>
                  <td className="py-3 text-cyan-300 font-bold text-sm">
                    {source.value}
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {source.unit}
                  </td>
                  <td className="py-3 text-slate-500 text-[11px]">
                    {source.normalRange}
                  </td>
                  <td className="py-3">
                    <StatusPill status={source.status} size="sm" />
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {source.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
