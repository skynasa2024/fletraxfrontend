import React from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceTable } from './blocks';
import { MaintenanceMiniCards } from './mini-cards/MaintenanceMiniCards';

const MaintenancePage = () => {

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Maintenance List</h3>

        <Link to="/maintenance/add-maintenance" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
          New Maintenance
        </Link>
      </div>

      <MaintenanceMiniCards />
      <MaintenanceTable />
    </div>
  );
};

export { MaintenancePage };
