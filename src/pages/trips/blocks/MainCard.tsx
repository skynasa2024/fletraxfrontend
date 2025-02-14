import { useTripsContext } from '../providers/TripsContext';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import TripCard from './TripCard';
import { TripsSearch } from './TripsSearch';
import { FormattedMessage } from 'react-intl';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List
} from 'react-virtualized';
import React, { useRef } from 'react';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';

const measurerCache = new CellMeasurerCache({
  defaultHeight: 200,
  fixedWidth: true
});

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
    trips
  } = useTripsContext();

  const listRef = useRef<any>(null);

  const isRowLoaded = ({ index }: { index: number }) => !!trips[index];
  const rowCount = trips.length + 1;

  const rowRenderer = ({
    index,
    key,
    style,
    parent
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
    parent: MeasuredCellParent;
  }) => {
    const tripGroup = trips[index];
    if (!tripGroup) {
      return null;
    }
    return (
      <CellMeasurer key={key} style={style} cache={measurerCache} index={index} parent={parent}>
        {({ measure, registerChild }) => (
          <div ref={registerChild}>
            <TripCard
              tripGroup={tripGroup}
              measure={() => {
                measure();
                listRef.current?.recomputeRowHeights(index);
              }}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

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
      {/* <div className="scrollable-y-auto pb-2 flex flex-col gap-[10px]">
        {trips.map((tripGroup) => (
          <TripCard key={tripGroup.date.getTime()} tripGroup={tripGroup} />
        ))}
      </div> */}
      <div style={{ width: '100%', height: '550px' }}>
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={(() => {}) as any}
              rowCount={rowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#ddddeb8d #edf2f70'
                  }}
                  ref={(ref) => {
                    registerChild(ref);
                    listRef.current = ref;
                  }}
                  height={height}
                  rowHeight={measurerCache.rowHeight}
                  width={width}
                  onRowsRendered={onRowsRendered}
                  rowCount={rowCount}
                  rowRenderer={rowRenderer}
                  deferredMeasurementCache={measurerCache}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
