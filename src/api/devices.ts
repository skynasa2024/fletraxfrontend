import { TDataGridRequestParams } from '@/components';
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
  ident: string;
}

export const getDeviceModel = async (id: string): Promise<DeviceDTO> => {
  const device = await axios.get<ResponseModel<DeviceDTO>>(`/api/devices/show/${id}`);
  return device.data.result;
};

export const getDeviceModelByImei = async (imei: string): Promise<DeviceDTO> => {
  const device = await axios.get<ResponseModel<DeviceDTO>>(`/api/devices/find-by-ident/${imei}`);
  return device.data.result;
};

export const getDevice = async (id: string): Promise<Device> => {
  const device = await getDeviceModel(id);
  return {
    id: device.id,
    imei: device.ident,
    name: device.name,
    vehiclePlate: device.vehiclePlate,
    ident: device.ident
  };
};

export const getDevices = async (
  params: TDataGridRequestParams | OffsetBounds
): Promise<Paginated<DeviceDTO>> => {
  // Convert filters to map
  const filters =
    'filters' in params
      ? (params.filters?.reduce(
          (acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
          },
          {} as Record<string, unknown>
        ) ?? {})
      : {};

  const requestParams =
    'start' in params
      ? {
          offset: params.start,
          size: params.end - params.start + 1,
          search: params.search
        }
      : {
          page: params.pageIndex,
          size: params.pageSize,
          search: filters['__any'] && filters['__any'].toString()
        };

  const devices = await axios.get<PaginatedResponseModel<DeviceDTO>>(
    filters['userId'] ? `/api/devices/get-by-user-id/${filters['userId']}` : '/api/devices/index',
    {
      params: requestParams
    }
  );

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

export const deleteDevice = async (id: string): Promise<void> => {
  await axios.get(`/api/devices/delete/${id}`);
};

interface ProtocolDTO {
  id: string;
  name: string;
  skynasaProtocolId: string;
}

export const getProtocols = async (): Promise<Record<string, string>> => {
  const protocols = await axios.get<PaginatedResponseModel<ProtocolDTO>>(
    '/api/devices/protocols/index',
    {
      params: { size: 100 }
    }
  );
  return protocols.data.result.content.reduce(
    (acc, protocol) => ({
      ...acc,
      [protocol.id]: protocol.name
    }),
    {}
  );
};

interface TypeDTO {
  id: string;
  name: string;
  protocolId: string;
  skynasaTypeId: string;
}

export const getTypes = async (): Promise<Record<string, { name: string; protocolId: string }>> => {
  const types = await axios.get<PaginatedResponseModel<TypeDTO>>('/api/devices/types/index', {
    params: { size: 100 }
  });
  return types.data.result.content.reduce(
    (acc, type) => ({
      ...acc,
      [type.id]: {
        name: type.name,
        protocolId: type.protocolId
      }
    }),
    {}
  );
};

export const updateDevice = async (id: string, data: FormData): Promise<DeviceDTO> => {
  data.set('id', id);
  const device = await axios.put<ResponseModel<DeviceDTO>>('/api/devices/update', data);
  return device.data.result;
};

export const createDevice = async (data: FormData): Promise<DeviceDTO> => {
  const device = await axios.post<ResponseModel<DeviceDTO>>('/api/devices/create', data);
  return device.data.result;
};

export const getUnlinkedDevices = async (offset: OffsetBounds): Promise<Paginated<DeviceDTO>> => {
  const requestParams = {
    offset: offset.start,
    size: offset.end - offset.start + 1,
    search: offset.search
  };
  const devices = await axios.get<PaginatedResponseModel<DeviceDTO>>(
    '/api/devices/get-unlinked-devices',
    {
      params: requestParams
    }
  );
  return {
    data: devices.data.result.content,
    totalCount: devices.data.result.totalElements
  };
};

export const getLinkedDevices = async (
  userId: string,
  offset: OffsetBounds
): Promise<Paginated<DeviceDTO>> => {
  const requestParams = {
    offset: offset.start,
    size: offset.end - offset.start + 1,
    search: offset.search
  };
  const devices = await axios.get<PaginatedResponseModel<DeviceDTO>>(
    `/api/devices/get-by-user-id/${userId}`,
    {
      params: requestParams
    }
  );
  return {
    data: devices.data.result.content,
    totalCount: devices.data.result.totalElements
  };
};

export const unlinkLinkDevice = async (userId: string, imei: string | string[]): Promise<void> => {
  await axios.post(`/api/devices/link-unlink-devices`, [imei].flat().map(Number), {
    params: { userId }
  });
};

interface Address {
  road: string;
  village: string;
  state_district: string;
  state: string;
  ISO3166_2_lvl4: string;
  postcode: string;
  country: string;
  country_code: string;
}

interface ReverseGeoLocationResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
}

export const reverseGeoLocation = async (lat: number, lng: number): Promise<string> => {
  const location = await axios.get<ReverseGeoLocationResponse>(
    `https://nominatim.openstreetmap.org/reverse`,
    {
      params: { lat, lon: lng, format: 'jsonv2' }
    }
  );
  return location.data.display_name;
};
