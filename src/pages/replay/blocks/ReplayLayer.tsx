import { Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { useLanguage } from '@/i18n';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { ParkingPopup } from '../components/ParkingPopup';
import { IntervalType } from '@/api/trips';
import ParkingMarker from '../components/ParkingMarker';
import { renderToString } from 'react-dom/server';

export const ReplayLayer = () => {
  const { isRTL } = useLanguage();
  const map = useMap();
  const { selectedIntervalsData } = useReplayContext();
  const { currentPointIndex, messagePoints, sortedTrips, currentTripIndex, playing } =
    useReplayAnimationContext();
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  const prevTripIndexRef = useRef<number>(currentTripIndex);
  const prevSelectedIntervalsRef = useRef<Record<string, any>>({});

  const selectedTrips = useMemo(() => {
    if (!selectedIntervalsData) {
      return null;
    }
    return Object.values(selectedIntervalsData).filter(
      (interval) => interval.intervalType === IntervalType.Trip
    );
  }, [selectedIntervalsData]);

  const selectedParkings = useMemo(() => {
    if (!selectedIntervalsData) {
      return null;
    }
    return Object.values(selectedIntervalsData).filter(
      (interval) => interval.intervalType === IntervalType.Parking
    );
  }, [selectedIntervalsData]);

  const currentTrip = useMemo(() => {
    if (!sortedTrips || sortedTrips.length === 0 || currentTripIndex >= sortedTrips.length) {
      return null;
    }
    return sortedTrips[currentTripIndex];
  }, [sortedTrips, currentTripIndex]);

  const allPoints = useMemo(() => {
    if (!selectedTrips || selectedTrips.length === 0) {
      return null;
    }
    const allPoints = selectedTrips.reduce((acc, trip) => {
      if (trip.pointsList) {
        acc.push(...trip.pointsList);
      }
      return acc;
    }, [] as any[]);

    return allPoints.sort((a, b) => a.timestamp - b.timestamp);
  }, [selectedTrips]);

  const allBounds = useMemo(() => {
    let bounds: L.LatLngBounds | undefined = undefined;

    if (allPoints && allPoints.length > 0) {
      const latLng = L.latLng([allPoints[0].latitude, allPoints[0].longitude]);
      bounds = allPoints.reduce(
        (acc, point) => acc.extend([point.latitude, point.longitude]),
        L.latLngBounds(latLng, latLng)
      );
    }

    if (selectedParkings && selectedParkings.length > 0) {
      if (!bounds && selectedParkings.length > 0) {
        const firstParking = selectedParkings[0];
        const latLng = L.latLng([firstParking.startLatitude, firstParking.startLongitude]);
        bounds = L.latLngBounds(latLng, latLng);

        if (selectedParkings.length === 1 && !selectedTrips?.length) {
          const padding = 0.01; // 1km at equator
          bounds.extend([
            firstParking.startLatitude + padding,
            firstParking.startLongitude + padding
          ]);
          bounds.extend([
            firstParking.startLatitude - padding,
            firstParking.startLongitude - padding
          ]);
        }
      }

      if (bounds) {
        selectedParkings.forEach((parking) => {
          bounds!.extend([parking.startLatitude, parking.startLongitude]);
        });
      }
    }

    return bounds;
  }, [allPoints, selectedParkings, selectedTrips]);

  const currentTripBounds = useMemo(() => {
    if (!currentTrip || !currentTrip.pointsList || currentTrip.pointsList.length === 0) {
      return undefined;
    }
    const points = [...currentTrip.pointsList].sort((a, b) => a.timestamp - b.timestamp);
    const latLng = L.latLng([points[0].latitude, points[0].longitude]);
    return points.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [currentTrip]);

  const hasSelectionChanged = useCallback(() => {
    const prevKeys = Object.keys(prevSelectedIntervalsRef.current);
    const currentKeys = Object.keys(selectedIntervalsData || {});

    if (prevKeys.length !== currentKeys.length) {
      return true;
    }

    return (
      prevKeys.some((key) => !currentKeys.includes(key)) ||
      currentKeys.some((key) => !prevKeys.includes(key))
    );
  }, [selectedIntervalsData]);

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

  const createParkingIcon = useCallback(() => {
    const svgString = renderToString(<ParkingMarker color={'#FF0000'} />);

    return L.divIcon({
      html: svgString,
      className: '',
      iconSize: [30, 31],
      iconAnchor: [15, 31]
    });
  }, []);

  const currentPosition = useMemo(() => {
    if (messagePoints.length === 0 || currentPointIndex >= messagePoints.length) {
      return null;
    }

    const point = messagePoints[currentPointIndex];
    return {
      latLng: L.latLng(point.latitude, point.longitude),
      direction: point.direction,
      speed: point.speed
    };
  }, [messagePoints, currentPointIndex]);

  // Initial fit bounds for all selected items (trips and parkings)
  useEffect(() => {
    if (hasSelectionChanged()) {
      prevSelectedIntervalsRef.current = { ...(selectedIntervalsData || {}) };
    }

    if (!allBounds) {
      return;
    }

    const hasSelectedItems =
      (selectedTrips && selectedTrips.length > 0) ||
      (selectedParkings && selectedParkings.length > 0);

    if (hasSelectedItems) {
      map.flyToBounds(allBounds, {
        padding: [100, 100],
        paddingTopLeft: isRTL() ? [100, 20] : [300, 20],
        paddingBottomRight: isRTL() ? [300, 20] : [100, 20]
      });
    }
  }, [allBounds, isRTL, map, selectedTrips, selectedParkings, hasSelectionChanged]);

  useEffect(() => {
    if (prevTripIndexRef.current === currentTripIndex) {
      prevTripIndexRef.current = currentTripIndex;
      return;
    }

    prevTripIndexRef.current = currentTripIndex;

    if (currentTripBounds && playing) {
      if (selectedParkings?.length === 1 && !selectedTrips?.length) {
        return;
      }

      map.flyToBounds(currentTripBounds, {
        duration: 0.5,
        paddingTopLeft: isRTL() ? [100, 20] : [300, 20],
        paddingBottomRight: isRTL() ? [300, 20] : [100, 20]
      });
    }
  }, [currentTripIndex, currentTripBounds, isRTL, map, playing, selectedParkings, selectedTrips]);

  const tripColors = {
    primary: '#0c0fd1',
    secondary: '#11910f'
  };

  if (!selectedIntervalsData || Object.keys(selectedIntervalsData).length === 0) {
    return null;
  }

  const startPoint = currentTrip
    ? { latitude: currentTrip.startLatitude, longitude: currentTrip.startLongitude }
    : null;

  const endPoint = currentTrip
    ? { latitude: currentTrip.endLatitude, longitude: currentTrip.endLongitude }
    : null;

  return (
    <>
      {selectedTrips &&
        selectedTrips.length > 0 &&
        selectedTrips
          .filter((trip) => trip && trip.pointsList)
          .map((trip) => {
            return (
              <Polyline
                key={trip.id}
                pathOptions={{
                  color: tripColors.secondary,
                  weight: 3
                }}
                positions={trip.pointsList
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map((point) => [point.latitude, point.longitude])}
              />
            );
          })}

      {currentTrip && (
        <Polyline
          key={currentTrip?.id}
          pathOptions={{
            color: tripColors.primary,
            weight: 5
          }}
          positions={currentTrip?.pointsList
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((point) => [point.latitude, point.longitude])}
        />
      )}

      {selectedParkings &&
        selectedParkings.length > 0 &&
        selectedParkings.map((parking) => {
          return (
            <Marker
              key={parking.id}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[parking.id] = ref;
                }
              }}
              position={[parking.startLatitude, parking.startLongitude]}
              icon={createParkingIcon()}
            >
              <ParkingPopup parking={parking} />
            </Marker>
          );
        })}

      {currentTrip && startPoint && (
        <Marker position={[startPoint.latitude, startPoint.longitude]} icon={iconStartTrip} />
      )}

      {currentTrip && endPoint && (
        <Marker position={[endPoint.latitude, endPoint.longitude]} icon={iconEndTrip} />
      )}

      {currentPosition && currentTrip && (
        <RotatableMarker
          position={currentPosition.latLng}
          icon={icon}
          rotationAngle={currentPosition.direction}
        />
      )}
    </>
  );
};
