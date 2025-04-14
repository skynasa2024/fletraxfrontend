import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Device } from '@/pages/user/add-user/blocks/Device';
import { FormattedMessage } from 'react-intl';
import { Outlet, useParams } from 'react-router';
import { getUserModel, UserModel } from '@/api/user';
import { useEffect, useState } from 'react';

export default function ManageUsers() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserModel | null>(null);

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
    <>
      <div className="flex justify-between items-center">
        <Toolbar>
          <ToolbarHeading
            title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
            description={<FormattedMessage id="MANAGEMENT.USERS.TOOLBAR.DESCRIPTION" />}
          />
        </Toolbar>

        <div id="form-action-button-container" />
      </div>
      <div className="grid gap-4 grid-cols-5">
        <div className="card col-span-1 h-[650px]"></div>
        <div className="col-span-2">
          <Outlet />
        </div>
        <div className="col-span-2 grid lg:grid-cols-2 gap-4 h-[650px]">
          {user && <Device user={user} />}
        </div>
      </div>
    </>
  );
}
