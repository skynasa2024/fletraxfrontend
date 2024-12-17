import { AttributionControl, MapContainer, TileLayer } from 'react-leaflet';
import { MainCard } from './blocks/MainCard';
import { ZoomControl } from '../monitoring/blocks/ZoomControl';
import { OtherControls } from '../monitoring/blocks/OtherControls';
import { MainControl } from '../monitoring/blocks/MainControl';
import { MapControls } from '../monitoring/blocks/MapControls';
import { TripsLayer } from './blocks/TripsLayer';
import { useTripsContext } from './providers/TripsContext';
import { SubControl } from '../monitoring/blocks/SubControl';
import { PlaybackCard } from './blocks/PlaybackCard';
import { AnimationProvider } from './providers/AnimationContext';

const TripsMap = () => {
  const { path } = useTripsContext();

  return (
    <MapContainer
      center={[38.9637, 35.2433]}
      zoom={7}
      className="size-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AttributionControl prefix="Leaflet" />
      <MapControls>
        <ZoomControl />
        <OtherControls />
      </MapControls>
      <AnimationProvider>
        <TripsLayer />
        <MainControl title="Trips">
          <MainCard />
        </MainControl>
        {path && (
          <SubControl>
            <PlaybackCard />
          </SubControl>
        )}
      </AnimationProvider>
    </MapContainer>
  );
};

export { TripsMap };
