import { axios } from './axios';
import { ResponseModel } from './response';

interface DeviceDTO {
  id: number;
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
  userId: number;
  skynasaDeviceId: number;
  protocolId: number;
  typeId: number;
}

export interface Device {
  id: number;
  imei: string;
  name: string;
  vehiclePlate: string;
}

export const getDevice = async (id: number): Promise<Device> => {
  const device = await axios.get<ResponseModel<DeviceDTO>>(`/api/devices/show/${id}`);
  return {
    id: device.data.result.id,
    imei: device.data.result.ident,
    name: device.data.result.name,
    vehiclePlate: device.data.result.vehiclePlate
  };
};

export interface MonitoringDTO {
  ident: string;
  status: string;
  motionStatus: string;
  userId: number;
  vehiclePlate: string;
  vehicleImage: string | null;
}

export const getMonitoringDevices = async (): Promise<MonitoringDTO[]> => {
  const availableLocations =
    await axios.get<ResponseModel<MonitoringDTO[]>>('api/devices/monitoring');
  return availableLocations.data.result;
};
