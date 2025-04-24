import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Device } from '@/pages/user/add-user/blocks/Device';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useParams, useLocation, Link, useNavigate } from 'react-router';
import { getUserModel, UserModel, getUsersByParentId, getParentPath, getUsers } from '@/api/user';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { TreeView, TreeItem } from '@/components';

export default function ManageUsers() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserModel | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [rootUsers, setRootUsers] = useState<TreeItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preExpandedIds, setPreExpandedIds] = useState<string[]>([]);

  const isEditRoute = location.pathname.includes('/edit/');
  const isAddRoute = location.pathname.includes('/add');

  const fetchUserData = async (userId: string) => {
    try {
      const data = await getUserModel(userId);
      setUser(data);

      if (userId) {
        fetchAndExpandParentPath(userId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAndExpandParentPath = async (userId: string) => {
    try {
      const parentPath = await getParentPath(userId);
      setPreExpandedIds(parentPath);
    } catch (error) {
      console.error('Error fetching parent path:', error);
    }
  };

  const fetchRootUsers = async () => {
    setIsLoading(true);
    try {
      const usersResult = await getUsers({ start: 0, end: 50 });
      const treeItems: TreeItem[] = usersResult.data.map((user) => ({
        id: user.id,
        label: user.name,
        hasChildren: true,
        userData: user
      }));
      setRootUsers(treeItems);
      setTotalUsers(usersResult.totalCount);
    } catch (error) {
      console.error('Error fetching root users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserChildren = async (userId: string): Promise<TreeItem[]> => {
    try {
      const childUsers = await getUsersByParentId({ start: 0, end: 50 }, userId);
      return childUsers.data.map((user) => ({
        id: user.id,
        label: user.name,
        hasChildren: true,
        parentId: userId,
        userData: user
      }));
    } catch (error) {
      console.error(`Error fetching children for user ${userId}:`, error);
      return [];
    }
  };

  const handleUserSelect = (node: TreeItem) => {
    if (node.id === id) return;
    navigate(`/management/users/view/${node.id}`);
  };

  useEffect(() => {
    if (!id) {
      fetchRootUsers();
    } else {
      fetchUserData(id);
    }
  }, [id]);

  useEffect(() => {
    fetchRootUsers();
    if (!id && !isAddRoute && rootUsers.length > 0) {
      navigate(`/management/users/view/${rootUsers[0].id}`);
    }
  }, [rootUsers.length]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Toolbar>
          <ToolbarHeading
            title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
            description={<FormattedMessage id="MANAGEMENT.USERS.TOOLBAR.DESCRIPTION" />}
          />
        </Toolbar>

        {isEditRoute || isAddRoute ? (
          <div id="form-action-button-container" />
        ) : (
          <Link
            to="/management/users/add"
            className="btn btn-success flex items-center justify-center w-44"
          >
            <FormattedMessage id="USER.ADD" defaultMessage="Add" />
          </Link>
        )}
      </div>
      <div className="grid gap-4 grid-cols-5">
        <div className="card col-span-1 h-[650px] overflow-hidden">
          <div className="card-header">
            <h3 className="card-title flex justify-between items-center w-full">
              <FormattedMessage id="USER.HIERARCHY" defaultMessage="Users" />
              <span className="text-sm text-gray-500 ml-2">{totalUsers}</span>
            </h3>
          </div>
          <div className="card-body p-0" style={{ height: 'calc(100% - 60px)' }}>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="spinner"></div>
              </div>
            ) : (
              <TreeView
                data={rootUsers}
                fetchChildren={fetchUserChildren}
                onSelect={handleUserSelect}
                noChildrenMessage={intl.formatMessage({
                  id: 'USER.NO_CHILDREN',
                  defaultMessage: 'No users under this item'
                })}
                preExpandedIds={preExpandedIds}
                selectedId={id}
              />
            )}
          </div>
        </div>
        <div className={clsx(isAddRoute ? 'col-span-4' : 'col-span-2')}>
          <Outlet />
        </div>
        <div className="col-span-2 grid lg:grid-cols-2 gap-4 h-[650px]">
          {user && !isAddRoute && <Device user={user} />}
        </div>
      </div>
    </>
  );
}
