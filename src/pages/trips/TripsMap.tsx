import { AttributionControl, MapContainer, TileLayer } from 'react-leaflet';
import { MainCard } from './blocks/MainCard';
import { ZoomControl } from '../monitoring/blocks/ZoomControl';
import { OtherControls } from '../monitoring/blocks/OtherControls';
import { MainControl } from '../monitoring/blocks/MainControl';
import { MapControls } from '../monitoring/blocks/MapControls';
import { TripsLayer } from './blocks/TripsLayer';

const TripsMap = () => {
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
      <TripsLayer />
      <AttributionControl prefix="Leaflet" />
      <MapControls>
        <ZoomControl />
        <OtherControls />
      </MapControls>
      <MainControl title="Trips">
        <MainCard />
      </MainControl>
    </MapContainer>
  );
};

export { TripsMap };
