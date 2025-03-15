import { FormattedMessage } from 'react-intl';
import { useReplayContext } from '../providers/ReplayContext';
import { toAbsoluteUrl } from '@/utils';
import { CircularProgress } from '@mui/material';
import { TripsSearch } from '@/pages/trips/blocks/TripsSearch';
import { TimePicker } from '@/components';

export const ReplayMainCard = () => {
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
    loading
  } = useReplayContext();

  return (
    <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 h-full">
      {/* Device Search Field */}
      <TripsSearch search={searchDeviceQuery} setSearch={setSearchDeviceQuery} onSearch={search} />

      {/* Date and Time Fields */}
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
          <TimePicker value={startTime || ''} onChange={setStartTime} clearable={true} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
            <FormattedMessage id="TRIPS.FIELD.END_TIME" />
          </div>
          <TimePicker value={endTime || ''} onChange={setEndTime} clearable={true} />
        </div>
      </div>

      {/* Search Button */}
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
};
