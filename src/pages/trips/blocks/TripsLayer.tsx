import { Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useTripsContext } from '../providers/TripsContext';
import { useEffect, useMemo } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { useAnimationContext } from '../providers/AnimationContext';
import { interpolateKeyframes } from '../utils/KeyframeInterpolate';
import { getColor } from './PolylineColors';
import { useLanguage } from '@/i18n';

export const TripsLayer = () => {
  const { isRTL } = useLanguage();
  const map = useMap();
  const { path, selectedTrip } = useTripsContext();
  const trips = useMemo(() => {
    if (!selectedTrip) {
      return [];
    }
    if ('trips' in selectedTrip) {
      return selectedTrip.trips;
    }
    return [selectedTrip];
  }, [selectedTrip]);
  const { current: time, setMetaData } = useAnimationContext();
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
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-green.png'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
    []
  );
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

  const denormailizedTime = useMemo(() => {
    if (!path) {
      return 0;
    }

    const startTime = path[0].timestamp.getTime();

    // time is from 0 to 10,000
    return startTime + time;
  }, [time, path]);

  const interpolatedState = useMemo(() => {
    if (!path) {
      return null;
    }

    return interpolateKeyframes(path, denormailizedTime);
  }, [path, denormailizedTime]);

  useEffect(() => {
    setMetaData({
      speed: interpolatedState?.speed,
      timestamp: denormailizedTime
    });
  }, [denormailizedTime, interpolatedState, setMetaData]);

  const latLng = useMemo(() => {
    if (!interpolatedState) {
      return null;
    }

    return L.latLng(interpolatedState.latitute, interpolatedState.longitude);
  }, [interpolatedState]);

  const rotation = useMemo(() => {
    if (!interpolatedState) {
      return null;
    }

    return interpolatedState.direction;
  }, [interpolatedState]);

  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.flyToBounds(
      bounds,
      isRTL()
        ? { paddingTopLeft: [100, 20], paddingBottomRight: [300, 20] }
        : { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] }
    );
  }, [bounds, isRTL, map]);

  if (!path) {
    return null;
  }

  return (
    <>
      {trips.map((trip) => (
        <Polyline
          key={trip.id}
          pathOptions={{ color: getColor(trip.id) }}
          positions={trip.path.map((point) => [point.latitude, point.longitude])}
        />
      ))}
      {path && path.length > 1 && (
        <>
          <Marker position={[path[0].latitude, path[0].longitude]} icon={iconStartTrip} />
          <Marker
            position={[path[path.length - 1].latitude, path[path.length - 1].longitude]}
            icon={iconEndTrip}
          />
        </>
      )}
      {latLng && rotation !== null && (
        <RotatableMarker position={latLng} icon={icon} rotationAngle={rotation} />
      )}
    </>
  );
};
