export type SensorStatus = 'LIVE' | 'DEMO' | 'SIMULATION' | 'DELAYED' | 'OFFLINE';

export interface TelemetrySource {
  id: string;
  source: string;
  category: 'RESERVOIR' | 'WEATHER' | 'RIVER_GAUGE' | 'SATELLITE' | 'DAM_METRICS';
  value: number | string;
  unit: string;
  status: SensorStatus;
  lastUpdated: string;
  stationName: string;
  normalRange: string;
  warningThreshold: number | string;
}

export interface DownstreamSettlement {
  id: string;
  name: string;
  distanceKm: number;
  estimatedArrivalMin: number;
  projectedMaxDepthM: number;
  populationAtRisk: number;
  evacuationPriority: 'IMMEDIATE' | 'HIGH' | 'MONITOR' | 'SAFE';
  status: 'ALERT' | 'EVACUATING' | 'SHELTERED' | 'STANDBY';
  criticalFacilities: {
    hospitals: number;
    schools: number;
    bridges: number;
    substations: number;
  };
}

export interface HydrologyTimeSeriesPoint {
  timeLabel: string;
  timeHours: number;
  depthMeters: number;
  inflowM3s: number;
  outflowM3s: number;
  reservoirLevelMeters: number;
  populationExposed: number;
}
