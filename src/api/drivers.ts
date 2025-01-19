import { OffsetBounds, Paginated } from './common';
import { axios } from './axios';
import { PaginatedResponseModel, ResponseModel } from './response';
import { TDataGridRequestParams } from '@/components';
import { Vehicle } from './cars';

interface DriverDTO {
  id: number;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  identityType: string;
  frontNationalIdPhoto: string;
  backNationalIdPhoto: string;
  nationality: string;
  passportPhoto: string;
  lastEntryPhoto: string;
  passportNumber: string;
  idNumber: string;
  licenseSerialNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  billingAddress: string;
  frontDrivingLicensePhoto: string;
  backDriverLicensePhoto: string;
  licensePlace: string;
  type: string;
  licenseClass: string;
  email: string;
  firstPhoneCode: string;
  firstPhone: string;
  secondPhoneCode: string;
  secondPhone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  archived: boolean;
  userId: number;
  vehicleBrand: string;
  vehicleId: number;
  vehicleImage: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: boolean;
}

export interface Driver {
  name: string;
  avatar?: string;
  email: string;
}

export interface DriverDetails {
  id: number;
  driver: Driver;
  nationality: string;
  country: string;
  city: string;
  phone: string;
  status: string;
  dateOfBirth: string;
  idNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicle: Vehicle;
}

export const getDrivers = async (
  params: TDataGridRequestParams | OffsetBounds
): Promise<Paginated<DriverDetails>> => {
  const requestParams =
    'start' in params
      ? {
          offset: params.start,
          size: params.end - params.start + 1
        }
      : {
          page: params.pageIndex,
          size: params.pageSize
        };

  const drivers = await axios.get<PaginatedResponseModel<DriverDTO>>('/api/drivers/index', {
    params: requestParams
  });

  return {
    data: drivers.data.result.content.map((driver) => ({
      id: driver.id,
      driver: {
        name: driver.fullName,
        email: driver.email
      },
      nationality: driver.nationality,
      country: driver.country,
      city: driver.city,
      phone: driver.firstPhone,
      status: driver.status ? 'Active' : 'Under Review',
      dateOfBirth: driver.dateOfBirth,
      idNumber: driver.idNumber,
      licenseNumber: driver.licenseSerialNumber,
      licenseExpiry: driver.licenseExpiryDate,
      vehicle: {
        brandImage: '',
        id: driver.vehicleId,
        imei: '',
        name: '',
        plate: driver.vehiclePlate
      }
    })),
    totalCount: drivers.data.result.totalElements,
    offset: drivers.data.result.pageable.offset
  };
};

export const deleteDriver = (id: number) => {
  return axios.get(`/api/drivers/delete/${id}`);
};

export interface DriverStats {
  total: number;
  active: number;
  unactive: number;
}

export const getDriversStats = async (): Promise<DriverStats> => {
  const stats = await axios.get<ResponseModel<DriverStats>>('/api/drivers/stats');
  return stats.data.result;
};
