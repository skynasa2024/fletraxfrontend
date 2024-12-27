import { faker } from '@faker-js/faker';
import { fakeVehicle } from './faker';
import { TDataGridRequestParams } from '@/components';
import { Paginated } from './common';
import { Vehicle } from './cars';

interface DataGridFilter {
  id: string;
  value: string | number | boolean | null;
}

interface DriverDataGridRequestParams extends Omit<TDataGridRequestParams, 'filters'> {
  filters?: DataGridFilter[];
}

export interface Driver {
  id: string;
  fullName: string; 
  birthDate: Date;
  vehicle: Vehicle;
  status: string;
  actions: string[];
  identityType: 'Turkish' | 'Foreign';
  company: string;
  username: string;
  idNumber: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
}

const generateTurkishId = () => {
  return faker.number.int({ min: 10000000000, max: 99999999999 }).toString();
};

const generateLicenseNumber = () => {
  const prefix = faker.string.alpha({ length: 1, casing: 'upper' });
  const numbers = faker.number.int({ min: 100000, max: 999999 });
  return `${prefix}${numbers}`;
};

export const getDrivers = async (params: DriverDataGridRequestParams): Promise<Paginated<Driver>> => {
  const totalCount = faker.number.int({ min: 20, max: 100 });
  
  const originalDataset: Driver[] = Array(params.pageSize)
    .fill(0)
    .map(() => {
      const isTurkish = faker.datatype.boolean();
      const futureDate = faker.date.future();
      
      return {
        id: faker.string.uuid(),
        fullName: faker.person.fullName(),  
        birthDate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        vehicle: fakeVehicle(),
        status: faker.helpers.arrayElement(['Active', 'Under Review']),
        actions: faker.helpers.arrayElements(['Edit', 'Delete', 'View'], faker.number.int({ min: 1, max: 3 })),
        identityType: isTurkish ? 'Turkish' : 'Foreign',
        company: faker.company.name(),
        username: faker.internet.userName(),
        idNumber: isTurkish ? generateTurkishId() : faker.string.alphanumeric(9).toUpperCase(),
        licenseNumber: generateLicenseNumber(),
        licenseExpiryDate: futureDate,
      };
    });

  let filteredDataset = originalDataset;
  if (params.filters && params.filters.length > 0) {
    const searchFilter = params.filters.find(f => f.id === '__any');
    if (searchFilter && typeof searchFilter.value === 'string') {
      const searchTerm = searchFilter.value.toLowerCase();
      filteredDataset = originalDataset.filter(driver => 
        driver.fullName.toLowerCase().includes(searchTerm) ||  
        driver.company.toLowerCase().includes(searchTerm) ||
        driver.username.toLowerCase().includes(searchTerm) ||
        driver.idNumber.toLowerCase().includes(searchTerm) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm)
      );
    }
  }

  return {
    data: filteredDataset,
    totalCount,
  };
};