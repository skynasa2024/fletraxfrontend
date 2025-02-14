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
import React, { useCallback, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField.tsx';
import { useSettings } from '@/providers';
import {
  deleteMaintenanceType,
  getMaintenanceTypes,
  IMaintenanceTypeTableData
} from '@/api/maintenance-type.ts';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';

const MaintenanceTypeList = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const intl = useIntl();

  const handleDelete = useCallback(
    (id: string) => {
      deleteMaintenanceType(id)
        .then((response) => {
          navigate('/maintenance/maintenance-type');
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
    [enqueueSnackbar, navigate]
  );

  const columns = useMemo<ColumnDef<IMaintenanceTypeTableData>[]>(
    () => [
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: () => (
          <FormattedMessage id="MAINTENANCE_TYPE.GRID.HEADER.TITLE" defaultMessage="Title" />
        ),
        enableSorting: true,
        cell: (info) => <span className="text-gray-800">{info.row.original.title}</span>,
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.code,
        id: 'code',
        header: () => (
          <FormattedMessage id="MAINTENANCE_TYPE.GRID.HEADER.CODE" defaultMessage="Code" />
        ),
        enableSorting: true,
        cell: (info) => <span className="text-gray-800">{info.row.original.code}</span>,
        meta: {
          className: 'min-w-36'
        }
      },
      {
        id: 'actions',
        header: () => <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
        cell: (info) => (
          <div className="flex gap-3">
            <Link
              to={`/maintenance/maintenance-type/view/${info.row.original.id}`}
              className="size-7.5"
            >
              <img
                src={toAbsoluteUrl('/media/icons/view.svg')}
                alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
              />
            </Link>
            <Link
              to={`/maintenance/maintenance-type/edit/${info.row.original.id}`}
              className="size-7.5"
            >
              <img
                src={toAbsoluteUrl('/media/icons/edit.svg')}
                alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
              />
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
                        <img
                          src={toAbsoluteUrl('/media/icons/delete-light.svg')}
                          alt={intl.formatMessage({ id: 'COMMON.DELETE' })}
                        />
                      </MenuIcon>
                      <MenuTitle>
                        <FormattedMessage id="COMMON.DELETE" defaultMessage="Delete" />
                      </MenuTitle>
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
    [handleDelete, intl]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          <FormattedMessage
            id="MAINTENANCE_TYPE.LIST.TITLE"
            defaultMessage="Maintenance Types List"
          />
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className={`w-64 pl-10 pr-4 py-2 ${settings.themeMode == 'dark' ? 'bg-gray-950' : 'bg-gray-200'} text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info`}
            placeholder={intl.formatMessage({ id: 'MAINTENANCE_TYPE.SEARCH.PLACEHOLDER' })}
            onDebounce={setSearchQuery}
          />
        </div>
      </div>

      <DataGrid
        data={[]}
        columns={columns}
        serverSide={true}
        onFetchData={getMaintenanceTypes}
        filters={[...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])]}
      />
    </div>
  );
};

export { MaintenanceTypeList };
