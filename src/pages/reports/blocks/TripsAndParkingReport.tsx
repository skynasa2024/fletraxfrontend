import {
  exportTripsAndParkingReport,
  getTripsAndParkingReport,
  ITripsAndParkingReport
} from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { downloadFile, toAbsoluteUrl } from '@/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { IntervalType, TripPoint } from '@/api/trips';
import { useAuthContext } from '@/auth';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';
import { Download } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import MapModal from '../components/MapModal';
import { Marker, Polyline, useMap } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import ParkingMarker from '@/pages/replay/components/ParkingMarker';
import L, { LatLngExpression } from 'leaflet';

const IntervalTypeOptions = [
  { label: 'Trip', value: IntervalType.Trip },
  { label: 'Parking', value: IntervalType.Parking }
];

export default function TripsAndParkingReport() {
  const intl = useIntl();
  const { currentUser } = useAuthContext();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'startTime,desc'
  });

  const handleExport = async () => {
    try {
      const response = await exportTripsAndParkingReport({
        pageIndex: 0,
        pageSize: 100,
        intervalType: filters.type as IntervalType,
        vehicleId: filters.vehicleId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sort: 'startTime,desc'
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

  const columns = useMemo<ColumnDef<ITripsAndParkingReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'vehiclePlate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        enableSorting: true,
        cell: ({ row }) => <CarPlate plate={row.original.vehiclePlate} />
      },
      {
        accessorKey: 'startTime',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.START_DATE' }),
        enableSorting: true,
        cell: ({ row }) =>
          formatInTimeZone(
            new Date(+row.original.startTime * 1000),
            currentUser!.timezone,
            'yyyy/MM/dd HH:mm:ss'
          )
      },
      {
        accessorKey: 'endTime',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.END_DATE' }),
        cell: ({ row }) =>
          formatInTimeZone(
            new Date(+row.original.endTime * 1000),
            currentUser!.timezone,
            'yyyy/MM/dd HH:mm:ss'
          )
      },
      {
        accessorKey: 'formatedTotalDuration',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DURATION' })
      },
      {
        accessorKey: 'formatedMaxSpeed',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MAX_SPEED' })
      },
      {
        accessorKey: 'foramtedTotalDistance',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MILEAGE' })
      },
      {
        accessorKey: 'intervalType',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TYPE' })
      },
      {
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.ACTION' }),
        cell: ({ row }) => (
          <MapModal>
            {row.original.intervalType === 'Parking' && (
              <ParkingIntervalMarker
                position={{
                  latitude: row.original.startLatitude,
                  longitude: row.original.startLongitude
                }}
              />
            )}
            {row.original.intervalType === 'Trip' && (
              <TripIntervalLayer pointsList={row.original.pointsList} />
            )}
          </MapModal>
        )
      }
    ],
    [intl, currentUser]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters({
      vehicleId: formData.get('vehicleId')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('intervalType')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-[90.5%]">
          <div className="grid grid-cols-4 gap-4 grow">
            <VehicleSearch place="bottom" />
            <select name="intervalType" className="select" defaultValue={filters.type}>
              <option key="ALL" value="">
                All
              </option>
              {IntervalTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          onFetchData={(params) =>
            handleFetchWithSort(
              params,
              {
                ...filters,
                intervalType: filters.type
              },
              getTripsAndParkingReport
            )
          }
          filters={getDataGridFilters()}
          pagination={{
            size: 100,
            sizes: undefined
          }}
        />
      </div>
    </>
  );
}

type ParkingIntervalMarkerProps = {
  position: {
    latitude: number;
    longitude: number;
  };
};

function ParkingIntervalMarker({ position }: ParkingIntervalMarkerProps) {
  const map = useMap();

  const createParkingIcon = useCallback(() => {
    const svgString = renderToString(<ParkingMarker color={'#FF0000'} />);

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

  return <Marker position={[position.latitude, position.longitude]} icon={createParkingIcon()} />;
}

type TripIntervalMarkerProps = {
  pointsList: TripPoint[];
};

function TripIntervalLayer({ pointsList }: TripIntervalMarkerProps) {
  const map = useMap();
  const route: LatLngExpression[] = pointsList
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((point) => [point.latitude, point.longitude]);
  const bounds = L.latLngBounds(route);
  const startPoint = route[0];
  const endPoint = route[route.length - 1];

  const iconStartTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-start.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
    []
  );

  const iconEndTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-end.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }),
    []
  );

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);

  if (!pointsList || pointsList.length === 0) {
    return null;
  }

  return (
    <>
      <Polyline color="#5271FF" weight={5} positions={route} />

      {startPoint && <Marker position={startPoint} icon={iconStartTrip} />}

      {endPoint && <Marker position={endPoint} icon={iconEndTrip} />}
    </>
  );
}
