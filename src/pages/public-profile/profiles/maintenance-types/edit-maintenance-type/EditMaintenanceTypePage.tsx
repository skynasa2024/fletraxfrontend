import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  deleteMaintenanceType,
  getMaintenanceTypeById,
  MaintenanceTypeModel,
  updateMaintenanceType
} from '@/api/maintenance-type.ts';
import { useParams } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { DeleteIcon } from '@/pages/driver/svg';

const EditMaintenanceTypePage = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [model, setModel] = useState<MaintenanceTypeModel>();

  useEffect(() => {
    if (id) {
      getMaintenanceTypeById(id)
        .then((response) => {
          setModel(response.data.result);
        }).catch(() => {
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
    formData.set('id', id);
    updateMaintenanceType(formData)
      .then((response) => {
        enqueueSnackbar(response.data.message, {
          variant: response.data.success ? 'success' : 'error'
        });

        if (response.data.success && formRef.current) {
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
    deleteMaintenanceType(id).then(response => {
      navigate('/maintenance/maintenance-type');
      enqueueSnackbar(response.data.message, {
        variant: response.data.success ? 'success' : 'error'
      });
    }).catch(error => {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    });
  };

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <div className="flex justify-between items-center gap-6">
          <h1 className="text-xl font-medium leading-none text-gray-900">Edit Maintenance Type</h1>
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
        <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
          <div className="card">
            <div className="card-header" id="maintenance_settings">
              <h3 className="card-title">Maintenance Type</h3>
            </div>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="card-body grid gap-5 py-10"
            >
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="grid gap-2.5">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input"
                    placeholder="title"
                    value={model?.title}
                    onChange={(e) => setModel({ ...model, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-2.5">
                  <label className="form-label">Code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="input"
                    placeholder="code"
                    value={model?.code}
                    onChange={(e) => setModel({ ...model, code: e.target.value })}
                  />
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

export { EditMaintenanceTypePage };
