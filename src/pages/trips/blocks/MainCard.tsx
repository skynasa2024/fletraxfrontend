import { useTripsContext } from '../providers/TripsContext';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import TripCard from './TripCard';
import { TripsSearch } from './TripsSearch';
import { FormattedMessage } from 'react-intl';
import { useEffect, useRef } from 'react';
import { ButtonRadioGroup } from '@/pages/dashboards/blocks/ButtonRadioGroup';
import { IntervalType } from '@/api/trips';
import { CircularProgress } from '@mui/material';

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
    hasMore,
    intervalType,
    setIntervalType,
    loading
  } = useTripsContext();

  const infiniteLoaderContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTrips?.();
        }
      },
      {
        root: infiniteLoaderContainerRef?.current,
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loaderRef, trips]);

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
        disabled={!searchDeviceQuery || loading}
      >
        {loading ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          <img src={toAbsoluteUrl('/media/icons/search.svg')} />
        )}
        <FormattedMessage id={'COMMON.SEARCH'} />
      </button>
      <ButtonRadioGroup<IntervalType>
        selection={intervalType}
        setSelection={setIntervalType}
        selections={[IntervalType.Trip, IntervalType.Parking]}
        className="w-full btn data-[selected=true]:btn-dark btn-light data-[selected=false]:btn-clear items-center justify-center"
      />
      {loading ? (
        <div className="text-center text-gray-500 h-full flex items-center justify-center py-2">
          <CircularProgress size={24} color="inherit" />
        </div>
      ) : (
        <div
          ref={infiniteLoaderContainerRef}
          className="scrollable-y-auto pb-2 flex flex-col gap-[10px]"
        >
          <>
            {trips.map((tripGroup) => (
              <TripCard
                key={tripGroup.date.getTime()}
                tripGroup={tripGroup}
                animation={intervalType === IntervalType.Trip}
              />
            ))}

            {hasMore ? (
              <div ref={loaderRef} className="text-center text-gray-500 py-2">
                <CircularProgress size={20} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-2">
                No more {intervalType === IntervalType.Parking ? 'parkings' : 'trips'}
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};
