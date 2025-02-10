import { MainCard } from './blocks/MainCard';
import { MainControl } from '../monitoring/blocks/MainControl';
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
