export interface GISLayer {
  id: string;
  name: string;
  category: 'HYDROLOGY' | 'INFRASTRUCTURE' | 'POPULATION' | 'TERRAIN';
  visible: boolean;
  opacity: number;
  color: string;
  description: string;
}

export interface GISLocationMarker {
  id: string;
  name: string;
  type: 'DAM' | 'VILLAGE' | 'BRIDGE' | 'HOSPITAL' | 'SHELTER' | 'GAUGE';
  lat: number;
  lng: number;
  elevationM: number;
  depthEstM: number;
  arrivalMin: number;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE';
}

export interface MapCoordinates {
  lat: number;
  lng: number;
  zoom: number;
  elevation: number;
}
