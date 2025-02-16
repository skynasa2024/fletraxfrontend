import { useTripsContext } from '../providers/TripsContext';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import TripCard from './TripCard';
import { TripsSearch } from './TripsSearch';
import { FormattedMessage } from 'react-intl';
import { TripGroup } from '@/api/trips';
import { withInfiniteScroll } from '@/HOC/withInfiniteScroll';

export const MainCard = () => {
  const {
    searchDeviceQuery,
    setSearchDeviceQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    search,
    trips,
    loadMoreTrips,
    hasMore
  } = useTripsContext();

  const InfiniteTripList = withInfiniteScroll(TripList);

  return (
    <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 h-full">
      <TripsSearch search={searchDeviceQuery} setSearch={setSearchDeviceQuery} onSearch={search} />
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
            <FormattedMessage id="TRIPS.FIELD.START_DATE" />
          </div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="date"
              className="dark:[color-scheme:dark]"
              value={startDate ? startDate : ''}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
            <FormattedMessage id="TRIPS.FIELD.END_DATE" />
          </div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="date"
              className="dark:[color-scheme:dark]"
              value={endDate ? endDate : ''}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
            <FormattedMessage id="TRIPS.FIELD.START_TIME" />
          </div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="time"
              value={startTime ? startTime : ''}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
            <FormattedMessage id="TRIPS.FIELD.END_TIME" />
          </div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="time"
              value={endTime ? endTime : ''}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-info justify-center text-xs font-medium shrink-0"
        onClick={search}
        disabled={!searchDeviceQuery}
      >
        <img src={toAbsoluteUrl('/media/icons/search.svg')} />
        <FormattedMessage id="COMMON.SEARCH" />
      </button>
      <div className="scrollable-y-auto pb-2 flex flex-col gap-[10px]">
        <InfiniteTripList trips={trips} loadMore={loadMoreTrips!} hasMore={hasMore!} />
      </div>
    </div>
  );
};

type TripsListProps = {
  trips: TripGroup[];
};

function TripList({ trips }: TripsListProps) {
  return (
    <>
      {trips.map((tripGroup) => (
        <TripCard key={tripGroup.date.getTime()} tripGroup={tripGroup} />
      ))}
    </>
  );
}
