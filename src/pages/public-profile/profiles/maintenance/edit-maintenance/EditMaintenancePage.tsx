import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { ArrowLeftIcon } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { deleteMaintenance, getMaintenanceById, MaintenanceModel, updateMaintenance } from '@/api/maintenance.ts';
import {
  MaintenanceTypeDropdownSearch,
  MaintenanceVehicleDropdownSearch
} from '@/pages/public-profile/profiles/maintenance/components';
import { DeleteIcon } from '@/pages/driver/svg';
import { useParams } from 'react-router';

const EditMaintenancePage = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('ongoing');
  const formRef = useRef<HTMLFormElement | null>(null);
  const [model, setModel] = useState<MaintenanceModel>();

  useEffect(() => {
    if (id) {
      getMaintenanceById(id)
        .then((response) => {
          setModel(response.data.result);
          setSelectedStatus(response.data.result.status);
        })
        .catch(() => {
          navigate('/error/404');
        });
    }
  }, [id, navigate]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('startDate', formData.get('startDate') + 'T00:00:00');
    formData.set('endDate', formData.get('endDate') + 'T00:00:00');
    formData.set('status', selectedStatus);
    formData.set('id', id);

    updateMaintenance(formData)
      .then((response) => {
        enqueueSnackbar(response.data.message, {
          variant: response.data.success ? 'success' : 'error'
        });

        if (response.data.success && formRef.current) {
          setModel(response.data.result);
          setSelectedStatus(response.data.result.status);
          formRef.current.reset();
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.message, {
          variant: 'error'
        });
      });
  };

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
          <h1 className="text-xl font-medium leading-none text-gray-900">Edit Maintenance</h1>
          <div className="flex justify-end items-center gap-2 flex-wrap p-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-blue-500 rounded-md">
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md"
              onClick={handleDelete}
            >
              <DeleteIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto pt-6">
          <div className="card pb-2.5">
            <div className="card-header" id="maintenance_settings">
              <h3 className="card-title">Maintenance</h3>
            </div>

            <form onSubmit={handleSubmit} className="card-body grid gap-5">
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2.5">
                  <label className="form-label">Vehicle</label>
                  <MaintenanceVehicleDropdownSearch
                    initialSearch={{
                      id: model?.vehicleId,
                      plate: model?.vehiclePlate
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="form-label">Maintenance Type</label>
                  <MaintenanceTypeDropdownSearch
                    initialSearch={{
                      title: model?.type!,
                      code: model?.type!
                    }}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2.5">
                  <label className="form-label">Start Date</label>
                  <input
                    required
                    type="date"
                    className="input w-full"
                    name="startDate"
                    placeholder="DD/MM/YYYY"
                    // @ts-ignore
                    value={model?.startDate.slice(0, 10)}
                    // @ts-ignore
                    onChange={(e) => setModel({ ...model, startDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="form-label">End Date</label>
                  <input
                    required
                    type="date"
                    className="input w-full"
                    name="endDate"
                    placeholder="DD/MM/YYYY"
                    // @ts-ignore
                    value={model?.endDate.slice(0, 10)}
                    // @ts-ignore
                    onChange={(e) => setModel({ ...model, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="grid gap-2.5">
                  <label className="form-label">Supplier</label>
                  <input
                    required
                    type="text"
                    id="supplier"
                    name="supplier"
                    className="input"
                    placeholder="Supplier"
                    defaultValue={model?.supplier}
                  />
                </div>
                <div className="grid gap-2.5">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="input"
                    placeholder="1 $"
                    defaultValue={model?.amount!}
                  />
                </div>
              </div>

              <div className="w-full grid gap-2.5">
                <div className="grid gap-2.5">
                  <label className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="input p-2 max-h-[100px] min-h-[50px]"
                    placeholder="Description"
                    rows={4}
                    defaultValue={model?.description}
                  ></textarea>
                </div>

                <div className="w-full grid gap-2.5">
                  <label className="form-label col-span-6">Status</label>
                  <div className={`flex items-center gap-2 p-2 rounded-md border border-dashed hover:bg-gray-100 transition-colors
                    ${selectedStatus === 'ongoing' ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      id="ongoing"
                      checked={selectedStatus === 'ongoing'}
                      onChange={() => setSelectedStatus('ongoing')}
                      className="hidden"
                    />
                    <label htmlFor="ongoing" className="flex items-center gap-2 cursor-pointer w-full">
                      <div className={`w-4 h-4 rounded-full bg-gray-200
                        ${selectedStatus === 'ongoing' ? 'border-4 border-blue-500' : 'border-2 border-gray-300'}`} />
                      <span className="text-yellow-500">Ongoing</span>
                    </label>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-md border border-dashed hover:bg-gray-100 transition-colors
                    ${selectedStatus === 'finished' ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      id="finished"
                      checked={selectedStatus === 'finished'}
                      onChange={() => setSelectedStatus('finished')}
                      className="hidden"
                    />
                    <label htmlFor="finished" className="flex items-center gap-2 cursor-pointer w-full">
                      <div className={`w-4 h-4 rounded-full bg-gray-200
                        ${selectedStatus === 'finished' ? 'border-4 border-blue-500' : 'border-2 border-gray-300'}`} />
                      <span className="text-green-500">Finished</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export { EditMaintenancePage };
