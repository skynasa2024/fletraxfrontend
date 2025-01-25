import { MainCard } from './blocks/MainCard';
import { ZoomControl } from '../monitoring/blocks/ZoomControl';
import { OtherControls } from '../monitoring/blocks/OtherControls';
import { MainControl } from '../monitoring/blocks/MainControl';
import { MapControls } from '../monitoring/blocks/MapControls';
import { GeofenceLayer } from './blocks/GeofenceLayer';
import AppMap from '@/components/AppMap';

const GeofenceMap = () => {
  return (
    <AppMap>
      <MapControls>
        <ZoomControl />
        <OtherControls />
      </MapControls>
      <GeofenceLayer />
      <MainControl
        title="Geofence"
        bar={
          <a
            className="btn btn-info btn-clear btn-sm !border-info !border"
            href="/geofences/add"
            onClick={(e) => e.stopPropagation()}
          >
            Add Geofence
          </a>
        }
      >
        <MainCard />
      </MainControl>
    </AppMap>
  );
};

export { GeofenceMap };
