export type GateStatus = 'CLOSED' | 'PARTIALLY_OPEN' | 'OPEN' | 'FAILED';

export interface GateState {
  id: number;
  label: string;
  openingPercentage: number; // 0 to 100
  status: GateStatus;
  flowDischargeM3s: number;
}

export interface ReservoirConditions {
  waterLevelMeters: number; // e.g. 659.0
  storageMCM: number;       // Million Cubic Meters (~2490)
  storagePercentage: number;// e.g. 89%
  inflowM3s: number;        // Inflow in m³/s
  outflowM3s: number;       // Outflow in m³/s
  trend: 'RISING' | 'STABLE' | 'FALLING';
}

export interface WeatherConditions {
  rainfallNowMmHr: number;
  last1HrMm: number;
  last6HrsMm: number;
  last24HrsMm: number;
  forecastRainfallMmHr: number;
  forecastDurationHrs: number;
  upstreamInflowM3s: number;
}

export interface BreachParameters {
  enabled: boolean;
  widthMeters: number;
  depthMeters: number;
  developmentTimeMin: number;
  failureMode: 'OVERTOPPING' | 'PIPING' | 'STRUCTURAL_CRACK';
}

export type SimulationMode =
  | 'NORMAL_RELEASE'
  | 'HEAVY_RAINFALL'
  | 'GATE_FAILURE'
  | 'PARTIAL_BREACH'
  | 'FULL_DAM_BREAK'
  | 'CUSTOM';

export type SimulationStatus = 'READY' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface SimulationResults {
  floodedAreaKm2: number;
  maxDepthMeters: number;
  maxVelocityMs: number;
  floodArrivalMin: number;
  buildingsAffected: number;
  roadsAffectedKm: number;
  populationAtRisk: number;
  criticalLocations: number;
  riskLevel: RiskLevel;
}

export type TimelineStep = 'T+00' | 'T+30 MIN' | 'T+1 HR' | 'T+3 HR' | 'T+6 HR' | 'T+12 HR' | 'T+24 HR';

export interface WorkflowStep {
  id: number;
  code: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}
