import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceMiniCards } from './mini-cards/MaintenanceMiniCards';
import { getMaintenanceStats, IMaintenanceStats } from '@/api/maintenance.ts';
import { MaintenanceList } from '@/pages/public-profile/profiles/maintenance/blocks/MaintenanceList.tsx';

const MaintenancePage = () => {

  const [stats, setStats] = useState<IMaintenanceStats>();

  const fetchStats = () => {
    getMaintenanceStats().then(setStats);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Maintenance List</h3>

        <Link to="/maintenance/add-maintenance"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
          New Maintenance
        </Link>
      </div>

      <MaintenanceMiniCards stats={stats} />
      <MaintenanceList fetchStats={fetchStats} />
    </div>
  );
};

export { MaintenancePage };
