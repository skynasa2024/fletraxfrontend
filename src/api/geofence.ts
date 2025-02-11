import { axios } from './axios';
import { OffsetBounds, Paginated } from './common';
import { PaginatedResponseModel, ResponseModel } from './response';

export interface GeofenceDTO {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
  userId: string;
}

export interface Geofence {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export const getGeofences = async (params: OffsetBounds): Promise<Paginated<Geofence>> => {
  const requestParams = {
    offset: params.start,
    size: params.end - params.start + 1,
    search: params.search
  };
  const geofences = await axios.get<PaginatedResponseModel<GeofenceDTO>>('/api/geofences/index', {
    params: requestParams
  });
  const data = geofences.data.result.content.map((geofence) => ({
    id: geofence.id,
    name: geofence.name,
    type: geofence.type,
    latitude: geofence.latitude,
    longitude: geofence.longitude,
    radius: geofence.radius
  }));
  return {
    data,
    totalCount: geofences.data.result.totalElements
  };
};

export const getGeofence = async (id: string): Promise<GeofenceDTO> => {
  const geofence = await axios.get<ResponseModel<GeofenceDTO>>(`/api/geofences/show/${id}`);
  return geofence.data.result;
};

export const createGeofence = async (formData: FormData) => {
  return await axios.post('/api/geofences/create', formData);
};

export const updateGeofence = async (id: string, formData: FormData) => {
  formData.append('id', id);
  return await axios.put(`/api/geofences/update`, formData);
};

export const deleteGeofence = async (id: string) => {
  return await axios.get(`/api/geofences/delete/${id}`);
};
