import { GateState, ReservoirConditions, WeatherConditions } from '../types/simulation';
import { DownstreamSettlement, HydrologyTimeSeriesPoint, TelemetrySource } from '../types/hydrology';
import { GISLayer, GISLocationMarker } from '../types/gis';

/**
 * KOYNA FLOODSIM — CENTRALIZED DAM SPECIFICATIONS & MOCK DATA REGISTRY
 * 
 * DISCLAIMER:
 * Values below represent indicative baseline parameters for UI simulation workflows
 * in the Smart India Hackathon 2026 prototype (Problem Statement SIH26161).
 * They are clearly designated as SYNTHETIC / DEMO values and should NOT be treated
 * as certified ground-truth measurements until authenticated CWC/IMD API streams
 * are connected in subsequent operational phases.
 */

export const KOYNA_CONFIG = {
  damName: 'Koyna Hydroelectric Dam',
  basin: 'Krishna River Basin',
  river: 'Koyna River',
  location: 'Koynanagar, Satara District, Maharashtra, India',
  damType: 'Rubble-Concrete Gravity Dam',
  // Indicative values for calibration
  fullReservoirLevelMeters: 659.43,   // Indicative FRL (~2163.5 ft)
  maximumWaterLevelMeters: 662.00,    // High flood buffer
  deadStorageLevelMeters: 609.60,     // Indicative DSL
  totalStorageMCM: 2797,              // Gross storage (~105.25 TMC)
  crestLevelMeters: 649.20,
  spillwayGatesCount: 6,
  gateType: 'Radial Crest Gates (12.5m × 7.6m)',
  maximumDesignDischargeM3s: 5663,    // Spillway design flood
  dataModeLabel: 'DEMO / SIMULATION',
  systemVersion: 'v0.9.4-PROTOTYPE (SIH26161)',
};

export const INITIAL_GATES: GateState[] = [
  { id: 1, label: 'Gate 01', openingPercentage: 20, status: 'PARTIALLY_OPEN', flowDischargeM3s: 142 },
  { id: 2, label: 'Gate 02', openingPercentage: 20, status: 'PARTIALLY_OPEN', flowDischargeM3s: 142 },
  { id: 3, label: 'Gate 03', openingPercentage: 0, status: 'CLOSED', flowDischargeM3s: 0 },
  { id: 4, label: 'Gate 04', openingPercentage: 0, status: 'CLOSED', flowDischargeM3s: 0 },
  { id: 5, label: 'Gate 05', openingPercentage: 0, status: 'CLOSED', flowDischargeM3s: 0 },
  { id: 6, label: 'Gate 06', openingPercentage: 0, status: 'CLOSED', flowDischargeM3s: 0 },
];

export const INITIAL_RESERVOIR: ReservoirConditions = {
  waterLevelMeters: 656.80,
  storageMCM: 2489,
  storagePercentage: 89,
  inflowM3s: 1450,
  outflowM3s: 284,
  trend: 'RISING',
};

export const INITIAL_WEATHER: WeatherConditions = {
  rainfallNowMmHr: 42,
  last1HrMm: 38,
  last6HrsMm: 165,
  last24HrsMm: 320,
  forecastRainfallMmHr: 55,
  forecastDurationHrs: 18,
  upstreamInflowM3s: 1820,
};

