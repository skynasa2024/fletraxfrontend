import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { EngineHours, Mileage, FuelConsumption } from '../svg';
import { useIntl } from 'react-intl';
import { useSettings } from '@/providers';

interface MetricCardProps {
  icon: React.ComponentType;
  label: string;
  value: string | number;
  percentage: number;
  color: string;
}

interface Metrics {
  engineHours: string;
  mileage: string;
  fuelConsumption: string;
}

interface VehicleMetricsProps {
  metrics?: Metrics;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, percentage, color }) => {
  const { settings } = useSettings();
  return (
    <div className="card hover:shadow-md p-4 rounded-lg text-center flex flex-col items-center justify-center flex-1">
      <div className="mb-2">
        <Icon />
      </div>
      <p className="text-lg font-medium text-gray-900 m-2">{label}</p>
      <div className="w-24 h-24 mb-3">
        <CircularProgressbar
          value={percentage}
          text={value.toString()}
          styles={buildStyles({
            textSize: '14px',
            pathColor: color,
            textColor: settings.themeMode === 'dark' ? '#E5E7EB' : '#374151',
            trailColor: settings.themeMode === 'dark' ? '#374151' : '#D1D5DB',
            pathTransitionDuration: 0.5
          })}
        />
      </div>
    </div>
  );
};

const VehicleMetrics: React.FC<VehicleMetricsProps> = ({
  metrics = {
    engineHours: '250 Hr',
    mileage: '157 km',
    fuelConsumption: '9%',
    rentedTimes: '7'
  }
}) => {
  const intl = useIntl();

  const metricConfigs: MetricCardProps[] = [
    {
      icon: EngineHours,
      label: intl.formatMessage({ id: 'VEHICLE.METRICS.ENGINE_HOURS' }),
      value: metrics.engineHours,
      percentage: 70,
      color: '#F87171'
    },
    {
      icon: Mileage,
      label: intl.formatMessage({ id: 'VEHICLE.METRICS.MILEAGE' }),
      value: metrics.mileage,
      percentage: 80,
      color: '#60A5FA'
    },
    {
      icon: FuelConsumption,
      label: intl.formatMessage({ id: 'VEHICLE.METRICS.FUEL_CONSUMPTION' }),
      value: metrics.fuelConsumption,
      percentage: 25,
      color: '#A78BFA'
    }
  ];

  return (
    <div className="flex gap-4 w-2/3">
      {metricConfigs.map((config, index) => (
        <MetricCard key={index} {...config} />
      ))}
    </div>
  );
};

export default VehicleMetrics;
