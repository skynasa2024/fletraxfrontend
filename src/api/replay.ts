import { axios } from './axios';
import { ResponseModel } from './response';
import { IntervalType } from './trips';

export interface ReplayDTO {
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
  totalDuration: string;
}

export interface TripRecord extends Omit<ReplayDTO, 'intervalType'> {
  intervalType: IntervalType.Trip;
}

export interface IReplay {
  allData: ReplayDTO[];
  trips: TripRecord[];
  parkings: ParkingRecord[];
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
      totalDuration: item.formatedTotalDuration
    }));

  const trips: TripRecord[] = replay.data.result
    ?.filter((item) => item.intervalType === IntervalType.Trip)
    ?.map((item) => ({
      ...item,
      intervalType: IntervalType.Trip
    }));

  return {
    allData: replay.data.result,
    parkings,
    trips
  };
}