export const TELEMETRY_FEED: TelemetrySource[] = [
  {
    id: 'src-01',
    source: 'Koyna Reservoir Stage Sensor (Radar #01)',
    category: 'RESERVOIR',
    value: 656.80,
    unit: 'm (MSL)',
    status: 'DEMO',
    lastUpdated: '11 Sep 2026 • 22:10 IST',
    stationName: 'Dam Crest Gauge Tower',
    normalRange: '610.00 – 659.43 m',
    warningThreshold: 657.50,
  },
  {
    id: 'src-02',
    source: 'Calculated Gross Storage Volume',
    category: 'RESERVOIR',
    value: 2489.3,
    unit: 'M.m³ (89.0%)',
    status: 'SIMULATION',
    lastUpdated: '11 Sep 2026 • 22:10 IST',
    stationName: 'Telemetry SCADA Node 02',
    normalRange: '500 – 2797 M.m³',
    warningThreshold: 2600.0,
  },
  {
    id: 'src-03',
    source: 'Upstream Catchment Inflow Compute',
    category: 'DAM_METRICS',
    value: 1450,
    unit: 'm³/s',
    status: 'SIMULATION',
    lastUpdated: '11 Sep 2026 • 22:12 IST',
    stationName: 'Koyna Basin Hydro-Matrix',
    normalRange: '100 – 2500 m³/s',
    warningThreshold: 2000,
  },
  {
    id: 'src-04',
    source: 'Total Spillway & Powerhouse Outflow',
    category: 'DAM_METRICS',
    value: 284,
    unit: 'm³/s',
    status: 'DEMO',
    lastUpdated: '11 Sep 2026 • 22:12 IST',
    stationName: 'Stilling Basin Doppler Sensor',
    normalRange: '0 – 5663 m³/s',
    warningThreshold: 1500,
  },
  {
    id: 'src-05',
    source: 'Mahabaleshwar High-Altitude Rain Gauge',
    category: 'WEATHER',
    value: 48.5,
    unit: 'mm/hr',
    status: 'DEMO',
    lastUpdated: '11 Sep 2026 • 22:05 IST',
    stationName: 'IMD Station 43111',
    normalRange: '0 – 30 mm/hr',
    warningThreshold: 35.0,
  },
  {
    id: 'src-06',
    source: 'Helwak Downstream River Gauge',
    category: 'RIVER_GAUGE',
    value: 4.82,
    unit: 'm River Stage',
    status: 'DEMO',
    lastUpdated: '11 Sep 2026 • 22:08 IST',
    stationName: 'CWC Gauge Stn 098',
    normalRange: '1.20 – 6.50 m',
    warningThreshold: 5.50,
  },
  {
    id: 'src-07',
    source: 'Karad Sangam Bridge Doppler Acoustic Gauge',
    category: 'RIVER_GAUGE',
    value: 7.15,
    unit: 'm River Stage',
    status: 'DEMO',
    lastUpdated: '11 Sep 2026 • 22:00 IST',
    stationName: 'Krishna-Koyna Confluence',
    normalRange: '2.00 – 11.00 m',
    warningThreshold: 9.80,
  },
  {
    id: 'src-08',
    source: 'ISRO MOSDAC Satellite Cloud Burst Detection',
    category: 'SATELLITE',
    value: 'Elevated Convective Band',
    unit: 'Radar Reflectivity 48 dBZ',
    status: 'SIMULATION',
    lastUpdated: '11 Sep 2026 • 21:55 IST',
    stationName: 'INSAT-3DR Rapid Scan',
    normalRange: 'Nominal',
    warningThreshold: 'Severe Reflectivity',
  },
];

export const DOWNSTREAM_SETTLEMENTS: DownstreamSettlement[] = [
  {
    id: 'set-01',
    name: 'Koynanagar Township',
    distanceKm: 2.8,
    estimatedArrivalMin: 18,
    projectedMaxDepthM: 7.8,
    populationAtRisk: 8400,
    evacuationPriority: 'IMMEDIATE',
    status: 'EVACUATING',
    criticalFacilities: { hospitals: 1, schools: 3, bridges: 1, substations: 2 },
  },
  {
    id: 'set-02',
    name: 'Helwak Village & Market',
    distanceKm: 7.4,
    estimatedArrivalMin: 38,
    projectedMaxDepthM: 6.4,
    populationAtRisk: 6200,
    evacuationPriority: 'IMMEDIATE',
    status: 'ALERT',
    criticalFacilities: { hospitals: 1, schools: 2, bridges: 1, substations: 1 },
  },
  {
    id: 'set-03',
    name: 'Patan Tehsil Center',
    distanceKm: 32.5,
    estimatedArrivalMin: 95,
    projectedMaxDepthM: 4.9,
    populationAtRisk: 14800,
    evacuationPriority: 'HIGH',
    status: 'ALERT',
    criticalFacilities: { hospitals: 3, schools: 7, bridges: 2, substations: 2 },
  },
  {
    id: 'set-04',
    name: 'Karad City (Krishna Confluence)',
    distanceKm: 68.0,
    estimatedArrivalMin: 195,
    projectedMaxDepthM: 3.8,
    populationAtRisk: 38500,
    evacuationPriority: 'HIGH',
    status: 'STANDBY',
    criticalFacilities: { hospitals: 6, schools: 16, bridges: 3, substations: 4 },
  },
  {
    id: 'set-05',
    name: 'Sangli Urban Flood Zone',
    distanceKm: 132.0,
    estimatedArrivalMin: 410,
    projectedMaxDepthM: 2.6,
    populationAtRisk: 62000,
    evacuationPriority: 'MONITOR',
    status: 'STANDBY',
    criticalFacilities: { hospitals: 12, schools: 34, bridges: 4, substations: 8 },
  },
];

