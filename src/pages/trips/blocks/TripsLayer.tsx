import { Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useTripsContext } from '../providers/TripsContext';
import { useCallback, useEffect, useMemo } from 'react';
import { VehicleLocation } from '@/api/cars';

export const TripsLayer = () => {
  const map = useMap();
  const { path } = useTripsContext();
  const bounds = useMemo(() => {
    if (!path || path.length === 0) {
      return undefined;
    }
    const latLng = L.latLng([path[0].latitude, path[0].longitude]);
    return path.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [path]);
  const icon = useMemo(
    () => ({
      green: L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-green.png'),
        iconSize: [20, 20],
        iconAnchor: [0.5, 0.5]
      }),
      red: L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-red.png'),
        iconSize: [20, 20],
        iconAnchor: [0.5, 0.5]
      }),
      gray: L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-gray.png'),
        iconSize: [20, 20],
        iconAnchor: [0.5, 0.5]
      })
    }),
    []
  );

  const getIcon = useCallback(
    (location: VehicleLocation) => {
      if (!location.online) {
        return icon.gray;
      }

      if (location.status.engineStatus) {
        return icon.green;
      }

      return icon.red;
    },
    [icon.gray, icon.green, icon.red]
  );

  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.flyToBounds(bounds, { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] });
  }, [bounds, map]);

  if (!path) {
    return null;
  }

  return (
    <Polyline
      pathOptions={{ color: '#5271FF' }}
      positions={path?.map((point) => [point.latitude, point.longitude])}
    />
  );
};
