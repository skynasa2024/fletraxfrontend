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
import AppMap from '@/components/AppMap';

const TripsMap = () => {
  const { path } = useTripsContext();

  return (
    <AppMap>
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
    </AppMap>
  );
};

export { TripsMap };
