import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Shield,
  Clock,
  Waves,
} from 'lucide-react';
import { Scenario } from '../../types/scenario';
import { PRESET_SCENARIOS } from '../../data/presetScenarios';
import { KOYNA_CONFIG, DOWNSTREAM_SETTLEMENTS } from '../../data/mockData';
import { generateGeoJSON, generateKML, downloadFile } from '../../services/dataService';
import { StatusPill } from '../layout/StatusPill';

export const ReportGenerator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(PRESET_SCENARIOS[3]); // Partial breach default
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExportGeoJSON = () => {
    setIsExporting('GEOJSON');
    const jsonStr = generateGeoJSON(selectedScenario.name, selectedScenario.resultsPreview);
    downloadFile(jsonStr, `KOYNA_FLOODSIM_${selectedScenario.code}.geojson`, 'application/geo+json');
    setTimeout(() => setIsExporting(null), 1000);
  };

  const handleExportKML = () => {
    setIsExporting('KML');
    const kmlStr = generateKML(selectedScenario.name, selectedScenario.resultsPreview);
    downloadFile(kmlStr, `KOYNA_FLOODSIM_${selectedScenario.code}.kml`, 'application/vnd.google-earth.kml+xml');
    setTimeout(() => setIsExporting(null), 1000);
  };

  const handleExportSHP = () => {
    setIsExporting('SHP');
    setTimeout(() => {
      alert('Shapefile bundle (SHP, SHX, DBF, PRJ) queued for PostGIS packaging.');
      setIsExporting(null);
    }, 600);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 select-none max-w-5xl mx-auto">
      {/* Action Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold text-slate-100 tracking-wider uppercase">
                EMERGENCY FLOOD SIMULATION REPORTING
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Standard NDMA / CWC Disaster Preparedness Assessment Protocol
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Selector & Export Triggers */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <select
            value={selectedScenario.id}
            onChange={(e) => {
              const found = PRESET_SCENARIOS.find((s) => s.id === e.target.value);
              if (found) setSelectedScenario(found);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {PRESET_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintPDF}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT PDF</span>
          </button>

          <button
            onClick={handleExportGeoJSON}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT GEOJSON</span>
          </button>

          <button
            onClick={handleExportKML}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>EXPORT KML</span>
          </button>

          <button
            onClick={handleExportSHP}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>EXPORT SHP</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Report Document */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-8 shadow-2xl space-y-6 text-slate-200 font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
              GOVERNMENT OF MAHARASHTRA • WATER RESOURCES DEPARTMENT
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-wide uppercase">
              KOYNA DAM FLOOD SIMULATION & INUNDATION REPORT
            </h1>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Doc Ref: KYN-NDMA-{selectedScenario.code}-2026 • Published: 11 Sep 2026 22:15 IST
            </div>
          </div>

          <div className="text-right">
            <StatusPill status={selectedScenario.riskLevel} size="lg" />
            <div className="text-[10px] font-mono text-cyan-400 mt-1">
              EOC DISASTER PLANNING SPECIFICATION
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" />
            1. EXECUTIVE SUMMARY & SIMULATION OBJECTIVES
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0B0F17] p-4 rounded border border-slate-800">
            This hydrodynamic impact report summarizes downstream flood inundation for the Koyna River corridor under scenario <strong>{selectedScenario.name}</strong> ({selectedScenario.code}). The scenario evaluates maximum surface flood propagation from Koyna Dam Axis (km 0.0) downstream through Helwak, Patan, Karad, and Sangli reach. Based on simulated parameters, a total flood envelope of <strong>{selectedScenario.resultsPreview.floodedAreaKm2} km²</strong> is projected with a peak water depth of <strong>{selectedScenario.resultsPreview.maxDepthMeters} m</strong>.
          </p>
        </div>

        {/* 2. Scenario & Dam Configuration Matrix */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Waves className="w-4 h-4" />
            2. RESERVOIR & METEOROLOGICAL BOUNDARY CONDITIONS
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Reservoir Stage</span>
              <strong className="text-slate-100">{selectedScenario.reservoir.waterLevelMeters} m MSL</strong>
              <div className="text-[10px] text-slate-400">({selectedScenario.reservoir.storagePercentage}% of FRL)</div>
            </div>

            <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Storage Volume</span>
              <strong className="text-slate-100">{selectedScenario.reservoir.storageMCM} Mm³</strong>
              <div className="text-[10px] text-slate-400">TMC Equivalent: ~93.8</div>
            </div>

            <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Rainfall Forcing</span>
              <strong className="text-cyan-300">{selectedScenario.weather.rainfallNowMmHr} mm/hr</strong>
              <div className="text-[10px] text-slate-400">Duration: {selectedScenario.weather.forecastDurationHrs} hrs</div>
            </div>

            <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Peak Inflow</span>
              <strong className="text-slate-100">{selectedScenario.reservoir.inflowM3s} m³/s</strong>
              <div className="text-[10px] text-slate-400">Tributary Surge Included</div>
            </div>
          </div>
        </div>

        {/* 3. Spillway & Breach Parameters */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
            3. SPILLWAY OPERATION & BREACH DYNAMICS
          </h3>

          <div className="bg-[#0B0F17] p-4 rounded border border-slate-800 font-mono text-xs grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block text-[10px]">Crest Spillway Gates:</span>
              <span className="text-slate-200">
                {selectedScenario.gates.filter((g) => g.openingPercentage > 0).length} of 6 Open
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Breach Mechanism:</span>
              <span className={selectedScenario.breach.enabled ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {selectedScenario.breach.enabled ? `ENABLED (${selectedScenario.breach.failureMode})` : 'DISABLED (Intact)'}
              </span>
            </div>
            {selectedScenario.breach.enabled && (
              <>
                <div>
                  <span className="text-slate-500 block text-[10px]">Breach Width:</span>
                  <span className="text-rose-300 font-bold">{selectedScenario.breach.widthMeters} meters</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Breach Depth:</span>
                  <span className="text-rose-300 font-bold">{selectedScenario.breach.depthMeters} meters</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Formation Time:</span>
                  <span className="text-amber-300 font-bold">{selectedScenario.breach.developmentTimeMin} minutes</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. Downstream Inundation & Casualties Assessment */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
            4. DOWNSTREAM SETTLEMENT RISK & ARRIVAL TIMELINES
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-slate-800">
              <thead className="bg-[#0B0F17] border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2.5">Settlement Reach</th>
                  <th className="p-2.5">Dist.</th>
                  <th className="p-2.5">Est. Arrival</th>
                  <th className="p-2.5">Peak Depth</th>
                  <th className="p-2.5">Pop. at Risk</th>
                  <th className="p-2.5">Action Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {DOWNSTREAM_SETTLEMENTS.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-bold text-slate-200">{s.name}</td>
                    <td className="p-2.5 text-slate-400">{s.distanceKm} km</td>
                    <td className="p-2.5 text-amber-400 font-bold">{s.estimatedArrivalMin} min</td>
                    <td className="p-2.5 text-rose-300 font-bold">{s.projectedMaxDepthM} m</td>
                    <td className="p-2.5 text-slate-200 font-bold">{s.populationAtRisk.toLocaleString()}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {s.evacuationPriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Sign-off Footer */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
          <div>
            Generated by: <span className="text-slate-300">KOYNA FLOODSIM AI Suite (SIH26161)</span>
          </div>
          <div>
            Approved by: <span className="text-slate-300">EOC Operations Commander</span>
          </div>
        </div>
      </div>
    </div>
  );
};
