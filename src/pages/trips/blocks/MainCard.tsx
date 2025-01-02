import { useTripsContext } from '../providers/TripsContext';
import 'react-resizable/css/styles.css';
import { format } from 'date-fns';
import { toAbsoluteUrl } from '@/utils';
import TripCard from './TripCard';
import { TripsSearch } from './TripsSearch';

export const MainCard = () => {
  const {
    searchDeviceQuery,
    setSearchDeviceQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    search,
    trips
  } = useTripsContext();

  return (
    <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 h-full">
      <TripsSearch search={searchDeviceQuery} setSearch={setSearchDeviceQuery} onSearch={search} />
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">Start Date</div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (!startDate) {
                  setStartDate(new Date(e.target.value));
                  return;
                }
                const newDate = new Date(e.target.value);
                setStartDate(
                  new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    startDate.getHours(),
                    startDate.getMinutes()
                  )
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">End Date</div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (!endDate) {
                  setEndDate(new Date(e.target.value));
                  return;
                }
                const newDate = new Date(e.target.value);
                setEndDate(
                  new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    endDate.getHours(),
                    endDate.getMinutes()
                  )
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">Start Time</div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="time"
              value={startDate ? format(startDate, 'HH:mm') : ''}
              onChange={(e) => {
                if (!startDate) {
                  setStartDate(new Date(e.target.value));
                  return;
                }
                const time = e.target.value.split(':');
                setStartDate(
                  new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate(),
                    +time[0],
                    +time[1]
                  )
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">End Time</div>
          <div className="input input-sm h-[34px] shrink-0">
            <input
              type="time"
              value={endDate ? format(endDate, 'HH:mm') : ''}
              onChange={(e) => {
                if (!endDate) {
                  setEndDate(new Date(e.target.value));
                  return;
                }
                const time = e.target.value.split(':');
                setEndDate(
                  new Date(
                    endDate.getFullYear(),
                    endDate.getMonth(),
                    endDate.getDate(),
                    +time[0],
                    +time[1]
                  )
                );
              }}
            />
          </div>
        </div>
      </div>
      <button className="btn btn-info justify-center text-xs font-medium shrink-0" onClick={search}>
        <img src={toAbsoluteUrl('/media/icons/search.svg')} />
        Search
      </button>
      <div className="scrollable-y-auto pb-2 flex flex-col gap-[10px]">
        {trips.map((tripGroup) => (
          <TripCard key={tripGroup.date.getTime()} tripGroup={tripGroup} />
        ))}
      </div>
    </div>
  );
};
