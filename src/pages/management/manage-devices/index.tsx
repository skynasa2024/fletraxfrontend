import { Paginated } from '@/api/common';
import {
  createDevice,
  DeviceDTO,
  exportDevicesIntoExcel,
  getDevices,
  importDevicesFromExcel
} from '@/api/devices';
import { ResponseModel } from '@/api/response';
import { useAuthContext } from '@/auth';
import { DataGrid, TDataGridRequestParams } from '@/components';
import PhoneInput from '@/components/PhoneInput';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { EditDeviceModal } from '@/pages/management/blocks/EditDeviceModal';
import { DeviceUserModal } from '@/pages/management/blocks/DeviceUserModal';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { useDeviceProvider } from '@/providers/DeviceProvider';
import { downloadFile, getFormattedDate, toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import axios, { AxiosError } from 'axios';
import { addYears } from 'date-fns';
import { Download, Upload } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState, FormEvent, useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export default function ManageDevices() {
  const intl = useIntl();
  const { currentUser } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState<Paginated<DeviceDTO>>();
  const { getProtocolName, getTypeName } = useDeviceProvider();
  const [protocolId, setProtocolId] = useState<string>('');
  const [typeId, setTypeId] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceDTO | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const currentGridParamsRef = useRef<TDataGridRequestParams>({
    pageIndex: 0,
    pageSize: 100,
    filters: [],
    sorting: []
  });

  const fetchDevices = useCallback((params = { pageIndex: 0, pageSize: 1 }) => {
    return getDevices({
      ...params
    }).then((data) => {
      setDevices(data);
      return data;
    });
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      fetchDevices();
      setIsInitialLoad(false);
    }
  }, [fetchDevices, isInitialLoad]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await createDevice(formData);
      enqueueSnackbar(intl.formatMessage({ id: 'DEVICE.FORM.SAVE_SUCCESS' }), {
        variant: 'success'
      });
      form.reset();
      setProtocolId('');
      setTypeId('');

      // Reset subscription date fields to default values
      const startDateInput = form.querySelector(
        'input[name="subscriptionStartDate"]'
      ) as HTMLInputElement;
      const endDateInput = form.querySelector(
        'input[name="subscriptionEndDate"]'
      ) as HTMLInputElement;
      if (startDateInput) {
        startDateInput.value = getFormattedDate(undefined, currentUser?.timezone);
      }
      if (endDateInput) {
        endDateInput.value = getFormattedDate((d) => addYears(d, 1), currentUser?.timezone);
      }

      fetchDevices();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ResponseModel<never>>;

        enqueueSnackbar(
          axiosError.response?.data.message || intl.formatMessage({ id: 'COMMON.ERROR' }),
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar(intl.formatMessage({ id: 'COMMON.ERROR' }), { variant: 'error' });
      }
    }
  };

  const openEditModal = (device: DeviceDTO) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDevice(null);
  };

  const handleFetchData = useCallback((params: TDataGridRequestParams) => {
    currentGridParamsRef.current = params;
    return getDevices(params);
  }, []);

  const handleExport = async () => {
    try {
      const exportParams = {
        ...currentGridParamsRef.current
      };

      const response = await exportDevicesIntoExcel(exportParams);

      downloadFile(response);

      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.EXPORT_SUCCESS' },
          { defaultMessage: 'Export successful' }
        ),
        {
          variant: 'success'
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.EXPORT_ERROR' },
          { defaultMessage: 'Failed to export devices' }
        ),
        {
          variant: 'error'
        }
      );
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      await importDevicesFromExcel(formData);
      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.IMPORT_SUCCESS' },
          { defaultMessage: 'Import successful' }
        ),
        {
          variant: 'success'
        }
      );
      fetchDevices();
    } catch (error) {
      console.error('Import error:', error);
      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.IMPORT_ERROR' },
          { defaultMessage: 'Failed to import devices' }
        ),
        {
          variant: 'error'
        }
      );
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const columns = useMemo<ColumnDef<DeviceDTO>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.IDENTIFY_NUMBER' })
      },
      {
        accessorKey: 'name',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.NAME' })
      },
      {
        accessorKey: 'phone',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PHONE' })
      },
      {
        accessorKey: 'protocol',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PROTOCOL' }),
        cell: ({ row }) => (
          <div className="w-[175px]">{getProtocolName(row.original.protocolId)}</div>
        )
      },
      {
        accessorKey: 'type',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.TYPE' }),
        cell: ({ row }) => <div className="w-[175px]">{getTypeName(row.original.typeId)}</div>
      },
      {
        accessorKey: 'vehiclePlate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PLATE' }),
        cell: ({ row }) => <CarPlate plate={row.original.vehiclePlate} />
      },
      {
        accessorKey: 'subscriptionStartDate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.START_DATE' })
      },
      {
        accessorKey: 'subscriptionEndDate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.END_DATE' })
      },
      {
        header: intl.formatMessage({ id: 'COMMON.ACTIONS' }),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DeviceUserModal device={row.original} />

            <button
              type="button"
              className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
              title={intl.formatMessage({ id: 'COMMON.EDIT' })}
              onClick={() => openEditModal(row.original)}
            >
              <img
                src={toAbsoluteUrl('/media/icons/edit-light.svg')}
                alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
              />
            </button>
          </div>
        )
      }
    ],
    [intl, getProtocolName, getTypeName]
  );

  return (
    <>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.DEVICES.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>

      <div className="card">
        <div className="flex justify-between items-center p-4">
          <h2 className="font-semibold">
            <FormattedMessage
              id="MANAGEMENT.DEVICES.DEVICE_COUNT"
              values={{ count: devices?.totalCount ?? 0 }}
            />
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                id="importFile"
                accept=".xlsx,.xls"
                onChange={handleImport}
              />
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
                onClick={() => document.getElementById('importFile')?.click()}
              >
                <Upload size={16} />
                <span>
                  <FormattedMessage id="COMMON.IMPORT" />
                </span>
              </button>
            </div>

            <button
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
              onClick={handleExport}
              type="button"
            >
              <Download size={16} />
              <span>
                <FormattedMessage id="COMMON.EXPORT" />
              </span>
            </button>

            <DebouncedSearchInput
              onDebounce={setSearchQuery}
              placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
              className="w-64 py-2 text-sm border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info input"
            />
          </div>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="report-table-container">
            <DataGrid
              columns={columns}
              serverSide={true}
              onFetchData={handleFetchData}
              pagination={{ size: 100, sizes: undefined }}
              filters={[
                ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])
              ]}
              supplementaryHeaderRow={
                <QuickAddDeviceFrom
                  setProtocolId={setProtocolId}
                  setTypeId={setTypeId}
                  protocolId={protocolId}
                  typeId={typeId}
                />
              }
            />
          </div>
        </form>
      </div>

      <EditDeviceModal
        open={isEditModalOpen}
        device={selectedDevice}
        onClose={closeEditModal}
        onSuccess={() => {
          fetchDevices();
          closeEditModal();
        }}
      />
    </>
  );
}

