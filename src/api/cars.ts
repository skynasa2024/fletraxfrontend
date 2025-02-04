import { TDataGridRequestParams } from '@/components';
import { OffsetBounds, Paginated } from './common';
import { Driver } from './drivers';
import { User, getUser } from './user';
import { axios } from './axios';
import { PaginatedResponseModel, ResponseModel } from './response';
import { getDevice } from './devices';
import { arrayToFormData, objectToFormData, toAbsoluteUrl } from '@/utils';
import { CarType, FuelType, GearType, RegistrationType } from '@/pages/vehicle/add-vehicle';

export interface CarCountsDTO {
  total: number;
  offline: number;
  online: number;
  moving: number;
  parking: number;
}

export const getCarCount = async (): Promise<Record<string, number>> => {
  const carCounts = await axios.get<ResponseModel<CarCountsDTO>>('/api/devices/counts');
  return {
    Moving: carCounts.data.result.moving,
    Parked: carCounts.data.result.parking,
    Online: carCounts.data.result.online,
    Offline: carCounts.data.result.offline
  };
};

export interface Vehicle {
  id: string;
  brandImage: string;
  plate: string;
  imei: string;
  name: string;
}

export interface VehicleDetails {
  vehicle: Vehicle;
  customer: Driver;
  brandName: string;
  type: string;
  mileage: string;
  status: string;
  deviceName: string;
}

export interface VehicleDTO {
  id: string;
  plate: string;
  image: string | null;
  imageFile?: string | null;
  type: RegistrationType;
  status: string;
  brand: string;
  model: string;
  modelSeries: string;
  modelYear: number;
  volume: string;
  power: string;
  fuelType: FuelType;
  carType: CarType;
  gear: GearType;
  color: string;
  numberOfSeats: number;
  identifyNumber: string;
  chassisNumber: string;
  engineNumber: string;
  registrationNumber: string;
  registrationDate: string;
  firstRegistrationDate: string;
  licenseSerialNumber: string;
  price: number;
  inspectionStartDate: string;
  inspectionEndDate: string;
  insuranceStartDate: string;
  insuranceEndDate: string;
  kaskoInsuranceStartDate: string;
  kaskoInsuranceEndDate: string;
  exhaustStartDate: string;
  exhaustEndDate: string;
  hgsNumber: string;
  currentMileage: string;
  maintenanceMileage: string;
  fuelConsumption: number;
  licenseImage?: string;
  licenseImageFile?: string;
  owner: string;
  userId: string;
  deviceId: string;
  deviceIdent: string;
  vehicleId: string;
  scratches: ScratchDTO[];
}

export interface ScratchDTO {
  id?: string;
  place: number;
  image?: string | null;
  imageFile?: string | null;
  explanationOf: string;
  vehicleId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  unavailable: number;
  inMaintenance: number;
}

interface CarsMileageAndEngineDTO {
  id: string;
  ident: string;
  date: string;
  deviceId: string | null;
  deviceName: string | null;
  vehiclePlate: string | null;
  vehicleImage: string | null;
  formatedDailyExistingKilometers: string;
  formatedTotalExistingKilometers: string;
  dailyExistingKilometers: number;
  totalExistingKilometers: number;
  formatedDailyParkingTime: string;
  formatedTotalParkingTime: string;
  dailyParkingTime: number;
  totalParkingTime: number;
  formatedDailyEngineHours: string;
  formatedTotalEngineHours: string;
  dailyEngineHours: number;
  totalEngineHours: number;
}

export interface CarMileageAndEngine {
  vehicle: Vehicle;
  mileage: number;
  engine: number;
  formattedMilage: string;
  formattedEngine: string;
}

