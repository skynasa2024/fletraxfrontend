import { MainCard } from './blocks/MainCard';
import { MainControl } from '../monitoring/blocks/MainControl';
import { GeofenceLayer } from './blocks/GeofenceLayer';
import AppMap from '@/components/AppMap';

const GeofenceMap = () => {
  return (
    <AppMap>
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
