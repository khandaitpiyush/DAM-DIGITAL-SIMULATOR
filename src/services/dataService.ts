import { Scenario } from '../types/scenario';
import { SimulationResults } from '../types/simulation';
import { DOWNSTREAM_SETTLEMENTS } from '../data/mockData';

export function generateGeoJSON(scenarioName: string, results: SimulationResults): string {
  const geojson = {
    type: "FeatureCollection",
    metadata: {
      platform: "KOYNA FLOODSIM — SIH 2026 (SIH26161)",
      scenario: scenarioName,
      generatedAt: new Date().toISOString(),
      dataMode: "SIMULATION / SYNTHETIC GEOMETRY",
      crs: "EPSG:4326 (WGS 84)"
    },
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [73.7492, 17.3986]
        },
        properties: {
          name: "Koyna Hydroelectric Dam Axis",
          type: "Dam Structure",
          crestElevationM: 659.43,
          maxDischargeM3s: 5663
        }
      },
      ...DOWNSTREAM_SETTLEMENTS.map((s) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [73.7492 + (s.distanceKm * 0.0035), 17.3986 - (s.distanceKm * 0.0018)]
        },
        properties: {
          settlement: s.name,
          distanceKm: s.distanceKm,
          arrivalMin: s.estimatedArrivalMin,
          depthM: s.projectedMaxDepthM,
          population: s.populationAtRisk,
          evacuationPriority: s.evacuationPriority
        }
      })),
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [73.7492, 17.3986],
            [73.7650, 17.3820],
            [73.8100, 17.3700],
            [73.8950, 17.3620],
            [74.1800, 17.2850],
            [74.1950, 17.2750],
            [74.1750, 17.2950],
            [73.8850, 17.3750],
            [73.8050, 17.3800],
            [73.7492, 17.3986]
          ]]
        },
        properties: {
          name: "Maximum Flood Inundation Envelope",
          floodedAreaKm2: results.floodedAreaKm2,
          maxDepthM: results.maxDepthMeters,
          maxVelocityMs: results.maxVelocityMs,
          riskLevel: results.riskLevel
        }
      }
    ]
  };

  return JSON.stringify(geojson, null, 2);
}

export function generateKML(scenarioName: string, results: SimulationResults): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>KOYNA FLOODSIM - ${scenarioName}</name>
    <description>Simulation Output - Smart India Hackathon 2026 (SIH26161)</description>
    <Placemark>
      <name>Koyna Dam Axis</name>
      <description>Full Reservoir Level: 659.43m | Outflow: Simulation Output</description>
      <Point>
        <coordinates>73.7492,17.3986,659.4</coordinates>
      </Point>
    </Placemark>
    <Placemark>
      <name>Peak Inundation Extent (${results.floodedAreaKm2} km²)</name>
      <description>Max Depth: ${results.maxDepthMeters}m | Max Velocity: ${results.maxVelocityMs} m/s | Risk: ${results.riskLevel}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              73.7492,17.3986,0
              73.7650,17.3820,0
              73.8100,17.3700,0
              73.8950,17.3620,0
              74.1800,17.2850,0
              74.1750,17.2950,0
              73.7492,17.3986,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
