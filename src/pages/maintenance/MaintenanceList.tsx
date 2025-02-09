import {
  DataGrid,
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';
import { deleteMaintenance, getMaintenance, IMaintenanceTableData } from '@/api/maintenance.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField.tsx';
import { useSettings } from '@/providers';
import { MaintenanceStatusDropdown } from './components/MaintenanceStatusDropdown.tsx';
import { useSnackbar } from 'notistack';
import { CarView } from '../dashboards/blocks/CarView.tsx';
import { getMaintenanceTypes } from '@/api/maintenance-type.ts';

const MaintenanceList = (props: { fetchStats: () => void }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const [maintenanceTypes, setMaintenanceTypes] = useState<Record<string, string>>();

  useEffect(() => {
    getMaintenanceTypes({ pageSize: 1000, pageIndex: 0 }).then((response) => {
      setMaintenanceTypes(
        response.data.reduce(
          (acc, type) => ({ ...acc, ...(type.title && type.code && { [type.code]: type.title }) }),
          {} as Record<string, string>
        )
      );
    });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteMaintenance(id)
        .then((response) => {
          props?.fetchStats();
          navigate('/maintenance');
          enqueueSnackbar(response.data.message, {
            variant: response.data.success ? 'success' : 'error'
          });
        })
        .catch((error) => {
          enqueueSnackbar(error, {
            variant: 'error'
          });
        });
    },
    [enqueueSnackbar, navigate, props]
  );

  const columns = useMemo<ColumnDef<IMaintenanceTableData>[]>(
    () => [
      {
        accessorFn: (row) => row.vehicleBrand,
        id: 'vehicleBrand',
        header: () => 'Car',
        enableSorting: true,
        cell: (info) => (
          <CarView
            vehicle={{
              id: info.row.original.vehicleId,
              name: info.row.original.vehicleName,
              plate: info.row.original.vehiclePlate,
              imei: '',
              brandImage: ''
            }}
          />
        ),
        meta: {
          className: 'min-w-40'
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => 'Maintenance Type',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {maintenanceTypes
              ? maintenanceTypes[info.row.original.type] || 'Unknown Type'
              : 'Loading...'}
          </span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.supplier,
        id: 'supplier',
        header: () => 'Supplier',
        enableSorting: true,
        cell: (info) => <span className="text-gray-800">{info.row.original.supplier}</span>,
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.amount,
        id: 'amount',
        header: () => 'Price',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(info.row.original.amount)}
          </span>
        ),
        meta: {
          className: 'min-w-24'
        }
      },
      {
        id: 'startDate',
        accessorKey: 'startDate',
        header: 'Date',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span>Start: {format(row.original.startDate.toDateString(), 'yyyy-MM-dd')}</span>
            <span>End: {format(row.original.endDate.toDateString(), 'yyyy-MM-dd')}</span>
          </div>
        )
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: (info) => <MaintenanceStatusDropdown refetch={props?.fetchStats} {...info} />,
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: () => 'Action',
        cell: (info) => (
          <div className="flex gap-3">
            <Link to={`/maintenance/view/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </Link>
            <Link to={`/maintenance/edit/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </Link>
            <Menu>
              <MenuItem toggle="dropdown" trigger="click">
                <MenuToggle>
                  <KeenIcon className="text-xl" icon="dots-vertical" />
                </MenuToggle>
                <MenuSub className="menu-default">
                  <MenuItem
                    onClick={() => {
                      handleDelete(info.row.original.id);
                    }}
                  >
                    <MenuLink>
                      <MenuIcon>
                        <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} alt="Delete" />
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
          className: 'min-w-24'
        }
      }
    ],
    [handleDelete, maintenanceTypes, props?.fetchStats]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance List</h2>
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

      <DataGrid
        data={[]}
        columns={columns}
        serverSide={true}
        onFetchData={getMaintenance}
        filters={[...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])]}
      />
    </div>
  );
};

export { MaintenanceList };
