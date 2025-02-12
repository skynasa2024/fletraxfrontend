import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle,
  useDataGrid
} from '@/components';
import { deleteUser, getUsersByParentId, updateUserStatus, User, UserModel } from '@/api/user';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '@/pages/dashboards/blocks/StatusDropdown';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { useSettings } from '@/providers';
import { useAuthContext } from '@/auth';
import { useSnackbar } from 'notistack';

const UserListDropdown = (info: CellContext<UserModel, unknown> & { refetch: () => void }) => {
  const { settings } = useSettings();
  const { currentUser } = useAuthContext();

  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status.toString()}
      setSelected={async (status) => {
        await updateUserStatus(info.row.original.id, status === 'true');
        reload();
        info.refetch();
      }}
      readOnly={currentUser?.role !== 'admin'}
      options={{
        true: {
          color: '#50CD89',
          backgroundColor: settings.themeMode == 'dark' ? '#15171c' : '#ffffff',
          name: 'Active'
        },
        false: {
          color: '#F1416C',
          backgroundColor: settings.themeMode == 'dark' ? '#15171c' : '#ffffff',
          name: 'Inactive'
        }
      }}
    />
  );
};

interface UserListProps {
  refetch: () => void;
}

const UserList: React.FC<UserListProps> = ({ refetch }) => {
  const { settings } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [usersStack, setUsersStack] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columns = useMemo<ColumnDef<UserModel>[]>(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        enableSorting: true,
        cell: ({ row }) => <span className="text-gray-800 font-bold">{row.original.username}</span>
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {row.original.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold">{row.original.name}</div>
              <div className="text-gray-500">{row.original.email}</div>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'city',
        header: 'City',
        enableSorting: true,
        cell: ({ row }) => <span className="text-gray-800">{row.original.city}</span>
      },
      {
        accessorKey: 'timezone',
        header: 'Timezone',
        enableSorting: true,
        cell: ({ row }) => <span className="text-gray-800">{row.original.timezone}</span>
      },
      {
        accessorKey: 'subscriptionStartDate',
        header: 'Subscription Start Date',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-800">{row.original.subscriptionStartDate}</span>
        )
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: true,
        cell: ({ row }) => <span className="text-gray-800 font-bold">{row.original.role}</span>
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: (info) => <UserListDropdown refetch={refetch} {...info} />,
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: () => 'Actions',
        cell: (info) => (
          <div className="flex gap-3">
            <button onClick={() => updateUsersStack(info.row.original)}>
              <div className="flex justify-center items-center size-7.5 bg-gray-200 rounded-full">
                <KeenIcon
                  icon="users"
                  className={settings.themeMode == 'dark' ? 'text-white' : 'text-black'}
                />
              </div>
            </button>
            <a href={`/users/user/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} />
            </a>
            <a href={`/users/edit/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} />
            </a>
            <Menu>
              <MenuItem toggle="dropdown" trigger="click">
                <MenuToggle>
                  <KeenIcon className="text-xl" icon="dots-vertical" />
                </MenuToggle>
                <MenuSub className="menu-default">
                  <MenuItem
                    onClick={async () => {
                      await deleteUser(info.row.original.id);
                      enqueueSnackbar('User deleted successfully', {
                        variant: 'success'
                      });
                      refetch();
                    }}
                  >
                    <MenuLink>
                      <MenuIcon>
                        <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                      </MenuIcon>
                      <MenuTitle>Delete</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          </div>
        ),
        meta: {
          className: 'min-w-36'
        }
      }
    ],
    [refetch, settings.themeMode]
  );

  const updateUsersStack = (user: User) => {
    setUsersStack((prevStack) => {
      if (prevStack.length > 0 && prevStack[prevStack.length - 1].id === user.id) {
        return prevStack;
      }
      const userIndex = prevStack.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        return prevStack.slice(0, userIndex + 1);
      } else {
        return [...prevStack, user];
      }
    });
  };

  const removeUsersStack = () => {
    setUsersStack([]);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className={`w-64 pl-10 pr-4 py-2 ${settings.themeMode == 'dark' ? 'bg-gray-950' : 'bg-gray-200'} text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info`}
            placeholder="Search"
            onDebounce={setSearchQuery}
          />
        </div>
      </div>
      <div className="flex items-center justify-start px-16 pb-6">
        <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap">
          {usersStack.length > 0 && (
            <React.Fragment>
              <button
                onClick={() => removeUsersStack()}
                className="text-blue-600 hover:text-blue-800"
              >
                Users
              </button>
              <span className="text-gray-500">/</span>
            </React.Fragment>
          )}
          {usersStack.map((user, index) => (
            <React.Fragment key={user.id}>
              <button
                onClick={() => updateUsersStack(user)}
                className="text-blue-600 hover:text-blue-800"
              >
                {user.name}
              </button>
              {index < usersStack.length - 1 && <span className="text-gray-500">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="user-table">
        <DataGrid
          data={[]}
          columns={columns}
          serverSide={true}
          filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
          onFetchData={(params) =>
            getUsersByParentId(
              params,
              usersStack.length > 0 ? usersStack[usersStack.length - 1].id : null
            )
          }
        />
      </div>
    </div>
  );
};

export { UserList };
