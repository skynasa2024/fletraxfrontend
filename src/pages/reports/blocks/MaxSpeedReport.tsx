import { exportMaxSpeedReport, getMaxSpeedReport, IMaxSpeedReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { downloadFile, toAbsoluteUrl } from '@/utils';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';
import { Download } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import MapModal from '../components/MapModal';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import ParkingMarker from '@/pages/replay/components/ParkingMarker';
import L from 'leaflet';

export default function MaxSpeedReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'ident,desc'
  });

  const columns = useMemo<ColumnDef<IMaxSpeedReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'plate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        enableSorting: true,
        cell: ({ row }) => <CarPlate plate={row.original.plate} />
      },
      {
        accessorKey: 'timestamp',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TIMESTAMP' }),
        enableSorting: true
      },
      {
        accessorKey: 'ignitionStatus',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IGNITION_STATUS' }),
        cell: ({ row }) => {
          const status = row.original.ignitionStatus ? 'On' : 'Off';
          return <span>{status}</span>;
        }
      },
      {
        accessorKey: 'positionSpeed',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.SPEED' })
      },
      {
        accessorKey: 'positionLatitude',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.LATITUDE' })
      },
      {
        accessorKey: 'positionLongitude',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.LONGITUDE' })
      },
      {
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.ACTION' }),
        cell: ({ row }) => (
          <MapModal>
            <MaxSpeedMarker
              position={{
                latitude: row.original.positionLatitude,
                longitude: row.original.positionLongitude
              }}
              speed={row.original.positionSpeed}
            />
          </MapModal>
        )
      }
    ],
    [intl]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateFilters({
      ident: formData.get('ident')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('intervalType')?.toString() || '',
      startTime: formData.get('startTime')?.toString() || '',
      endTime: formData.get('endTime')?.toString() || ''
    });
  };

  const handleExport = async () => {
    try {
      const response = await exportMaxSpeedReport({
        pageIndex: 0,
        pageSize: 0,
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        startTime: filters.startTime || '',
        endTime: filters.endTime || '',
        sort: 'ident,desc',
        ident: filters.ident || ''
      });
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

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-full">
          <div className="grid grid-cols-5 gap-4 grow">
            <div className="relative">
              <VehicleSearch place="bottom" />
            </div>
            <input
              type="date"
              name="startDate"
              className="input"
              placeholder="Start Date"
              max={new Date().toISOString().split('T')[0]}
              defaultValue={filters.startDate}
            />
            <input
              type="date"
              name="endDate"
              className="input"
              placeholder="End Date"
              max={new Date().toISOString().split('T')[0]}
              defaultValue={filters.endDate}
            />
            <input
              type="time"
              name="startTime"
              className="input"
              placeholder="Start Time"
              defaultValue={filters.startTime}
            />
            <input
              type="time"
              name="endTime"
              className="input"
              placeholder="End Time"
              defaultValue={filters.endTime}
            />
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
          <button type="submit" className="btn btn-info w-28 items-center justify-center">
            <span>{intl.formatMessage({ id: 'COMMON.SEARCH' })}</span>
          </button>
        </div>
      </form>

      <div className="report-table-container">
        <DataGrid
          rowSelect
          columns={columns}
          serverSide
          onFetchData={
            filters.ident
              ? (params) =>
                  handleFetchWithSort(
                    params,
                    {
                      ...filters,
                      intervalType: filters.type
                    },
                    getMaxSpeedReport
                  )
              : undefined
          }
          filters={getDataGridFilters()}
          pagination={{
            size: 100,
            sizes: undefined
          }}
          messages={{
            empty: !filters.ident ? intl.formatMessage({ id: 'COMMON.SELECT_VEHICLE' }) : undefined
          }}
        />
      </div>
    </>
  );
}

type MaxSpeedMarkerProps = {
  position: {
    latitude: number;
    longitude: number;
  };
  speed: number;
};

function MaxSpeedMarker({ position, speed }: MaxSpeedMarkerProps) {
  const map = useMap();

  const createParkingIcon = useCallback(() => {
    const svgString = renderToString(<ParkingMarker color={'#FF0000'} letter="!" />);

    return L.divIcon({
      html: svgString,
      className: '',
      iconSize: [30, 31],
      iconAnchor: [15, 31]
    });
  }, []);

  useEffect(() => {
    if (position && position.latitude && position.longitude) {
      map.setView([position.latitude, position.longitude], 15);
    }
  }, [position, map]);

  if (
    !position ||
    typeof position.latitude !== 'number' ||
    typeof position.longitude !== 'number'
  ) {
    return null;
  }

  return (
    <Marker position={[position.latitude, position.longitude]} icon={createParkingIcon()}>
      <Tooltip
        direction="top"
        offset={[0, -30]}
        permanent
        interactive
        className="bg-white rounded-lg shadow-lg p-2 opacity-100 flex text-center font-semibold text-gray-800 text-md"
      >
        <div className="min-w-36 flex flex-col gap-2">{speed} km/h</div>
      </Tooltip>
    </Marker>
  );
}
