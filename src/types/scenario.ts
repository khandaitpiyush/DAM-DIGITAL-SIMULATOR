import { BreachParameters, GateState, ReservoirConditions, RiskLevel, SimulationResults, WeatherConditions } from './simulation';

export interface Scenario {
  id: string;
  name: string;
  code: string;
  description: string;
  riskLevel: RiskLevel;
  createdAt: string;
  author: string;
  reservoir: ReservoirConditions;
  weather: WeatherConditions;
  gates: GateState[];
  breach: BreachParameters;
  resultsPreview: SimulationResults;
}
