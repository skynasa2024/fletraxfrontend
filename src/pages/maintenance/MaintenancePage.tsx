import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceMiniCards } from './mini-cards/MaintenanceMiniCards';
import { getMaintenanceStats, IMaintenanceStats } from '@/api/maintenance.ts';
import { MaintenanceList } from '@/pages/maintenance/MaintenanceList';
import { Container } from '@/components';

const MaintenancePage = () => {
  const [stats, setStats] = useState<IMaintenanceStats>();

  const fetchStats = () => {
    getMaintenanceStats().then(setStats);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Fragment>
      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-800">Maintenance</h3>
            <Link to="/maintenance/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
              New Maintenance
            </Link>
          </div>
          <MaintenanceMiniCards stats={stats} />
          <MaintenanceList fetchStats={fetchStats} />
        </div>
      </Container>
    </Fragment>
  );
};

export { MaintenancePage };
