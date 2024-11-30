import React from 'react';
import { EngineHours, Mileage, FuelConsumption, RentedTimes } from '../svg/';

interface MetricCardProps {
  icon: React.ComponentType;  
  label: string;
  value: string | number;
}

interface Metrics {
  engineHours: string;
  mileage: string;
  fuelConsumption: string;
  rentedTimes: string;
}

interface VehicleMetricsProps {
  metrics?: Metrics;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
    <Icon />
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const VehicleMetrics: React.FC<VehicleMetricsProps> = ({ metrics = {
  engineHours: '250 Hr',
  mileage: '157 km',
  fuelConsumption: '9%',
  rentedTimes: '7'
} }) => {
  const metricConfigs: MetricCardProps[] = [
    { icon: EngineHours, label: 'Engine Hours', value: metrics.engineHours },
    { icon: Mileage, label: 'Mileage', value: metrics.mileage },
    { icon: FuelConsumption, label: 'Fuel Consumption', value: metrics.fuelConsumption },
    { icon: RentedTimes, label: 'Rented times', value: metrics.rentedTimes }
  ];

  return (
    <div className="w-2/3 grid grid-cols-4 gap-4">
      {metricConfigs.map((config, index) => (
        <MetricCard key={index} {...config} />
      ))}
    </div>
  );
};

export default VehicleMetrics;