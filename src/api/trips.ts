import { format } from 'date-fns';
import { axios } from './axios';
import { OffsetBounds } from './common';
import { ResponseModel } from './response';

interface TripGroupsDTO {
  [key: string]: TripDTO[];
}

interface TripDTO {
  id: number;
  ident: string;
  intervalType: string;
  startTime: string;
  endTime: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  totalDistance: number;
  formattedTotalDistance: string;
  pointsList: TripPoint[];
  totalDuration: number;
  formattedTotalDuration: string;
  maxSpeed: number;
  averageSpeed: string;
  route: string;
}

interface TripPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number;
  direction: number;
}

export interface Trip {
  id: number;
  imei: string;
  startDate: Date;
  endDate: Date;
  mileage: number;
  maxSpeed: number;
  path: TripPath[];
}

export interface TripPath {
  tripId: number;
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
  offset?: OffsetBounds;
}

export const searchTrips = async ({
  query,
  startDate,
  endDate
}: SearchTripsParams): Promise<TripGroup[]> => {
  const trips = await axios.get<ResponseModel<TripGroupsDTO>>('/api/intervals/search', {
    params: {
      ident: query,
      startDate: startDate && format(startDate, 'yyyy-MM-dd'),
      endDate: endDate && format(endDate, 'yyyy-MM-dd'),
      startTime: startDate && format(startDate, 'HH:mm:ss'),
      endTime: endDate && format(endDate, 'HH:mm:ss'),
      sort: 'startTime,desc'
    }
  });

  return Object.entries(trips.data.result).map(([date, tripGroup]) => ({
    id: date,
    date: new Date(date),
    trips: tripGroup
      .map((trip) => ({
        id: trip.id,
        imei: trip.ident,
        startDate: new Date(trip.startTime),
        endDate: new Date(trip.endTime),
        mileage: trip.totalDistance,
        maxSpeed: trip.maxSpeed,
        path: trip.pointsList.map((point) => ({
          tripId: trip.id,
          latitude: point.latitude,
          longitude: point.longitude,
          direction: point.direction,
          speed: point.speed,
          timestamp: new Date(point.timestamp * 1000)
        }))
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }));
};