export const getCarsMileageAndEngine = async (
  offset: OffsetBounds,
  sort: 'kilometers' | 'engine' = 'kilometers'
): Promise<Paginated<CarMileageAndEngine>> => {
  const carsMileageAndEngine = await axios.get<PaginatedResponseModel<CarsMileageAndEngineDTO>>(
    '/api/statistics/counts',
    {
      params: {
        offset: offset.start,
        size: offset.end - offset.start + 1,
        sort: sort === 'engine' ? 'dailyEngineHours,desc' : 'dailyExistingKilometers,desc'
      }
    }
  );
  return {
    data: carsMileageAndEngine.data.result.content.map((car) => ({
      vehicle: {
        id: car.id,
        brandImage: car.vehicleImage ?? '',
        plate: car.vehiclePlate ?? '',
        imei: car.ident,
        name: car.vehiclePlate ?? ''
      },
      mileage: car.dailyExistingKilometers,
      engine: car.dailyEngineHours,
      formattedMilage: car.formatedDailyExistingKilometers,
      formattedEngine: car.formatedDailyEngineHours
    })),
    totalCount: carsMileageAndEngine.data.result.totalElements
  };
};

export interface ViolationDTO {
  id: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  userId: string;
  vehicleId: string;
}

export interface Violation {
  id: string;
  vehicle: Vehicle | null;
  date: Date;
  user: User;
  type: string;
  price: number;
  status: string;
}

export const getViolations = async (
  params: TDataGridRequestParams
): Promise<Paginated<Violation>> => {
  // Convert filters to map
  const filters =
    params.filters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>
    ) ?? {};
  const violations = await axios.get<PaginatedResponseModel<ViolationDTO>>(
    filters['vehicleId']
      ? `/api/violations/get-by-vehicle-id/${filters['vehicleId']}`
      : '/api/violations/index',
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        search: filters['__any'] && filters['__any'].toString()
      }
    }
  );

  const usersPromise = violations.data.result.content.map((violation) => getUser(violation.userId));
  const users = await Promise.all(usersPromise);

  const vehiclePromise = violations.data.result.content.map((violation) =>
    getVehicle(violation.vehicleId)
  );
  const vehicles = await Promise.all(vehiclePromise);

  return {
    data: violations.data.result.content.map((violation, i) => ({
      id: violation.id,
      vehicle: vehicles[i],
      date: new Date(violation.startDate),
      user: users[i],
      type: violation.type,
      price: violation.amount,
      status: violation.status
    })),
    totalCount: violations.data.result.totalElements
  };
};

export const updateViolationStatus = async (id: string, status: string): Promise<void> => {
  await axios.patch(`/api/violations/update-status/${id}`, undefined, {
    params: {
      status
    }
  });
};

export const updateVehicleStatus = async (id: string, status: string): Promise<void> => {
  await axios.post(`/api/vehicles/cars/update-status/${id}`, undefined, {
    params: {
      status
    }
  });
};

export interface Maintenance {
  id: string;
  date: Date;
  vehicle: Vehicle | null;
  type: string;
  supplier: string;
  price: number;
  status: string;
}

export interface MaintenanceDTO {
  id: string;
  type: string;
  description: string;
  supplier: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  vehicleId: string;
  userId: string;
}

export const getMaintenance = async (
  params: TDataGridRequestParams
): Promise<Paginated<Maintenance>> => {
  // Convert filters to map
  const filters =
    params.filters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>
    ) ?? {};
  const maintenances = await axios.get<PaginatedResponseModel<MaintenanceDTO>>(
    filters['vehicleId']
      ? `/api/maintenances/get-by-vehicle-id/${filters['vehicleId']}`
      : '/api/maintenances/index',
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        search: filters['__any'] && filters['__any'].toString()
      }
    }
  );

  const vehiclePromise = maintenances.data.result.content.map((maintenance) =>
    getVehicle(maintenance.vehicleId)
  );
  const vehicles = await Promise.all(vehiclePromise);

  return {
    data: maintenances.data.result.content.map((maintenance, i) => ({
      id: maintenance.id,
      date: new Date(maintenance.startDate),
      vehicle: vehicles[i],
      type: maintenance.type,
      supplier: maintenance.supplier,
      price: maintenance.amount,
      status: maintenance.status
    })),
    totalCount: maintenances.data.result.totalElements
  };
};

export const updateMaintenanceStatus = async (id: string, status: string): Promise<void> => {
  await axios.patch(`/api/maintenances/update-status/${id}`, undefined, {
    params: {
      status
    }
  });
};

