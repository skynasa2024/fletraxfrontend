import { MainCard } from './blocks/MainCard';
import { MainControl } from '../monitoring/blocks/MainControl';
import { GeofenceLayer } from './blocks/GeofenceLayer';
import AppMap from '@/components/AppMap';
import { Link } from 'react-router';

const GeofenceMap = () => {
  return (
    <AppMap>
      <GeofenceLayer />
      <MainControl
        title="Geofence"
        bar={
          <Link
            className="btn btn-info btn-clear btn-sm !border-info !border"
            to="/geofences/add"
            onClick={(e) => e.stopPropagation()}
          >
            Add Geofence
          </Link>
        }
      >
        <MainCard />
      </MainControl>
    </AppMap>
  );
};

export { GeofenceMap };
