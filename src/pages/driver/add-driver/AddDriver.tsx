import { Container } from '@/components/container';

import { Toolbar, ToolbarActions, ToolbarHeading } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AddDriverPage } from '.';
import { useNavigate, useParams } from 'react-router';
import { createDriver, DriverDetails, getDriver, updateDriver } from '@/api/drivers';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { ResponseModel } from '@/api/response';

const AddDriver = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [driver, setDriver] = useState<DriverDetails | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getDriver(id).then(setDriver);
    }
  }, [id]);

  const Actions = () => (
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
  );

  return (
    <form
      className="pb-10"
      action={async (data) => {
        try {
          const response = driver ? await updateDriver(driver.id, data) : await createDriver(data);
          navigate(`/drivers/driver/${response.id}`);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ResponseModel<never>>;
            enqueueSnackbar(axiosError.response?.data.message || 'An error occurred', {
              variant: 'error'
            });
          } else {
            enqueueSnackbar('An error occurred', {
              variant: 'error'
            });
          }
        }
      }}
    >
      <PageNavbar />

      {id && !driver ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">
                {driver ? 'Edit Driver' : 'Add Driver'}
              </h1>
            </ToolbarHeading>
            <Actions />
          </Toolbar>

          <AddDriverPage driver={driver} />

          <div className="flex justify-end pt-6">
            <Actions />
          </div>
        </Container>
      )}
    </form>
  );
};

export { AddDriver };