export const getVehicles = async (
  params: TDataGridRequestParams | OffsetBounds
): Promise<Paginated<VehicleDetails>> => {
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
          search: params.filters?.[0] && params.filters[0].value
        };

  const vehiclesRes = await axios.get<PaginatedResponseModel<VehicleDTO>>(
    '/api/vehicles/cars/index',
    {
      params: requestParams
    }
  );

  const fullVehicleDetails: VehicleDetails[] = vehiclesRes.data.result.content.map((vehicle) => ({
    vehicle: {
      id: vehicle.vehicleId,
      brandImage: vehicle.image ?? '',
      plate: vehicle.plate,
      imei: 'imei',
      name: `${vehicle.brand} ${vehicle.model} ${vehicle.modelSeries}`
    },
    customer: {
      name: vehicle.owner,
      avatar: '',
      email: 'john.doe@example.com'
    },
    brandName: vehicle.brand,
    type: vehicle.gear ?? 'NA',
    mileage: vehicle.currentMileage ? vehicle.currentMileage : 'NA',
    status: vehicle.status,
    deviceName: 'Device Name'
  }));

  return {
    data: fullVehicleDetails,
    totalCount: vehiclesRes.data.result.totalElements
  };
};

const getVehicle = async (id: string): Promise<Vehicle | null> => {
  const vehicle = await axios.get<ResponseModel<VehicleDTO | null>>(
    `/api/vehicles/cars/find-by-vehicle-id/${id}`
  );

  if (!vehicle.data.result) {
    return null;
  }

  const device = await getDevice(vehicle.data.result.deviceId);
  return {
    id: vehicle.data.result.id,
    brandImage: toAbsoluteUrl(`/media/car-brands/${vehicle.data.result.brand}.png`),
    plate: vehicle.data.result.plate,
    imei: device.imei,
    name: `${vehicle.data.result.brand} ${vehicle.data.result.model}`
  };
};

export const getVehicleDetails = async (vehicleId: string): Promise<VehicleDTO | null> => {
  return (
    await axios.get<ResponseModel<VehicleDTO | null>>(
      '/api/vehicles/cars/find-by-vehicle-id/' + vehicleId
    )
  ).data.result;
};

export interface VehicleStatus {
  engineStatus: boolean;
  parkingTime: string;
  timestamp: Date;
  speed: number;
  satellietes: number;
  batteryLevel: number;
  engineBlocked: boolean;
  defenseStatus: boolean;
  signalLevel: number;
  existingKilometer: string;
}

export interface VehicleLocation {
  vehicle: Vehicle;
  online: boolean;
  long: number;
  lat: number;
  angle: number;
  status: VehicleStatus;
}

export const getVehiclesStats = async (): Promise<VehicleStats> => {
  const stats = await axios.get<ResponseModel<VehicleStats>>('api/vehicles/cars/stats');
  return stats.data.result;
};

export const createVehicle = async (vehicle: Partial<VehicleDTO>): Promise<VehicleDTO> => {
  const formData = objectToFormData(vehicle);
  const newVehicle = await axios.post<ResponseModel<VehicleDTO>>(
    '/api/vehicles/cars/create',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return newVehicle.data.result;
};

export const updateVehicle = async (vehicle: VehicleDTO): Promise<VehicleDTO> => {
  const formData = objectToFormData(vehicle);
  for (const [key, value] of [...formData.entries()]) {
    if (!value || value === 'undefined') {
      formData.delete(key);
    }
  }
  const updatedVehicle = await axios.put<ResponseModel<VehicleDTO>>(
    `/api/vehicles/cars/update`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return updatedVehicle.data.result;
};

export const createScratches = async (scratches: ScratchDTO[]): Promise<ScratchDTO> => {
  const formData = arrayToFormData(scratches, 'scratches');
  const newScratch = await axios.post<ResponseModel<ScratchDTO>>(
    '/api/vehicles/scratches/create',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return newScratch.data.result;
};

export const getScratches = async (
  vehicleId: string,
  params: OffsetBounds
): Promise<ScratchDTO[]> => {
  const scratches = await axios.get<PaginatedResponseModel<ScratchDTO[]>>(
    `/api/vehicles/scratches/get-by-vehicle-id/${vehicleId}`,
    {
      params: {
        offset: params.start,
        size: params.end - params.start + 1
      }
    }
  );
  return scratches.data.result.content.flat();
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await axios.get(`/api/vehicles/cars/delete/${id}`);
};
