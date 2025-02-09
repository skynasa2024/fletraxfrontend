import { Container } from '@/components/container';

import { Toolbar, ToolbarActions, ToolbarHeading } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AddMaintenanceTypePage } from './AddMaintenanceTypePage';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import {
  createMaintenanceType,
  getMaintenanceTypeById,
  MaintenanceTypeModel,
  updateMaintenanceType
} from '@/api/maintenance-type';

const AddMaintenanceType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [type, setType] = useState<MaintenanceTypeModel | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getMaintenanceTypeById(id).then((response) => {
        setType(response.data.result);
      });
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
        {type ? 'Save' : 'Add'}
      </button>
    </ToolbarActions>
  );

  return (
    <form
      className="pb-10"
      action={async (data) => {
        const response =
          type && type.id
            ? await updateMaintenanceType(type.id, data)
            : await createMaintenanceType(data);
        navigate(`/maintenance/maintenance-type/view/${response.id}`);
      }}
    >
      <PageNavbar />

      {id && !type ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">
                {type ? 'Edit Type' : 'Add Type'}
              </h1>
            </ToolbarHeading>
            <Actions />
          </Toolbar>

          <AddMaintenanceTypePage type={type} />

          <div className="flex justify-end pt-6">
            <Actions />
          </div>
        </Container>
      )}
    </form>
  );
};

export { AddMaintenanceType };
