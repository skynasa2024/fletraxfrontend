import { VehicleList } from './blocks';
import UserMiniCards, { MetricData } from './mini-cards/UserMiniCards.tsx';
import BlocksIcon from './blocks/svg/BlocksIcon.tsx';
import PeopleIcon from './blocks/svg/PeopleIcon.tsx';
import { useEffect, useState } from 'react';
import { getVehiclesStats, VehicleStats } from '@/api/cars.ts';

const VehiclePage = () => {
  const [vehiclesStats, setVehiclesStats] = useState<VehicleStats>({
    total: 0,
    inRent: 0,
    inMaintenance: 0,
    available: 0
  });

  const handleGetVehiclesStats = async () => {
    try {
      const data = await getVehiclesStats();
      setVehiclesStats(data);
    } catch (error) {
      console.error('Failed to fetch vehicle stats:', error);
    }
  };

  useEffect(() => {
    handleGetVehiclesStats();
  }, []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Vehicle List</h3>

        <a href="/vehicles/add-vehicle">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New Vehicle
          </button>
        </a>
      </div>

      <VehiclesMiniCards stats={vehiclesStats} />
      <VehicleList fetchVehicleStats={handleGetVehiclesStats} />
    </div>
  );
};

type VehiclesMiniCardsProps = {
  stats: VehicleStats;
};

const VehiclesMiniCards = ({ stats }: VehiclesMiniCardsProps) => {
  const metrics: MetricData[] = [
    {
      value: stats.total,
      label: 'Total Vehicles',
      textColor: 'text-white',
      bgColor: 'bg-blue-500',
      icon: <BlocksIcon />
    },
    {
      value: stats.inRent,
      label: 'Rented Vehicles',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#FF0000" />
    },
    {
      value: stats.inMaintenance,
      label: 'Vehicles in maintenance',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#FFA800" />
    },
    {
      value: stats.available,
      label: 'Available For Rent',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#5271FF" />
    }
  ];

  return <UserMiniCards metrics={metrics} />;
};

export { VehiclePage };
