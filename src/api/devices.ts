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
