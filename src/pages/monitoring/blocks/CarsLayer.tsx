import { Marker, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useCallback, useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VehicleLocation } from '@/api/cars';

export const CarsLayer = () => {
  const map = useMap();
  const [firstLoad, setFirstLoad] = useState(true);
  const { locations, selectedLocation, setSelectedLocation, showImei } = useMonitoringProvider();

  const getIcon = useCallback(
    (location: VehicleLocation) => {
      const iconColor = location.online ? (location.status.engineStatus ? 'green' : 'red') : 'gray';
      return L.divIcon({
        className: 'relative',
        html: renderToStaticMarkup(
          <>
            <img
              className="size-[20px] leaflet-marker-icon leaflet-zoom-animated leaflet-interactive"
              src={toAbsoluteUrl(`/media/icons/car-marker-${iconColor}.png`)}
            />
            {showImei && (
              <div className="absolute bottom-[calc(100%+10px)] -translate-x-[calc(50%-10px)] text-xs font-semibold text-[#3F4254] bg-white rounded-lg p-2">
                {location.vehicle.imei}
              </div>
            )}
          </>
        ),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    },
    [showImei]
  );

  useEffect(() => {
    if (!selectedLocation) {
      if (firstLoad) {
        setFirstLoad(false);
        return;
      }
      map.zoomOut(7, { animate: true });
      return;
    }

    map.flyTo([selectedLocation.lat, selectedLocation.long], 16, {
      animate: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedLocation]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      removeOutsideVisibleBounds
      disableClusteringAtZoom={12}
      animate={false}
      spiderfyDistanceMultiplier={4}
      spiderfyShapePositions={(count, centerPt) => {
        // Draw circles and keep increasing the radius until all markers are inside the circle
        var distance = 100;
        var increaseOn = 5;
        var angleStep = (2 * Math.PI) / increaseOn;
        var iterations = 0;
        var currentIteration = 0;
        const positions = [];

        for (let i = 0; i < count; i++) {
          const angle = i * angleStep + iterations * (Math.PI / 4);
          const pos = L.point(
            centerPt.x + distance * Math.cos(angle),
            centerPt.y + distance * Math.sin(angle)
          );
          positions.push(pos);
          currentIteration++;
          if (increaseOn === currentIteration) {
            currentIteration = 0;
            distance += 125;
            increaseOn *= 2;
            angleStep = (2 * Math.PI) / increaseOn;
            iterations++;
          }
        }

        return positions;
      }}
      onMouseOver={(e) => {
        try {
          if (e.layer.getChildCount() < 50) {
            e.layer.spiderfy();
          }
        } catch (e) {
          console.error(e);
        }
      }}
      onMouseOut={(e) => {
        try {
          e.layer.unspiderfy();
        } catch (e) {
          console.error(e);
        }
      }}
    >
      {selectedLocation
        ? selectedLocation.lat &&
          selectedLocation.long && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.long]}
              rotationAngle={selectedLocation.angle}
              icon={getIcon(selectedLocation)}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(undefined);
                }
              }}
            />
          )
        : locations?.map(
            (location) =>
              location.lat &&
              location.long && (
                <Marker
                  key={location.vehicle.imei}
                  position={[location.lat, location.long]}
                  rotationAngle={location.angle}
                  icon={getIcon(location)}
                  eventHandlers={{
                    click: () => {
                      setSelectedLocation(location);
                    }
                  }}
                />
              )
          )}
    </MarkerClusterGroup>
  );
};
