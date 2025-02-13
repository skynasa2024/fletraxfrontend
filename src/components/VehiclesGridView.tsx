import { DataGrid, KeenIcon, TDataGridRequestParams, useDataGrid } from '@/components';
import {
    Menu,
    MenuIcon,
    MenuItem,
    MenuLink,
    MenuSub,
    MenuTitle,
    MenuToggle
} from '@/components/menu';
import Image from '@/components/image/Image';
import { toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { deleteVehicle, getVehicles, updateVehicleStatus, VehicleDetails } from '@/api/cars';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { STATUS_OPTIONS } from '../constants';
import { StatusDropdown } from '@/pages/dashboards/blocks/StatusDropdown';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';

// ...existing type definitions...

export default function VehiclesGridView({ searchQuery, refetchStats }: VehiclesGridViewProps) {
    const intl = useIntl();
    const handleGetVehicles = async (params: TDataGridRequestParams) => {
        return await getVehicles(params);
    };

    const columns = React.useMemo<ColumnDef<VehicleDetails>[]>(
        () => [
            {
                accessorKey: 'customer.name',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.OWNER' }),
                cell: ({ row }) => (
          // ...existing cell renderer code...
        )
            },
            {
                accessorKey: 'brand',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.BRAND' }),
                enableSorting: true,
                cell: ({ row }) => (
          // ...existing cell renderer code...
        )
            },
            {
                accessorKey: 'plate',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.PLATE' }),
                enableSorting: true,
                cell: ({ row }) => <CarPlate plate={row.original.vehicle.plate} />
            },
            {
                accessorKey: 'gear',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.GEAR' }),
                enableSorting: true,
                cell: ({ row }) => (
          // ...existing cell renderer code...
        )
            },
            {
                accessorKey: 'deviceIdent',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.DEVICE' }),
                enableSorting: true,
                cell: ({ row }) => <span className="font-monospace">{row.original.vehicle.imei}</span>
            },
            {
                accessorKey: 'maintenanceMileage',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.MAINTENANCE_MILEAGE' }),
                enableSorting: true,
                cell: ({ row }) => (
          // ...existing cell renderer code...
        )
            },
            {
                accessorKey: 'status',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.STATUS' }),
                enableSorting: true,
                cell: ({ row }) => (
                    <GridViewStatusDropdown vehicleDetails={row.original} refetchStats={refetchStats} />
                )
            },
            {
                id: 'actions',
                header: intl.formatMessage({ id: 'VEHICLE.GRID.HEADER.ACTIONS' }),
                cell: ({ row }) => (
                    <ActionsDropdown vehicleId={row.original.vehicle.id} carId={row.original.carId} />
                )
            }
        ],
        [refetchStats, intl]
    );

    // ...existing DataGrid return...
}

function ActionsDropdown({ vehicleId, carId }: { vehicleId: string; carId: string }) {
    const reload = useDataGrid().fetchServerSideData;
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();

    return (
        <div className="flex gap-3 items-center justify-center">
            <Link
                to={'/vehicles/vehicle/' + vehicleId}
                className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
                title={intl.formatMessage({ id: 'VEHICLE.GRID.ACTION.VIEW' })}
            >
                <img src={toAbsoluteUrl('/media/icons/view-light.svg')} alt="View" />
            </Link>
            <Link
                to={'/vehicles/edit/' + vehicleId}
                className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
                title={intl.formatMessage({ id: 'VEHICLE.GRID.ACTION.EDIT' })}
            >
                <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} alt="Edit" />
            </Link>
            <Menu>
                <MenuItem toggle="dropdown" trigger="click">
                    <MenuToggle>
                        <KeenIcon className="text-xl" icon="dots-vertical" />
                    </MenuToggle>
                    <MenuSub className="menu-default">
                        <MenuItem
                            onClick={async () => {
                                await deleteVehicle(carId);
                                enqueueSnackbar(intl.formatMessage({ id: 'VEHICLE.GRID.DELETE_SUCCESS' }), {
                                    variant: 'success'
                                });
                                reload();
                            }}
                        >
                            <MenuLink>
                                <MenuIcon>
                                    <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                                </MenuIcon>
                                <MenuTitle>
                                    <FormattedMessage id="VEHICLE.GRID.ACTION.DELETE" />
                                </MenuTitle>
                            </MenuLink>
                        </MenuItem>
                    </MenuSub>
                </MenuItem>
            </Menu>
        </div>
    );
}

// ...rest of the existing code...
