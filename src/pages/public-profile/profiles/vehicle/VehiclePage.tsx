import { useNavigate } from 'react-router';
import { VehicleList } from './blocks';
import UserMiniCards, { MetricData } from './mini-cards/UserMiniCards';
import BlocksIcon from './blocks/svg/BlocksIcon';
import PeopleIcon from './blocks/svg/PeopleIcon';
import { useEffect, useState } from 'react';
import { getVehiclesStats, VehicleStats } from '@/api/cars';

const VehiclePage = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <h3 className="font-bold text-xl text-gray-800">Vehicle List</h3>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto"
        onClick={() => navigate('/vehicles/add-vehicle')}
      >
        New Vehicle
      </button>

      <VehiclesMiniCards />
      <VehicleList />
    </div>
  );
};

const VehiclesMiniCards = () => {
  const [vehiclesStats, setVehiclesStats] = useState<VehicleStats>({
    total: 0,
    available: 0,
    inRent: 0,
    inMaintenance: 0
  });

  const metrics: MetricData[] = [
    {
      value: vehiclesStats.total,
      label: 'Total Vehicles',
      textColor: 'text-white',
      bgColor: 'bg-blue-500',
      icon: <BlocksIcon />
    },
    {
      value: vehiclesStats.inRent,
      label: 'Rented Vehicles',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#FF0000" />
    },
    {
      value: vehiclesStats.inMaintenance,
      label: 'Vehicles in maintenance',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#FFA800" />
    },
    {
      value: vehiclesStats.available,
      label: 'Available For Rent',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#5271FF" />
    }
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await getVehiclesStats();
        setVehiclesStats(data);
      } catch (error) {
        console.error('Failed to fetch vehicle stats:', error);
      }
    })();
  }, []);

  return <UserMiniCards metrics={metrics} />;
};

export { VehiclePage };
