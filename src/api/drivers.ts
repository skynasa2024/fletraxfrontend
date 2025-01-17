import { OffsetBounds, Paginated } from './common';
import { axios } from './axios';
import { PaginatedResponseModel } from './response';

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
}

export const getDrivers = async (params: OffsetBounds): Promise<Paginated<DriverDetails>> => {
  const offset = params.start;
  const size = params.end - params.start + 1;

  const drivers = await axios.get<PaginatedResponseModel<DriverDTO>>('/api/drivers/index', {
    params: {
      size,
      offset
    }
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
      status: 'Active'
    })),
    totalCount: drivers.data.result.totalElements,
    offset: drivers.data.result.pageable.offset
  };
};

export const deleteDriver = (id: number) => {
  return axios.get(`/api/drivers/delete/${id}`);
};
