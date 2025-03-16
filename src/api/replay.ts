import { axios } from './axios';
import { ResponseModel } from './response';
import { IntervalType } from './trips';

interface ReplayDTO {
  id: string;
  ident: string;
  deviceId: string | null;
  vehiclePlate: string | null;
  vehicleId: string | null;
  userId: string | null;
  intervalType: IntervalType;
  startTime: number;
  endTime: number;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  pointsList: ReplayPoint[];
  totalDistance: number;
  foramtedTotalDistance: string;
  totalDuration: number;
  formatedTotalDuration: string;
  maxSpeed: number;
  formatedMaxSpeed: string;
  averageSpeed: number;
  formatedAverageSpeed: string;
  route: string | null;
}

export interface ParkingRecord {
  id: string;
  startTime: number;
  endTime: number;
  startLatitude: number;
  startLongitude: number;
  totalDuration: number;
}

export interface TripRecord extends Omit<ReplayDTO, 'intervalType'> {
  intervalType: IntervalType.Trip;
}

export interface IReplay {
  parkings: ParkingRecord[];
  replays: TripRecord[];
  completePath: ReplayPoint[];
}

export interface ReplayPoint {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number;
  direction: number;
}

export interface SearchTripsParams {
  ident: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

export async function searchReplays(params: SearchTripsParams): Promise<IReplay> {
  const replay = await axios.get<ResponseModel<ReplayDTO[]>>('/api/intervals/replay', {
    params: {
      ...params
    }
  });

  const parkings: ParkingRecord[] = replay.data.result
    ?.filter((item) => item.intervalType === IntervalType.Parking)
    ?.map((item) => ({
      id: item.id,
      startTime: new Date(item.startTime * 1000).getTime(),
      endTime: new Date(item.endTime * 1000).getTime(),
      startLatitude: item.startLatitude,
      startLongitude: item.startLongitude,
      totalDuration: item.totalDuration
    }));

  const replays: TripRecord[] = replay.data.result
    ?.filter((item) => item.intervalType === IntervalType.Trip)
    ?.map((item) => ({
      ...item,
      intervalType: IntervalType.Trip
    }));

  const completePath: ReplayPoint[] = replays
    ?.reduce((acc, replay) => {
      const path = replay.pointsList.map((point) => ({
        ...point,
        timestamp: new Date(point.timestamp * 1000).getTime()
      }));
      return [...acc, ...path];
    }, [] as ReplayPoint[])
    .sort((a, b) => a.timestamp - b.timestamp);

  return {
    parkings: parkings,
    replays: replays,
    completePath: completePath
  };
}
