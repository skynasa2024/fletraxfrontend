import AppMap from '@/components/AppMap';
import { TripsSearch } from '../trips/blocks/TripsSearch';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CircularProgress } from '@mui/material';
import { toAbsoluteUrl } from '@/utils';
import { MainControl } from '../monitoring/blocks/MainControl';

export default function ReplayPage() {
  const intl = useIntl();
  return (
    <AppMap>
      <MainControl title={intl.formatMessage({ id: 'SIDEBAR.MENU.REPLAY' })} fullHeight={false}>
        <SearchCard />
      </MainControl>
    </AppMap>
  );
}

function SearchCard() {
  const [searchDeviceQuery, setSearchDeviceQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  function search() {}
  return (
    <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3">
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
    </div>
  );
}
