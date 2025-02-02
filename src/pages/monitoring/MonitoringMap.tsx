import { CarsLayer } from './blocks/CarsLayer';
import { ZoomControl } from './blocks/ZoomControl';
import { MapControls } from './blocks/MapControls';
import { OtherControls } from './blocks/OtherControls';
import { MainControl } from './blocks/MainControl';
import { MainCard } from './blocks/MainCard';
import { SubControl } from './blocks/SubControl';
import { useMonitoringProvider } from './providers/MonitoringProvider';
import { LocationCard } from './blocks/LocationCard';
import { ShowImeiControl } from './blocks/ShowImeiControl';
import AppMap from '@/components/AppMap';

const MonitoringMap = () => {
  const { selectedLocation } = useMonitoringProvider();

  return (
    <AppMap>
      <CarsLayer />
      <MapControls>
        <ZoomControl />
        <OtherControls />
        <ShowImeiControl />
      </MapControls>
      <MainControl title="MONITORING">
        <MainCard />
      </MainControl>
      {selectedLocation && (
        <SubControl>
          <LocationCard />
        </SubControl>
      )}
    </AppMap>
  );
};

export { MonitoringMap };
