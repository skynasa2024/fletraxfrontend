import { Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { interpolateKeyframes } from '@/pages/trips/utils/KeyframeInterpolate';
import { useLanguage } from '@/i18n';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { ParkingPopup } from '../components/ParkingPopup';

export const ReplayLayer = () => {
  const { isRTL } = useLanguage();
  const map = useMap();
  const { replayData } = useReplayContext();
  const { current: time, setMetaData } = useReplayAnimationContext();

  const { completePath, parkings } = replayData || {};

  console.log('replayData', replayData);

  const bounds = useMemo(() => {
    if (!completePath || completePath.length === 0) {
      return undefined;
    }
    const latLng = L.latLng([completePath[0].latitude, completePath[0].longitude]);
    return completePath.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [completePath]);

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

  const iconParkingPoint = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/parking-point.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }),
    []
  );

  const denormailizedTime = useMemo(() => {
    if (!completePath || completePath.length === 0) {
      return 0;
    }

    const startTime = new Date(completePath[0]?.timestamp * 1000).getTime() ?? 0;
    return startTime + time;
  }, [time, completePath]);

  const interpolatedState = useMemo(() => {
    if (!completePath || completePath.length === 0) {
      return null;
    }

    return interpolateKeyframes(
      completePath.map((point) => ({
        tripId: point.id,
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: new Date(point.timestamp * 1000),
        speed: point.speed,
        direction: point.direction
      })),
      denormailizedTime
    );
  }, [completePath, denormailizedTime]);

  useEffect(() => {
    setMetaData({
      speed: interpolatedState?.speed ?? 0,
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

  if (!completePath || !replayData) {
    return null;
  }

  return (
    <>
      {completePath && completePath.length > 0 && (
        <Polyline
          pathOptions={{ color: '#2563eb' }}
          positions={completePath.map((point) => [point.latitude, point.longitude])}
        />
      )}

      {completePath && completePath.length > 1 && (
        <>
          <Marker
            position={[completePath[0].latitude, completePath[0].longitude]}
            icon={iconStartTrip}
          />
          <Marker
            position={[
              completePath[completePath.length - 1].latitude,
              completePath[completePath.length - 1].longitude
            ]}
            icon={iconEndTrip}
          />
        </>
      )}

      {parkings &&
        parkings.length > 0 &&
        parkings.map((parking) => (
          <Marker
            key={parking.id}
            position={[parking.startLatitude, parking.startLongitude]}
            icon={iconParkingPoint}
          >
            <ParkingPopup parking={parking} />
          </Marker>
        ))}

      {latLng && rotation !== null && (
        <RotatableMarker position={latLng} icon={icon} rotationAngle={rotation} />
      )}
    </>
  );
};
