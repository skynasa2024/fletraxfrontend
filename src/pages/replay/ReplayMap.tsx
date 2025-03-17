import ReplayMainCard from './blocks/ReplayMainCard';
import { MainControl } from '../monitoring/blocks/MainControl';
import { SubControl } from '../monitoring/blocks/SubControl';
import AppMap from '@/components/AppMap';
import { useIntl } from 'react-intl';
import { useReplayContext } from './providers/ReplayContext';
import { ReplayLayer } from './blocks/ReplayLayer';
import { ReplayAnimationProvider } from './providers/ReplayAnimationContext';
import { ReplayPlaybackCard } from './blocks/ReplayPlaybackCard';
import { IntervalType } from '@/api/trips';

const ReplayMap = () => {
  const { replayData, selectedTrip } = useReplayContext();
  const intl = useIntl();

  return (
    <AppMap>
      <ReplayAnimationProvider>
        <ReplayLayer />
        <MainControl title={intl.formatMessage({ id: 'SIDEBAR.MENU.REPLAY' })}>
          <ReplayMainCard />
        </MainControl>
        {selectedTrip?.intervalType === IntervalType.Trip &&
          replayData?.trips &&
          replayData?.trips?.length > 0 && (
            <SubControl>
              <ReplayPlaybackCard />
            </SubControl>
          )}
      </ReplayAnimationProvider>
    </AppMap>
  );
};

export { ReplayMap };
