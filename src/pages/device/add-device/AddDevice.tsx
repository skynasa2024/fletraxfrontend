import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { DeviceDTO, getDeviceModel, updateDevice, createDevice } from '@/api/devices';
import { AddDevicePage } from './AddDevicePage';

const AddDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [device, setDevice] = useState<DeviceDTO | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getDeviceModel(id).then(setDevice);
    }
  }, [id]);
  return (
    <form
      action={async (data) => {
        const response = device ? await updateDevice(device.id, data) : await createDevice(data);
        navigate(`/devices/device/${response.id}`);
      }}
    >
      <PageNavbar />

      <Container>
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">
              {device ? 'Edit Device' : 'Add Device'}
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
              {device ? 'Save' : 'Add'}
            </button>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <AddDevicePage device={device} />
      </Container>
    </form>
  );
};

export { AddDevice };
