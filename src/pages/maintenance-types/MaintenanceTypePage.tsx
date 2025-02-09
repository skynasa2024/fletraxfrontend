import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { MaintenanceTypeList } from './MaintenanceTypeList.tsx';

const MaintenanceTypePage = () => {
  return (
    <Fragment>
      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-800">Maintenance Types</h3>
            <Link
              to="/maintenance/maintenance-type/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto"
            >
              New Maintenance Type
            </Link>
          </div>
          <MaintenanceTypeList />
        </div>
      </Container>
    </Fragment>
  );
};

export { MaintenanceTypePage };
