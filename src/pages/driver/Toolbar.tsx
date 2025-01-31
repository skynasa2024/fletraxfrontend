import { useNavigate, useParams } from 'react-router-dom';
import { DeleteIcon, EditIcon } from './svg';
import { deleteDriver } from '@/api/drivers';

const Toolbar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end items-center gap-2 flex-wrap p-4">
        <a href={`/drivers/edit/${id}`}>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
            <EditIcon className="w-4 h-4" /> Edit
          </button>
        </a>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md"
          onClick={async () => {
            if (!id) return;
            await deleteDriver(id);
            navigate('/drivers/driver');
          }}
        >
          <DeleteIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