export const TIME_SERIES_MOCK: HydrologyTimeSeriesPoint[] = [
  { timeLabel: 'T+00', timeHours: 0, depthMeters: 0.8, inflowM3s: 1450, outflowM3s: 284, reservoirLevelMeters: 656.80, populationExposed: 0 },
  { timeLabel: 'T+30m', timeHours: 0.5, depthMeters: 3.2, inflowM3s: 1620, outflowM3s: 720, reservoirLevelMeters: 657.10, populationExposed: 4200 },
  { timeLabel: 'T+1h', timeHours: 1.0, depthMeters: 5.6, inflowM3s: 1890, outflowM3s: 1450, reservoirLevelMeters: 657.50, populationExposed: 12500 },
  { timeLabel: 'T+3h', timeHours: 3.0, depthMeters: 7.9, inflowM3s: 2150, outflowM3s: 2800, reservoirLevelMeters: 658.20, populationExposed: 28400 },
  { timeLabel: 'T+6h', timeHours: 6.0, depthMeters: 8.4, inflowM3s: 2400, outflowM3s: 3600, reservoirLevelMeters: 658.85, populationExposed: 46200 },
  { timeLabel: 'T+12h', timeHours: 12.0, depthMeters: 6.9, inflowM3s: 1800, outflowM3s: 3100, reservoirLevelMeters: 658.10, populationExposed: 68000 },
  { timeLabel: 'T+24h', timeHours: 24.0, depthMeters: 4.1, inflowM3s: 1100, outflowM3s: 1800, reservoirLevelMeters: 656.90, populationExposed: 72000 },
];

export const GIS_LAYERS_CONFIG: GISLayer[] = [
  { id: 'layer-flood-extent', name: 'Flood Extent Inundation Boundary', category: 'HYDROLOGY', visible: true, opacity: 85, color: '#06B6D4', description: 'Maximum surface flood envelope' },
  { id: 'layer-flood-depth', name: 'Flood Depth Heatmap (0m - 10m+)', category: 'HYDROLOGY', visible: true, opacity: 75, color: '#0284C7', description: '2D grid cell depth gradients' },
  { id: 'layer-velocity', name: 'Flow Velocity Vectors', category: 'HYDROLOGY', visible: true, opacity: 60, color: '#38BDF8', description: 'Hydrodynamic flow direction & speed (m/s)' },
  { id: 'layer-roads', name: 'State Highways & Primary Roads', category: 'INFRASTRUCTURE', visible: true, opacity: 90, color: '#F59E0B', description: 'NH-4, SH-78 and access routes' },
  { id: 'layer-buildings', name: 'Building Footprints & Structures', category: 'INFRASTRUCTURE', visible: true, opacity: 70, color: '#94A3B8', description: 'OSM & district cadastral footprints' },
  { id: 'layer-villages', name: 'Villages & Gram Panchayat Wards', category: 'POPULATION', visible: true, opacity: 100, color: '#10B981', description: 'Settlement clusters & census wards' },
  { id: 'layer-population', name: 'Population Density Grids', category: 'POPULATION', visible: false, opacity: 50, color: '#EC4899', description: 'Census 2021 projected density' },
  { id: 'layer-critical-infra', name: 'Critical Infrastructure (Hospitals/Power)', category: 'INFRASTRUCTURE', visible: true, opacity: 100, color: '#EF4444', description: 'Substations, relief shelters, health centers' },
  { id: 'layer-river-network', name: 'Koyna & Krishna River Network', category: 'HYDROLOGY', visible: true, opacity: 100, color: '#60A5FA', description: 'Perennial river course & tributaries' },
  { id: 'layer-terrain', name: 'DEM Terrain Contours & Elevation', category: 'TERRAIN', visible: false, opacity: 40, color: '#64748B', description: '10m resolution digital elevation contours' },
];

export const GIS_MARKERS: GISLocationMarker[] = [
  { id: 'loc-01', name: 'Koyna Dam Axis & Spillway', type: 'DAM', lat: 17.3986, lng: 73.7492, elevationM: 659.4, depthEstM: 0, arrivalMin: 0, risk: 'SAFE' },
  { id: 'loc-02', name: 'Koynanagar Primary Health Center', type: 'HOSPITAL', lat: 17.3850, lng: 73.7680, elevationM: 592.0, depthEstM: 3.8, arrivalMin: 22, risk: 'CRITICAL' },
  { id: 'loc-03', name: 'Helwak High School Relief Camp', type: 'SHELTER', lat: 17.3710, lng: 73.8120, elevationM: 574.0, depthEstM: 1.2, arrivalMin: 45, risk: 'HIGH' },
  { id: 'loc-04', name: 'Patan Koyna Bridge (SH-78)', type: 'BRIDGE', lat: 17.3680, lng: 73.9010, elevationM: 546.0, depthEstM: 5.4, arrivalMin: 98, risk: 'CRITICAL' },
  { id: 'loc-05', name: 'Karad Krishna Confluence Bridge', type: 'BRIDGE', lat: 17.2885, lng: 74.1812, elevationM: 532.0, depthEstM: 4.1, arrivalMin: 198, risk: 'HIGH' },
  { id: 'loc-06', name: 'Patan Power Grid Substation 110kV', type: 'GAUGE', lat: 17.3720, lng: 73.8950, elevationM: 548.0, depthEstM: 2.8, arrivalMin: 105, risk: 'HIGH' },
];
