import React, { useMemo } from 'react';
import { DataGrid, useDataGrid } from '@/components';
import { getUsers, updateUserStatus, UserModel } from '@/api/user';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown';

const UserListDropdown = (info: CellContext<UserModel, unknown> & { refetch: () => void }) => {
  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status.toString()}
      setSelected={async (status) => {
        await updateUserStatus(info.row.original.id, status === 'Active');
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
  searchQuery?: string;
  refetch: () => void;
}

const UserList: React.FC<UserListProps> = ({ searchQuery = '', refetch }) => {
  const columns = useMemo<ColumnDef<UserModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
        cell: ({ row }) => <span className="text-gray-800 font-bold">{row.original.id}</span>
      },
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
