/**
 * KOYNA FLOODSIM — CENTRALIZED 3D DIGITAL TWIN & HYDROLOGICAL CONFIGURATION
 * 
 * SCIENTIFIC & ENGINEERING DISCLAIMER:
 * Values marked 'VERIFIED' are published dimensions from Maharashtra Water Resources Department / CWC records.
 * Values marked 'PROVISIONAL' represent uncalibrated geometric visualization parameters engineered for 
 * real-time WebGL/Three.js rendering in Phase 2.
 * They will be calibrated against high-resolution survey photogrammetry and 10m Cartosat DEM in Phase 3.
 */

export interface ParameterMetadata<T> {
  value: T;
  unit: string;
  classification: 'VERIFIED' | 'PROVISIONAL' | 'DEMO';
  source?: string;
  notes?: string;
}

export const KOYNA_DAM_CONFIG = {
  // Overall Dam Dimensions
  heightMeters: {
    value: 103.2,
    unit: 'm',
    classification: 'VERIFIED',
    source: 'CWC Dam Safety Register',
    notes: 'Max height above deepest foundation level'
  } as ParameterMetadata<number>,

  crestLengthMeters: {
    value: 807.2,
    unit: 'm',
    classification: 'VERIFIED',
    source: 'Maharashtra WRD',
    notes: 'Total length of concrete gravity dam crest'
  } as ParameterMetadata<number>,

  crestWidthMeters: {
    value: 14.8,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Roadway crest width including parapet walls'
  } as ParameterMetadata<number>,

  baseWidthMeters: {
    value: 70.2,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Base footing width at river bed'
  } as ParameterMetadata<number>,

  upstreamElevationDatumM: {
    value: 659.43,
    unit: 'm MSL',
    classification: 'VERIFIED',
    source: 'CWC FRL Standard',
    notes: 'Full Reservoir Level (FRL)'
  } as ParameterMetadata<number>,

  deadStorageElevationM: {
    value: 609.60,
    unit: 'm MSL',
    classification: 'VERIFIED',
    notes: 'Minimum drawdown level (DSL)'
  } as ParameterMetadata<number>,

  downstreamSlopeRatio: {
    value: 0.725,
    unit: 'ratio (H:V)',
    classification: 'PROVISIONAL',
    notes: 'Typical gravity dam downstream batter face'
  } as ParameterMetadata<number>,

  // Central Spillway & Radial Gates
  spillwayWidthMeters: {
    value: 88.0,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Total clear spillway crest width'
  } as ParameterMetadata<number>,

  spillwayPierCount: {
    value: 7,
    unit: 'piers',
    classification: 'PROVISIONAL',
    notes: '7 concrete piers separating 6 crest bays'
  } as ParameterMetadata<number>,

  spillwayGateCount: {
    value: 6,
    unit: 'gates',
    classification: 'VERIFIED',
    source: 'Koyna Dam Mechanical Section',
    notes: '6 Tainter / Radial crest spillway gates'
  } as ParameterMetadata<number>,

  radialGateWidthMeters: {
    value: 12.5,
    unit: 'm',
    classification: 'VERIFIED',
    source: 'Gate Nameplate: 12.5m x 7.6m',
    notes: 'Width of each radial gate leaf'
  } as ParameterMetadata<number>,

  radialGateHeightMeters: {
    value: 7.6,
    unit: 'm',
    classification: 'VERIFIED',
    notes: 'Vertical skin plate curve height'
  } as ParameterMetadata<number>,

  radialArmRadiusMeters: {
    value: 11.2,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Trunnion pin to gate face radial arm radius'
  } as ParameterMetadata<number>,

  maxGateLiftAngleDeg: {
    value: 52.0,
    unit: 'degrees',
    classification: 'PROVISIONAL',
    notes: 'Maximum angular rotation at 100% opening'
  } as ParameterMetadata<number>,

  // Hydraulic Stilling Basin
  stillingBasinLengthMeters: {
    value: 62.0,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Downstream energy dissipation apron & baffle blocks'
  } as ParameterMetadata<number>,

  stillingBasinDepthMeters: {
    value: 8.5,
    unit: 'm',
    classification: 'PROVISIONAL',
    notes: 'Depressed hydraulic jump floor level'
  } as ParameterMetadata<number>,

  // Visualization Scaling & Scene Coordinates
  worldScaleFactor: {
    value: 0.23,
    unit: 'units per meter',
    classification: 'DEMO',
    notes: 'Internal visual prototype scale (103.2m dam height maps to 24.0 Three.js units)'
  } as ParameterMetadata<number>,

  // Downstream River & Canyon Visualization Envelope
  canyonLengthMeters: {
    value: 1800.0,
    unit: 'm',
    classification: 'DEMO',
    notes: 'Downstream valley reach modeled in Phase 2'
  } as ParameterMetadata<number>,

  canyonWidthMeters: {
    value: 550.0,
    unit: 'm',
    classification: 'DEMO',
    notes: 'Lateral canyon wall width'
  } as ParameterMetadata<number>,
};

