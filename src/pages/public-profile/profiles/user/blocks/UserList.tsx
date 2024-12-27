import React, { useMemo } from 'react';
import { DataGrid } from '@/components';
import { getUsers, User } from '@/api/users';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router';
import { StatusDropdown } from '../StatusDropdown';
import { Download, Filter, Search } from 'lucide-react';

interface UserListProps {
  searchQuery?: string;
}

const UserList: React.FC<UserListProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const handleViewUserClick = () => {
    navigate('view-user');
  };

  const columns = useMemo<ColumnDef<User>[]>(
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
        cell: ({ row }) => <span className="text-gray-800">{row.original.username}</span>
      },
      {
        accessorKey: 'owner',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {row.original.owner.charAt(0)}
            </div>
            <div>
              <div className="font-bold">{row.original.owner}</div>
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
        accessorKey: '',
        header: 'Subscription Start Date',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-800">{format(row.original.date, 'MMM d, yyyy')}</span>
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
        cell: (info) => (
          <StatusDropdown
            selected={info.row.original.status}
            setSelected={() => {}}
            options={{
              Active: {
                color: '#50CD89',
                backgroundColor: '#EEFAF4'
              },
              Suspended: {
                color: '#FFA800',
                backgroundColor: '#FFF8EA'
              },
              'Pending Activation': {
                color: '#5271FF',
                backgroundColor: '#EEFAFF'
              },
              Deactivated: {
                color: '#F1416C',
                backgroundColor: '#FFF5F8'
              }
            }}
          />
        ),
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: () => 'Actions',
        cell: (info) => (
          <div className="flex gap-3">
            <a href="#" onClick={handleViewUserClick}>
              <img src={toAbsoluteUrl('/media/icons/view.svg')} />
            </a>
            <a href="#">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} />
            </a>
          </div>
        ),
        meta: {
          className: 'min-w-36'
        }
      }
    ],
    []
  );

  return (
    <div className="card">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border">
            <Filter size={16} />
            <span>Filters</span>
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-100 rounded-full">
              2
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border">
            <Download size={16} />
            <span>Export</span>
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
            />
          </div>
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