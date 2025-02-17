import { useNavigate, useParams } from 'react-router-dom';
import { DeleteIcon, EditIcon } from '@/pages/driver/svg';
import { deleteUser } from '@/api/user';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDialogs } from '@toolpad/core/useDialogs';

const Toolbar = () => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dialogs = useDialogs();
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end items-center gap-2 flex-wrap p-4">
        <a href={`/users/edit/${id}`}>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
            <EditIcon className="w-4 h-4" />
            <FormattedMessage id="COMMON.EDIT" />
          </button>
        </a>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md"
          onClick={async () => {
            if (!id) return;
            if (
              !(await dialogs.confirm(
                intl.formatMessage({
                  id: 'USER.DELETE.MODAL_MESSAGE'
                }),
                {
                  title: intl.formatMessage({ id: 'USER.DELETE.MODAL_TITLE' }),
                  okText: intl.formatMessage({ id: 'COMMON.DELETE' }),
                  cancelText: intl.formatMessage({ id: 'COMMON.CANCEL' })
                }
              ))
            )
              return;
            await deleteUser(id);
            enqueueSnackbar('User deleted successfully', {
              variant: 'success'
            });
            navigate('/users/user');
          }}
        >
          <DeleteIcon className="w-4 h-4" />
          <FormattedMessage id="COMMON.DELETE" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
