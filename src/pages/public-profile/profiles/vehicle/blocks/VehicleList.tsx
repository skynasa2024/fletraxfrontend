import React, { useMemo } from 'react';
import { DataGrid } from '@/components';
import { getVehicles, Vehicle, STATUS_COLORS } from '@/api/vehicles';
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router';
import { StatusDropdown } from '../StatusDropdown';
import { CarView } from '../../../../../pages/dashboards/dashboard/blocks/CarView';

interface VehicleListProps {
  searchQuery?: string;
}

const VehicleList: React.FC<VehicleListProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();

  const handleViewVehicle = () => {
    navigate('view-vehicle');
  };

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: 'owner',
        header: 'Owner',
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
        accessorFn: (row) => row.vehicle,
        id: 'vehicle',
        header: () => 'Car',
        cell: (info) => <CarView vehicle={info.row.original.vehicle} />,
        meta: {
          className: 'min-w-60'
        }
      },
     
      {
        accessorKey: 'vehicle.brand',
        header: 'Brand',
        cell: ({ row }) => (
          <span className="text-gray-800">{row.original.vehicle?.brand || 'N/A'}</span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorKey: 'gear',
        enableSorting: true,
        header: 'Gear',
        cell: ({ row }) => <span className="text-gray-800">{row.original.gear}</span>
      },
      {
        accessorKey: 'deviceName',
        enableSorting: true,
        header: 'Device Name',
        cell: ({ row }) => <span className="text-gray-800">{row.original.deviceName}</span>
      },
      {
        accessorKey: 'currentMileage',
        enableSorting: true,
        header: 'Current Mileage',
        cell: ({ row }) => <span className="text-gray-800">{row.original.currentMileage}</span>
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => (
          <StatusDropdown
            selected={row.original.status}
            setSelected={() => {}}
            options={{
              Available: { color: '#50CD89', backgroundColor: '#EEFAF4' },
              Unavailable: { color: '#F1416C', backgroundColor: '#FFF5F8' },
              Maintenance: { color: '#FFA800', backgroundColor: '#FFF8EA' },
              Rented: { color: '#5271FF', backgroundColor: '#EEFAFF' }
            }}
          />
        ),
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex gap-3">
            <button onClick={handleViewVehicle} className="p-2">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </button>
            <button className="p-2">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </button>
            <button className="p-2">
              <img src={toAbsoluteUrl('/media/icons/more.svg')} alt="More" />
            </button>
          </div>
        ),
        meta: {
          className: 'min-w-36'
        }
      }
    ],
    [navigate]
  );

  return (
    <DataGrid
      columns={columns}
      data={[]}
      serverSide={true}
      onFetchData={getVehicles}
      filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
    />
  );
};

export { VehicleList };
