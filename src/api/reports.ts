import { axios } from './axios';
import { Paginated } from './common';
import { PaginatedResponseModel } from './response';

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

type StatisticsReportParams = {
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