/**
 * UNIFIED VISUAL PROTOTYPE SCALE SYSTEM (KOYNA_WORLD_SCALE)
 * 
 * DISCLAIMER:
 * The dimensions here establish a consistent internal scale for real-time 3D WebGL visualization.
 * Dam visual height is calibrated to 24.0 Three.js units
 * so that the dam convincingly dominates the scene, matches the proportions of the reference photograph,
 * and maintains optimal z-buffer precision and dynamic lighting.
 * All subsystem dimensions (dam, gates, spillway, stilling basin, reservoir, terrain) derive proportionally.
 */
export const KOYNA_WORLD_SCALE = {
  // Visual height of the dam above valley floor (increased to reach the mountain ridge)
  damHeight: 32.0,
  // Crest length (extended so dam wings embed deeply into mountain rock on both sides)
  crestLength: 192.0,
  // Crest width (roadway + parapets)
  crestWidth: 5.2,
  // Base width at riverbed (gravity batter ~ 1:0.725)
  baseWidth: 24.5,
  // Downstream slope ratio
  slopeRatio: 0.725,
  // Central spillway width
  spillwayWidth: 34.0,
  // Number of spillway gates & piers
  gateCount: 6,
  pierCount: 7,
  pierWidth: 1.0,
  // Single gate bay width derived: (34.0 - (7 * 1.0)) / 6 = 4.5
  gateWidth: 4.4,
  gateHeight: 6.8,
  gateRadius: 7.5,
  // Stilling basin (length, depth, training wall height)
  basinLength: 36.0,
  basinDepth: 4.2,
  basinWallHeight: 8.5,
  // Monolith blocks (contraction joints)
  monolithCountLeft: 18,
  monolithCountRight: 18,
  // Reservoir footprint
  reservoirWidth: 420.0,
  reservoirLength: 340.0,
  // Terrain envelope
  terrainWidth: 280.0,
  terrainLength: 260.0,
  // Vertical datum mapping: maps 609.60m - 665.0m to elevation [16.0, 29.5] (below crest 32.0)
  mapWaterLevelToY: (waterLevelMeters: number) => {
    const normalized = (waterLevelMeters - 609.60) / (665.0 - 609.60);
    return 16.0 + Math.max(0, Math.min(1.0, normalized)) * 13.5;
  },
};

export interface KoynaSimulationState {
  reservoirLevelMeters: number;
  storagePercentage: number;
  inflow: number;
  outflow: number;
  rainfallIntensity: number; // in mm/h (from weather.rainfallNowMmHr)
  gateOpenings: number[]; // 0 to 100 for each of 6 gates
  breach: {
    enabled: boolean;
    width: number;
    depth: number;
    developmentTime: number;
  };
  simulationTime: number; // in hours or timeline index
  timelineStep: string;   // 'T+00', 'T+30 MIN', etc.
  simulationStatus: string;
}
