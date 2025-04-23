import AppMap from '@/components/AppMap';
import { toAbsoluteUrl } from '@/utils';
import { Modal } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useIntl } from 'react-intl';
import L, { LatLngExpression } from 'leaflet';
import { Marker, Polyline, useMap } from 'react-leaflet';
import ParkingMarker from '@/pages/replay/components/ParkingMarker';
import { TripPoint } from '@/api/trips';

type MapModalProps = {
  pointsList?: TripPoint[];
  position?: {
    latitude: number;
    longitude: number;
  };
};

export default function MapModal({ pointsList, position }: MapModalProps) {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="w-[500px] h-[500px] card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark rounded-lg shadow-lg p-4 flex justify-center items-center">
          <AppMap mapControlSize="small">
            {!!position && <ParkingIntervalMarker position={position} />}
            {!!pointsList && <TripIntervalLayer pointsList={pointsList} />}
          </AppMap>
        </div>
      </Modal>

      <button
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
        title={intl.formatMessage({ id: 'VEHICLE.GRID.ACTION.VIEW' })}
        onClick={handleOpenModal}
      >
        <img
          src={toAbsoluteUrl('/media/icons/view-light.svg')}
          alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
        />
      </button>
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
