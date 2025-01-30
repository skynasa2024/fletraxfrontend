import { Container } from '@/components/container';

import { Toolbar, ToolbarActions, ToolbarHeading } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AddDriverPage } from '.';
import { useNavigate, useParams } from 'react-router';
import { createDriver, DriverDetails, getDriver, updateDriver } from '@/api/drivers';
import { useEffect, useState } from 'react';

const AddDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState<DriverDetails | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getDriver(id).then(setDriver);
    }
  }, [id]);

  return (
    <form
      action={async (data) => {
        const response = driver ? await updateDriver(driver.id, data) : await createDriver(data);
        navigate(`/drivers/driver/${response.id}`);
      }}
    >
      <PageNavbar />

      <Container>
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">
              {driver ? 'Edit Driver' : 'Add Driver'}
            </h1>
          </ToolbarHeading>
          <ToolbarActions>
            <button
              type="button"
              className="text-red-700 hover:text-white border bg-red-100 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              onClick={() => navigate(-1)}
            >
              Discard
            </button>
            <button
              type="submit"
              className="focus:outline-none text-white bg-green-500 w-40 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {driver ? 'Save' : 'Add'}
            </button>
          </ToolbarActions>
        </Toolbar>

        <AddDriverPage driver={driver} />
      </Container>
    </form>
  );
};

export { AddDriver };
