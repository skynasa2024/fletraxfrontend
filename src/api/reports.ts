import { axios } from './axios';
import { Paginated } from './common';
import { PaginatedResponseModel } from './response';
import { IntervalType } from './trips';

interface StatisticsReportDTO {
  id: string;
  ident: string;
  date: string;
  deviceId: string;
  vehiclePlate: string;
  vehicleId: string;
  userId: string | null;
  dailyExistingKilometers: string;
  weeklyExistingKilometers: string;
  monthlyExistingKilometers: string;
  yearlyExistingKilometers: string;
  totalExistingKilometers: string;
  existingKilometers: string;
  dailyParkingTime: string;
  weeklyParkingTime: string;
  monthlyParkingTime: string;
  yearlyParkingTime: string;
  totalParkingTime: string;
  parkingTime: string;
  dailyEngineHours: string;
  weeklyEngineHours: string;
  monthlyEngineHours: string;
  yearlyEngineHours: string;
  totalEngineHours: string;
  engineHours: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface StatisticsReport {
  id: string;
  ident: string;
  plate: string;
  date: string;
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  total: string;
}

export type StatisticsReportParams = {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  type: 'Mileage' | 'EngineHours';
  pageIndex: number;
  pageSize: number;
  sort?: string;
};

export async function getStatisticsReport(
  params: StatisticsReportParams
): Promise<Paginated<StatisticsReport>> {
  const statistics = await axios.get<PaginatedResponseModel<StatisticsReportDTO>>(
    `/api/statistics/reports`,
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        vehicleId: params.vehicleId,
        startDate: params.startDate,
        endDate: params.endDate,
        sort: params.sort || 'date,desc'
      }
    }
  );
  return {
    data: statistics.data.result.content.map((stat) => {
      if (params.type === 'Mileage') {
        return {
          id: stat.id,
          ident: stat.ident,
          plate: stat.vehiclePlate,
          date: stat.date,
          daily: stat.dailyExistingKilometers,
          weekly: stat.weeklyExistingKilometers,
          monthly: stat.monthlyExistingKilometers,
          yearly: stat.yearlyExistingKilometers,
          total: stat.totalExistingKilometers
        };
      }
      if (params.type === 'EngineHours') {
        return {
          id: stat.id,
          ident: stat.ident,
          plate: stat.vehiclePlate,
          date: stat.date,
          daily: stat.dailyEngineHours,
          weekly: stat.weeklyEngineHours,
          monthly: stat.monthlyEngineHours,
          yearly: stat.yearlyEngineHours,
          total: stat.totalEngineHours
        };
      }
      throw new Error(`Unexpected statistics type: ${params.type}`);
    }),
    totalCount: statistics.data.result.totalElements
  };
}

interface TripsAndParkingReportDTO {
  id: string;
  ident: string;
  deviceId: string;
  vehiclePlate: string;
  vehicleId: string;
  userId: string | null;
  intervalType: IntervalType;
  startTime: number;
  endTime: number;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  pointsList: any[];
  totalDistance: number;
  foramtedTotalDistance: string;
  totalDuration: number;
  formatedTotalDuration: string;
  maxSpeed: number;
  formatedMaxSpeed: string;
  averageSpeed: number;
  formatedAverageSpeed: string;
  route: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITripsAndParkingReport {
  id: string;
  ident: string;
  plate: string;
  intervalType: string;
  startTime: number;
  endTime: number;
  totalDistance: string;
  totalDuration: string;
  maxSpeed: string;
}

export type TripsAndParkingReportParams = {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  intervalType: IntervalType;
  pageIndex: number;
  pageSize: number;
  sort?: string;
};

export async function getTripsAndParkingReport(
  params: TripsAndParkingReportParams
): Promise<Paginated<ITripsAndParkingReport>> {
  const report = await axios.get<PaginatedResponseModel<TripsAndParkingReportDTO>>(
    `/api/intervals/reports`,
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        vehicleId: params.vehicleId,
        startDate: params.startDate,
        endDate: params.endDate,
        intervalType: params.intervalType || IntervalType.Trip,
        sort: params.sort || 'startTime,desc'
      }
    }
  );

  return {
    data: report.data.result.content.map((item) => ({
      id: item.id,
      ident: item.ident,
      plate: item.vehiclePlate,
      intervalType: item.intervalType === IntervalType.Trip ? 'Trip' : 'Parking',
      startTime: item.startTime,
      endTime: item.endTime,
      totalDistance: item.foramtedTotalDistance,
      totalDuration: item.formatedTotalDuration,
      maxSpeed: item.formatedMaxSpeed
    })),
    totalCount: report.data.result.totalElements
  };
}

interface AlarmReportDTO {
  id: string;
  type: string;
  text: string;
  typeTrans: string;
  textTrans: string;
  userId: string | null;
  deviceId: string;
  deviceIdent: string;
  vehicleId: string;
  vehiclePlate: string;
  geofenceId: string | null;
  geofenceName: string | null;
  latitude: number;
  longitude: number;
  createdAt: number;
  read: boolean;
}

export interface IAlarmReport {
  id: string;
  ident: string;
  plate: string;
  date: string;
  type: string;
}

export type AlarmReportParams = {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  pageIndex: number;
  pageSize: number;
  sort?: string;
};

export async function getAlarmReport(params: AlarmReportParams): Promise<Paginated<IAlarmReport>> {
  const report = await axios.get<PaginatedResponseModel<AlarmReportDTO>>(
    `/api/notifications/reports`,
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        vehicleId: params.vehicleId,
        startDate: params.startDate,
        endDate: params.endDate,
        sort: params.sort || 'createdAt,desc'
      }
    }
  );

  return {
    data: report.data.result.content.map((item) => ({
      id: item.id,
      ident: item.deviceIdent,
      plate: item.vehiclePlate,
      date: new Date(item.createdAt * 1000).toLocaleString(),
      type: item.textTrans
    })),
    totalCount: report.data.result.totalElements
  };
}
