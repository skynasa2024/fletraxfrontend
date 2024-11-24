import { faker } from '@faker-js/faker';
import { TDataGridRequestParams } from '@/components';
import { Paginated } from './common';

export interface Vehicle {
  vehicle: unknown;
  id: string;
  owner: string;
  email: string;
  brand: string;
  plate: string;
  gear: 'Manual' | 'Automatic';
  deviceName: string;
  currentMileage: string;
  status: 'Available' | 'Unavailable' | 'Maintenance' | 'Rented';
}

export const getVehicles = async (
  params: TDataGridRequestParams
): Promise<Paginated<Vehicle>> => {
  const totalCount = faker.number.int({ min: 10, max: 100 });
  const originalDataset: Vehicle[] = Array(params.pageSize)
    .fill(0)
    .map(() => ({
      id: faker.string.uuid(),
      owner: faker.person.fullName(),
      email: faker.internet.email(),
      brand: faker.vehicle.manufacturer(),
      plate: faker.vehicle.vrm(),
      gear: faker.helpers.arrayElement(['Manual', 'Automatic']),
      deviceName: faker.vehicle.model(),
      currentMileage: `${faker.number.int({ min: 1, max: 150 })} KM`,
      status: faker.helpers.arrayElement(['Available', 'Unavailable', 'Maintenance', 'Rented'])
    }));

  return {
    data: originalDataset,
    totalCount
  };
};

export type VehicleStatusType = 'Available' | 'Unavailable' | 'Maintenance' | 'Rented';

export const STATUS_COLORS = {
  Available: 'success',
  Unavailable: 'error',
  Maintenance: 'warning',
  Rented: 'info'
} as const;