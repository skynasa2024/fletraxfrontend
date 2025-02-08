import React, { Fragment, useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { Link, useNavigate } from 'react-router-dom';
import { deleteMaintenanceType, getMaintenanceTypeById } from '@/api/maintenance-type.ts';
import { useParams } from 'react-router';
import { DeleteIcon, EditIcon } from '@/pages/driver/svg';
import { ArrowLeftIcon } from 'lucide-react';
import { useSnackbar } from 'notistack';

const MaintenanceTypeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    code: ''
  });

  useEffect(() => {
    if (id) {
      getMaintenanceTypeById(id)
        .then((response) => {
          setFormData({
            id: response.data.result?.id ?? '',
            title: response.data.result.title,
            code: response.data.result.code
          });
        }).catch(() => {
        navigate('/error/404');
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
          <h1 className="text-xl font-medium leading-none text-gray-900">Maintenance Type Details</h1>
          <div className="flex justify-end items-center gap-2 flex-wrap p-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-blue-500 rounded-md">
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <Link to={`/maintenance/maintenance-type/edit/${id}`}>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
                <EditIcon className="w-4 h-4" /> Edit
              </button>
            </Link>
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
          <div className="card py-4">
            <form className="card-body grid gap-5">
              <div className="grid gap-2.5">
                <h1 className="text-white">ID</h1>
                <span>{formData.id}</span>
              </div>
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="grid gap-2.5">
                  <h1 className="text-white">Title</h1>
                  <span>{formData.title}</span>
                </div>

                <div className="grid gap-2.5">
                  <h1 className="text-white">Code</h1>
                  <span>{formData.title}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export { MaintenanceTypeDetailsPage };
