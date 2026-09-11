import { BreachParameters, GateState, ReservoirConditions, SimulationResults, WeatherConditions, WorkflowStep } from '../types/simulation';

export const WORKFLOW_STEPS: Omit<WorkflowStep, 'status'>[] = [
  { id: 1, code: '01', title: 'VALIDATING INPUTS', description: 'Checking reservoir stage, weir coefficients, and breach geometry limits' },
  { id: 2, code: '02', title: 'LOADING TERRAIN', description: 'Accessing Koyna Valley 10m DEM mesh and river bathymetry layers' },
  { id: 3, code: '03', title: 'LOADING HYDROLOGICAL CONDITIONS', description: 'Compiling catchment precipitation vectors and tributary inflows' },
  { id: 4, code: '04', title: 'PREPARING BOUNDARY CONDITIONS', description: 'Setting initial headwater stage and downstream stage-discharge curves' },
  { id: 5, code: '05', title: 'RUNNING HYDRODYNAMIC MODEL', description: 'Solving 2D Shallow Water Equations (SWE) with finite volume scheme' },
  { id: 6, code: '06', title: 'PROCESSING FLOOD PROPAGATION', description: 'Computing wave front arrival times, maximum depths, and velocities' },
  { id: 7, code: '07', title: 'CALCULATING GIS IMPACT', description: 'Intersecting inundation polygon with buildings, roads, and population' },
  { id: 8, code: '08', title: 'GENERATING RESULTS', description: 'Aggregating peak hydrographs, risk classifications, and hazard maps' },
  { id: 9, code: '09', title: 'SIMULATION COMPLETE', description: 'Simulation data ready for 3D Digital Twin rendering and decision support' },
];

/**
 * Executes a simulated 9-step simulation pipeline for UI demonstration.
 * In future iterations, this connects to the FastAPI Python hydrodynamic engine.
 */
export async function executeSimulationPipeline(
  onStepUpdate: (stepIndex: number, step: WorkflowStep) => void,
  onComplete: (results: SimulationResults) => void,
  params: {
    reservoir: ReservoirConditions;
    weather: WeatherConditions;
    gates: GateState[];
    breach: BreachParameters;
  }
): Promise<void> {
  const steps: WorkflowStep[] = WORKFLOW_STEPS.map((s) => ({ ...s, status: 'pending' }));

  for (let i = 0; i < steps.length; i++) {
    // Mark active
    steps[i].status = 'active';
    onStepUpdate(i, steps[i]);

    // Simulated computation delay per step
    const delay = i === 4 ? 850 : i === 5 ? 750 : 350;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Mark completed
    steps[i].status = 'completed';
    onStepUpdate(i, steps[i]);
  }

  // Calculate realistic UI mock outputs based on input magnitude
  // NOTE: Strictly labeled as synthetic simulation outputs
  const breachFactor = params.breach.enabled ? (params.breach.widthMeters / 100) * 1.8 + 1 : 0.4;
  const rainfallFactor = params.weather.rainfallNowMmHr / 30;
  const storageRatio = params.reservoir.storagePercentage / 100;

  const totalOutflow =
    params.gates.reduce((acc, g) => acc + (g.openingPercentage > 0 ? (g.openingPercentage / 100) * 500 : 0), 0) +
    (params.breach.enabled ? params.breach.widthMeters * 35 : 0);

  const floodedArea = Math.min(180, +(15 + breachFactor * 45 * storageRatio + rainfallFactor * 12).toFixed(1));
  const maxDepth = Math.min(18.5, +(2.2 + breachFactor * 4.2 * storageRatio + (totalOutflow / 4000) * 2.5).toFixed(1));
  const maxVelocity = Math.min(12.0, +(1.5 + breachFactor * 2.8 + (totalOutflow / 3000) * 1.8).toFixed(1));
  const arrivalTime = Math.max(12, Math.round(180 / (breachFactor * 2.5 + 0.8)));
  const buildings = Math.min(6500, Math.round(floodedArea * 28 + maxDepth * 35));
  const roads = +(floodedArea * 0.72).toFixed(1);
  const population = Math.min(125000, Math.round(buildings * 18.5));
  const critical = Math.max(1, Math.min(22, Math.round(floodedArea / 7.5)));

  let risk: SimulationResults['riskLevel'] = 'LOW';
  if (maxDepth > 7.5 || params.breach.enabled || population > 30000) {
    risk = 'CRITICAL';
  } else if (maxDepth > 4.0 || population > 10000) {
    risk = 'HIGH';
  } else if (maxDepth > 2.0) {
    risk = 'MODERATE';
  }

  const results: SimulationResults = {
    floodedAreaKm2: floodedArea,
    maxDepthMeters: maxDepth,
    maxVelocityMs: maxVelocity,
    floodArrivalMin: arrivalTime,
    buildingsAffected: buildings,
    roadsAffectedKm: roads,
    populationAtRisk: population,
    criticalLocations: critical,
    riskLevel: risk,
  };

  onComplete(results);
}
