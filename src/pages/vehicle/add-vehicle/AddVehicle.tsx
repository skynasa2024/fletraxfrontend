import { Fragment } from 'react';
import { Container } from '@/components/container';

import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AddVehiclePage } from '.';
import { useLayout } from '@/providers';
import { useNavigate, useParams } from 'react-router';

const AddVehicle = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  return (
    <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
            </ToolbarHeading>
            <ToolbarActions>
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="text-red-700 hover:text-white border bg-red-100 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Discard
              </button>
              <button
                type="button"
                className="focus:outline-none text-white bg-green-500 w-40 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                {vehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AddVehiclePage />
      </Container>
    </Fragment>
  );
};

export { AddVehicle };
