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
import { getUsers, updateUserStatus, UserModel, deleteUser } from '@/api/user';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';

const UserListDropdown = (info: CellContext<UserModel, unknown> & { refetch: () => void }) => {
  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status.toString()}
      setSelected={async (status) => {
        await updateUserStatus(info.row.original.id, status === 'true');
        reload();
        info.refetch();
      }}
      options={{
        true: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4',
          name: 'Active'
        },
        false: {
          color: '#F1416C',
          backgroundColor: '#FFF5F8',
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
            <a href={`/users/user/${info.row.original.id}`}>
              <img src={toAbsoluteUrl('/media/icons/view.svg')} />
            </a>
            <a href={`/users/edit/${info.row.original.id}`}>
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
    [refetch]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 ">
        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
            placeholder="Search"
            onDebounce={setSearchQuery}
          />
        </div>
      </div>
      <div className="user-table">
        <DataGrid
          columns={columns}
          data={[]}
          serverSide={true}
          onFetchData={getUsers}
          filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
        />
      </div>
    </div>
  );
};

export { UserList };
