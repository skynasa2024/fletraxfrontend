import { Marker } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import MarkerClusterGroup from 'react-leaflet-cluster';

export const CarsLayer = () => {
  const { locations, selectedLocation } = useMonitoringProvider();
  const icon = L.icon({
    iconUrl: toAbsoluteUrl('/media/icons/car-marker.png'),
    iconSize: [30, 60]
  });

  return (
    <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds>
      {selectedLocation
        ? selectedLocation.lat &&
          selectedLocation.long && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.long]}
              rotationAngle={selectedLocation.angle}
              icon={icon}
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
                  icon={icon}
                />
              )
          )}
    </MarkerClusterGroup>
  );
};
