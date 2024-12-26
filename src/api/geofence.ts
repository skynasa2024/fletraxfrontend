import { axios } from './axios';
import { PaginatedResponseModel } from './response';

export interface GeofenceDTO {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
  userId: number;
}

export interface Geofence {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export const getGeofences = async () => {
  const geofences = await axios.get<PaginatedResponseModel<GeofenceDTO>>('/api/geofences/index');
  return geofences.data.result.content.map((geofence) => ({
    id: geofence.id,
    name: geofence.name,
    type: geofence.type,
    latitude: geofence.latitude,
    longitude: geofence.longitude,
    radius: geofence.radius
  }));
};

export const deleteGeofence = async (id: number) => {
  return await axios.get(`/api/geofences/delete/${id}`);
};
