import { Link, useNavigate, useParams } from 'react-router-dom';
import { DeleteIcon, EditIcon, MaintenanceIcon, ViolationsIcon } from '../../blocks/svg';
import { Container } from '@/components';
import { deleteVehicle } from '@/api/cars';

const Toolbar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container>
      <div className="flex justify-end items-center gap-2 flex-wrap p-4">
        <Link to={`/vehicles/edit/${id}`}>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
            <EditIcon className="w-4 h-4" /> Edit
          </button>
        </Link>

        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-purple-500 rounded-md">
          <EditIcon className="w-4 h-4" color="#6B46C1" />
          Add scratch
        </button>

        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[#1BC5BD] rounded-md">
          <MaintenanceIcon className="w-4 h-4" />
          Maintenance
        </button>

        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md">
          <ViolationsIcon className="w-4 h-4" />
          Violations
        </button>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md"
          onClick={async () => {
            if (!id) return;
            await deleteVehicle(id);
            navigate('/vehicles/vehicle');
          }}
        >
          <DeleteIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
    </Container>
  );
};

export default Toolbar;
