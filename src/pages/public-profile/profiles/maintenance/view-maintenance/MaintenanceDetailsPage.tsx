import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { deleteMaintenance, getMaintenanceById, MaintenanceModel } from '@/api/maintenance.ts';
import { PageNavbar } from '@/pages/account';
import { Container } from '@/components';
import { ArrowLeftIcon } from 'lucide-react';
import { DeleteIcon, EditIcon } from '@/pages/driver/svg';
import { format } from 'date-fns';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate.tsx';

const MaintenanceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [model, setModel] = useState<MaintenanceModel>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMaintenanceById(id)
        .then((response) => {
          const { result } = response.data;
          if (result) {
            setModel(result);
          }
        })
        .catch(() => {
          navigate('/error/404');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, navigate]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    if (id) {
      deleteMaintenance(id)
        .then((response) => {
          navigate('/maintenance');
          enqueueSnackbar(response.data.message, {
            variant: response.data.success ? 'success' : 'error'
          });
        })
        .catch((error) => {
          enqueueSnackbar(error.message || 'An error occurred', {
            variant: 'error'
          });
        });
    }
  };

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <div className="flex justify-between items-center gap-6">
          <h1 className="text-xl font-medium leading-none text-gray-900">Maintenance Details</h1>
          <div className="flex justify-end items-center gap-2 flex-wrap p-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-blue-500 rounded-md">
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <Link to={`/maintenance/edit/${id}`}>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
                <EditIcon className="w-4 h-4" /> Edit
              </button>
            </Link>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md"
              onClick={handleDelete}>
              <DeleteIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto pt-4">
            <div className="rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-6 mb-8 border rounded-lg p-8">
                <img
                  src={model?.vehicleImage}
                  alt="Vehicle"
                  className="w-48 h-36 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h2 className="text-xl font-medium text-gray-800">{model?.vehicleBrand ?? 'null'}</h2>
                      <p className="text-gray-500">{model?.vehicleModel ?? 'null'}</p>
                    </div>
                    <CarPlate plate={model?.vehiclePlate} />
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-md border border-gray-300 text-green-500 capitalize">{model?.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 pt-4">
                    <div className="border border-dashed rounded-lg border-gray-300 p-4">
                      <p className="text-gray-800 font-semibold">
                        {model?.startDate ? format(new Date(model.startDate), 'yyyy-MM-dd') : ''}
                      </p>
                      <p className="text-red-500 text-sm mb-1">Start Date</p>
                    </div>

                    <div className="border border-dashed  rounded-lg  border-gray-300 p-4">
                      <p className="text-gray-800 font-semibold">
                        {model?.startDate ? format(new Date(model.endDate!), 'yyyy-MM-dd') : ''}
                      </p>
                      <p className="text-green-500 text-sm mb-1">Finished Date</p>
                    </div>

                    <div className="border border-dashed  rounded-lg border-gray-300 p-4">
                      <p className="text-gray-800 font-semibold">{model?.amount} $</p>
                      <p className="text-gray-500 text-sm mb-1">Price</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg border p-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Information</h3>
                <div className="divide-y divide-gray-200">
                  <div className="py-4 grid grid-cols-[100px,1fr] gap-4">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-800">{model?.type}</span>
                  </div>

                  <div className="py-4 grid grid-cols-[100px,1fr] gap-4">
                    <span className="text-gray-500">Supplier</span>
                    <span className="text-gray-800">{model?.supplier}</span>
                  </div>

                  <div className="py-4 grid grid-cols-[100px,1fr] gap-4">
                    <span className="text-gray-500">Description</span>
                    <p className="text-gray-800">{model?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Fragment>
  );
};

export default MaintenanceDetails;
