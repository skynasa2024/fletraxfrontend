import { faker } from '@faker-js/faker';

export interface Trip {
  id: string;
  imei: string;
  startDate: Date;
  endDate: Date;
  mileage: number;
  maxSpeed: number;
}

export interface TripPath {
  tripId: string;
  latitude: number;
  longitude: number;
  direction: number;
  speed: number;
  timestamp: Date;
}

export interface TripGroup {
  id: string;
  trips: Trip[];
  date: Date;
}

export interface SearchTripsParams {
  query: string;
  startDate?: Date;
  endDate?: Date;
}

export const searchTrips = async ({
  query,
  startDate,
  endDate
}: SearchTripsParams): Promise<TripGroup[]> => {
  const numberOfTripGroups = faker.number.int({ min: 1, max: 5 });
  return Array(numberOfTripGroups)
    .fill(0)
    .map(() => {
      const numberOfTrips = faker.number.int({ min: 1, max: 5 });
      const date = faker.date.recent({ days: 7 });
      return {
        id: faker.string.uuid(),
        date,
        trips: Array(numberOfTrips)
          .fill(0)
          .map(() => ({
            id: faker.string.uuid(),
            imei: faker.phone.imei(),
            startDate: faker.date.recent({ refDate: date }),
            endDate: faker.date.recent({ refDate: date }),
            mileage: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
            maxSpeed: faker.number.int({ min: 0, max: 100 })
          }))
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getTripPath = async (trip: Trip): Promise<TripPath[]> => {
  const numberOfPoints = faker.number.int({ min: 10, max: 50 });
  const location = faker.location.nearbyGPSCoordinate({
    origin: [38.9637, 33.2433],
    radius: 200
  });
  let timestamp = trip.startDate;
  return Array(numberOfPoints)
    .fill(0)
    .map((_, _i) => {
      const stop = faker.location.nearbyGPSCoordinate({
        origin: location,
        radius: 10
      });
      // Add 10 to 60 seconds to the timestamp
      timestamp = new Date(timestamp.getTime() + faker.number.int({ min: 10, max: 60 }) * 1000);
      return {
        tripId: trip.id,
        latitude: stop[0],
        longitude: stop[1],
        direction: faker.number.int({ min: 0, max: 360 }),
        speed: faker.number.int({ min: 0, max: 100 }),
        timestamp
      };
    });
};

export const getTripGroupPath = async (tripGroup: TripGroup): Promise<TripPath[]> => {
  const tripPaths = await Promise.all(
    tripGroup.trips.map(async (trip) => {
      return getTripPath(trip);
    })
  );
  return tripPaths.flat();
};
