import { axios } from './axios';
import { Paginated } from './common';
import { PaginatedResponseModel } from './response';
import { IntervalType } from './trips';
import { format } from 'date-fns';

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

export interface MileageStatisticsReport {
  id: string;
  ident: string;
  vehiclePlate: string;
  date: string;
  dailyExistingKilometers: string;
  weeklyExistingKilometers: string;
  monthlyExistingKilometers: string;
  yearlyExistingKilometers: string;
  totalExistingKilometers: string;
}

export interface EngineHoursStatisticsReport {
  id: string;
  ident: string;
  vehiclePlate: string;
  date: string;
  dailyEngineHours: string;
  weeklyEngineHours: string;
  monthlyEngineHours: string;
  yearlyEngineHours: string;
  totalEngineHours: string;
}

type StatisticsReport = MileageStatisticsReport | EngineHoursStatisticsReport;

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
          vehiclePlate: stat.vehiclePlate,
          date: stat.date,
          dailyExistingKilometers: stat.dailyExistingKilometers,
          weeklyExistingKilometers: stat.weeklyExistingKilometers,
          monthlyExistingKilometers: stat.monthlyExistingKilometers,
          yearlyExistingKilometers: stat.yearlyExistingKilometers,
          totalExistingKilometers: stat.totalExistingKilometers
        };
      }
      if (params.type === 'EngineHours') {
        return {
          id: stat.id,
          ident: stat.ident,
          vehiclePlate: stat.vehiclePlate,
          date: stat.date,
          dailyEngineHours: stat.dailyEngineHours,
          weeklyEngineHours: stat.weeklyEngineHours,
          monthlyEngineHours: stat.monthlyEngineHours,
          yearlyEngineHours: stat.yearlyEngineHours,
          totalEngineHours: stat.totalEngineHours
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
  vehiclePlate: string;
  intervalType: string;
  startTime: number;
  endTime: number;
  foramtedTotalDistance: string;
  formatedTotalDuration: string;
  formatedMaxSpeed: string;
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
        intervalType: params.intervalType,
        sort: params.sort || 'startTime,desc'
      }
    }
  );

  return {
    data: report.data.result.content.map((item) => ({
      id: item.id,
      ident: item.ident,
      vehiclePlate: item.vehiclePlate,
      intervalType: item.intervalType === IntervalType.Trip ? 'Trip' : 'Parking',
      startTime: item.startTime,
      endTime: item.endTime,
      foramtedTotalDistance: item.foramtedTotalDistance,
      formatedTotalDuration: item.formatedTotalDuration,
      formatedMaxSpeed: item.formatedMaxSpeed
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
  deviceIdent: string;
  vehiclePlate: string;
  createdAt: string;
  type: string;
}

export type AlarmReportParams = {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  pageIndex: number;
  pageSize: number;
  sort?: string;
  alarmCode?: string;
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
        sort: params.sort || 'createdAt,desc',
        alarmCode: params.alarmCode
      }
    }
  );

  return {
    data: report.data.result.content.map((item) => ({
      id: item.id,
      deviceIdent: item.deviceIdent,
      vehiclePlate: item.vehiclePlate,
      createdAt: format(new Date(item.createdAt * 1000), 'yyyy/MM/dd HH:mm:ss'),
      type: item.textTrans
    })),
    totalCount: report.data.result.totalElements
  };
}

type MaxSpeedParams = {
  pageIndex: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  sort: string;
  ident: string;
  minSpeed?: number;
};

export interface IMaxSpeedReport {
  ident: string;
  plate: string;
  timestamp: string;
  ignitionStatus: boolean;
  positionLatitude: number;
  positionLongitude: number;
  positionDirection: number;
  positionSpeed: number;
}

export async function getMaxSpeedReport(
  params: MaxSpeedParams
): Promise<Paginated<IMaxSpeedReport>> {
  const report = await axios.get<PaginatedResponseModel<IMaxSpeedReport>>(
    '/api/messages/max_speed_reports',
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        startDate: params.startDate,
        endDate: params.endDate,
        startTime: params.startTime,
        endTime: params.endTime,
        sort: params.sort,
        ident: params.ident,
        minSpeed: params.minSpeed
      }
    }
  );

  return {
    data: report.data.result.content.map((item) => ({
      ident: item.ident,
      plate: item.plate,
      timestamp: format(new Date(item.timestamp), 'yyyy/MM/dd HH:mm:ss'),
      ignitionStatus: item.ignitionStatus,
      positionLatitude: item.positionLatitude,
      positionLongitude: item.positionLongitude,
      positionDirection: item.positionDirection,
      positionSpeed: item.positionSpeed
    })),
    totalCount: report.data.result.totalElements
  };
}

export const exportMaxSpeedReport = async (params: MaxSpeedParams): Promise<Blob> => {
  const response = await axios.get<Blob>('/api/messages/export', {
    responseType: 'blob',
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      startTime: params.startTime,
      endTime: params.endTime,
      ident: params.ident,
      minSpeed: params.minSpeed,
      sort: params.sort,
      page: params.pageIndex,
      size: params.pageSize,
      reportType: 'max_speed'
    }
  });
  return response.data;
};
