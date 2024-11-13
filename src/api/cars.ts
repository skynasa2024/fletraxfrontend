import { toAbsoluteUrl } from '@/utils';
import { faker } from '@faker-js/faker';

export const getMovingCars = async (): Promise<Record<string, number>> => {
  return {
    Moving: 1700,
    Parked: 290
  };
};

export const getOnlineCars = async (): Promise<Record<string, number>> => {
  return {
    Online: 1800,
    Offline: 190
  };
};

export interface CarMileageAndEngine {
  brandImage: string;
  plate: string;
  imei: string;
  mileage: number;
  engine: number;
}

export const getCarsMileageAndEngine = async (cursor?: string): Promise<CarMileageAndEngine[]> => {
  const LIMIT = 20;
  let largestMileage = faker.number.float({ min: 10000, max: 10000, fractionDigits: 3 });
  let largestEngine = faker.number.float({ min: 1000, max: 1000, fractionDigits: 3 });

  return Array(LIMIT)
    .fill(0)
    .map(() => {
      largestMileage -= faker.number.float({ max: 1000, fractionDigits: 3 });
      largestEngine -= faker.number.float({ max: 100, fractionDigits: 3 });
      return {
        brandImage: toAbsoluteUrl('/media/car-brands/toyota.png'),
        plate: faker.string.alphanumeric({ length: 7, casing: 'upper' }),
        imei: faker.phone.imei(),
        mileage: largestMileage,
        engine: largestEngine
      };
    });
};
