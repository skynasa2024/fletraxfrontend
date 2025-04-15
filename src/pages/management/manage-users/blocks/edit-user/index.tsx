import { createUser, getUserModel, updateUser, UserModel } from '@/api/user';
import { Contact, Information, InformationAccount } from '@/pages/user/add-user';
import { CompanyInformation } from '@/pages/user/add-user/blocks/CompanyInformation';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createPortal } from 'react-dom';
import { enqueueSnackbar } from 'notistack';
import axios, { AxiosError } from 'axios';
import { FormattedMessage } from 'react-intl';
import { ResponseModel } from '@/api/response';
import { CircularProgress } from '@mui/material';

const SaveButtonPortal = ({ formId, isLoading }: { formId: string; isLoading: boolean }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const buttonContainer = document.getElementById('form-action-button-container');
    if (buttonContainer) {
      setContainer(buttonContainer);
    }
  }, []);

  return container
    ? createPortal(
        <button
          type="submit"
          form={formId}
          disabled={isLoading}
          className="btn btn-success flex items-center justify-center w-44"
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" className="mr-2" />
              <span>Saving...</span>
            </>
          ) : (
            'Save'
          )}
        </button>,
        container
      )
    : null;
};

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formId = 'edit-user-form';

  const fetchUserData = async (userId: string) => {
    try {
      const data = await getUserModel(userId);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchUserData(id);
  }, [id]);

  return (
    <form
      id={formId}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        setIsLoading(true);
        try {
          const response = user ? await updateUser(user.id, data) : await createUser(data);
          enqueueSnackbar(<FormattedMessage id="USER.FORM.SAVE_SUCCESS" />, {
            variant: 'success'
          });
          if (user) {
            navigate('/management/users/view/' + user.id);
          } else {
            navigate('/management/users/view/' + response.id);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ResponseModel<never>>;
            enqueueSnackbar(
              axiosError.response?.data.message || <FormattedMessage id="COMMON.ERROR" />,
              {
                variant: 'error'
              }
            );
          } else {
            enqueueSnackbar(<FormattedMessage id="COMMON.ERROR" />, {
              variant: 'error'
            });
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="card col-span-2">
        <Information user={user || undefined} />
        <InformationAccount user={user || undefined} />
        <Contact user={user || undefined} />
        <CompanyInformation user={user || undefined} />

        <SaveButtonPortal formId={formId} isLoading={isLoading} />
      </div>
    </form>
  );
}