type QuickAddDeviceFromProps = {
  setProtocolId: (value: string) => void;
  setTypeId: (value: string) => void;
  protocolId: string;
  typeId: string;
};

function QuickAddDeviceFrom({
  setProtocolId,
  setTypeId,
  protocolId,
  typeId
}: QuickAddDeviceFromProps) {
  const intl = useIntl();
  const { currentUser } = useAuthContext();
  const { protocols, getTypesOfProtocol } = useDeviceProvider();
  return (
    <>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <input
          type="text"
          name="ident"
          className="input w-full"
          required
          placeholder="Enter identify number"
        />
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <input type="text" name="name" className="input w-full" placeholder="Enter device name" />
      </th>
      <th colSpan={1} className="w-[175px] !p-1 !bg-green-700/5">
        <div className="[&_input.select]:w-[60px] [&_input.select]:p-0">
          <PhoneInput
            required
            phoneCodeName="phoneCode"
            phoneCodeInitialValue="+90"
            name="phone"
            withPrefix={false}
          />
        </div>
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <select
          className="select"
          name="protocolId"
          required
          onChange={(e) => setProtocolId(e.target.value)}
          value={protocolId}
        >
          <option value="">{intl.formatMessage({ id: 'DEVICE.FORM.SELECT_PROTOCOL' })}</option>
          {Object.entries(protocols).map(([id, data]) => (
            <option key={id} value={id}>
              {data}
            </option>
          ))}
        </select>
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <select
          required
          className="select"
          name="typeId"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
        >
          {protocolId ? (
            <>
              <option value="">{intl.formatMessage({ id: 'DEVICE.FORM.SELECT_TYPE' })}</option>
              {getTypesOfProtocol(protocolId).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </>
          ) : (
            <option value="">
              {intl.formatMessage({ id: 'DEVICE.FORM.SELECT_PROTOCOL_FIRST' })}
            </option>
          )}
        </select>
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <input
          type="text"
          name="vehiclePlate"
          className="input w-full"
          placeholder="Enter plate number"
        />
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <input
          type="date"
          name="subscriptionStartDate"
          className="input w-full"
          required
          defaultValue={getFormattedDate(undefined, currentUser?.timezone)}
        />
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <input
          type="date"
          name="subscriptionEndDate"
          className="input w-full"
          required
          defaultValue={getFormattedDate((d) => addYears(d, 1), currentUser?.timezone)}
        />
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <button type="submit" className="btn btn-success w-full flex items-center justify-center">
          Add
        </button>
      </th>
    </>
  );
}
