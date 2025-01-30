import { axios } from './axios';
import { OffsetBounds, Paginated } from './common';
import { PaginatedResponseModel, ResponseModel } from './response';

export interface DeviceDTO {
  id: string;
  ident: string;
  name: string;
  vehiclePlate: string;
  vehicleImage: string | null;
  phoneCode: string;
  phone: string;
  webNotification: boolean;
  smsNotification: boolean;
  status: string;
  motionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  userId: string;
  skynasaDeviceId: string;
  protocolId: string;
  typeId: string;
}

export interface Device {
  id: string;
  imei: string;
  name: string;
  vehiclePlate: string;
}

export const getDeviceModel = async (id: string): Promise<DeviceDTO> => {
  const device = await axios.get<ResponseModel<DeviceDTO>>(`/api/devices/show/${id}`);
  return device.data.result;
};

export const getDevice = async (id: string): Promise<Device> => {
  const device = await getDeviceModel(id);
  return {
    id: device.id,
    imei: device.ident,
    name: device.name,
    vehiclePlate: device.vehiclePlate
  };
};

export const getDevices = async (params: OffsetBounds): Promise<Paginated<DeviceDTO>> => {
  const requestParams = {
    offset: params.start,
    size: params.end - params.start + 1,
    search: params.search
  };

  const devices = await axios.get<PaginatedResponseModel<DeviceDTO>>('/api/devices/index', {
    params: requestParams
  });

  return {
    data: devices.data.result.content,
    totalCount: devices.data.result.totalElements
  };
};

export interface MonitoringDTO {
  ident: string;
  status: string;
  motionStatus: string;
  userId: string;
  vehiclePlate: string;
  vehicleImage: string | null;
}

export const getMonitoringDevices = async (): Promise<MonitoringDTO[]> => {
  const availableLocations =
    await axios.get<ResponseModel<MonitoringDTO[]>>('api/devices/monitoring');
  return availableLocations.data.result;
};

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  connected: number;
  disconnected: number;
}

export const getDevicesStats = async (): Promise<DeviceStats> => {
  const stats = await axios.get<ResponseModel<DeviceStats>>('/api/devices/stats');
  return stats.data.result;
};
