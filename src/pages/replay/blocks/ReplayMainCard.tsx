import { FormattedMessage } from 'react-intl';
import { useReplayContext } from '../providers/ReplayContext';
import { toAbsoluteUrl } from '@/utils';
import { CircularProgress } from '@mui/material';
import { TripsSearch } from '@/pages/trips/blocks/TripsSearch';
import { TimePicker } from '@/components';
import React, { useEffect, useMemo, useState } from 'react';
import ReplayTripCard from './ReplayTripCard';

export default function ReplayMainCard() {
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
    loading,
    replayData
  } = useReplayContext();

  const [errors, setErrors] = useState({
    searchDeviceQuery: '',
    startDate: '',
    endDate: ''
  });

  const validateForm = () => {
    const newErrors = {
      searchDeviceQuery: '',
      startDate: '',
      endDate: ''
    };

    if (!searchDeviceQuery) {
      newErrors.searchDeviceQuery = 'Device is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        newErrors.endDate = 'Date range cannot exceed 30 days';
      }
    }

    setErrors(newErrors);
    return !newErrors.searchDeviceQuery && !newErrors.startDate && !newErrors.endDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      search();
    }
  };

  const dateConstraints = useMemo(() => {
    const constraints = { startMin: '', startMax: '', endMin: '', endMax: '' };

    if (startDate) {
      constraints.endMin = startDate;

      const start = new Date(startDate);
      const maxEndDate = new Date(start);
      maxEndDate.setDate(maxEndDate.getDate() + 30);
      constraints.endMax = maxEndDate.toISOString().split('T')[0];
    }

    if (endDate) {
      constraints.startMax = endDate;

      const end = new Date(endDate);
      const minStartDate = new Date(end);
      minStartDate.setDate(minStartDate.getDate() - 30);
      constraints.startMin = minStartDate.toISOString().split('T')[0];
    }

    return constraints;
  }, [startDate, endDate]);

  useEffect(() => {
    validateForm();
  }, [searchDeviceQuery, startDate, endDate]);

  return (
    <div className="flex flex-col h-full">
      <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 shrink-0">
        <form onSubmit={handleSubmit}>
          <TripsSearch
            search={searchDeviceQuery || ''}
            setSearch={setSearchDeviceQuery}
            onSearch={() => validateForm() && search()}
          />
          <div className="grid grid-cols-2 gap-y-4 mt-4 gap-x-4 shrink-0">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
                <FormattedMessage id="TRIPS.FIELD.START_DATE" />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="input input-sm h-[34px] shrink-0">
                <input
                  type="date"
                  className={`dark:[color-scheme:dark] ${errors.startDate ? 'border-red-500' : ''}`}
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={dateConstraints.startMin}
                  max={dateConstraints.startMax}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
                <FormattedMessage id="TRIPS.FIELD.END_DATE" />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="input input-sm h-[34px] shrink-0">
                <input
                  type="date"
                  className={`dark:[color-scheme:dark] ${errors.endDate ? 'border-red-500' : ''}`}
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={dateConstraints.endMin}
                  max={dateConstraints.endMax}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
                <FormattedMessage id="TRIPS.FIELD.START_TIME" />
              </div>
              <TimePicker
                value={startTime || ''}
                onChange={(value) => setStartTime(value)}
                clearable={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-[#3F4254] dark:text-gray-50">
                <FormattedMessage id="TRIPS.FIELD.END_TIME" />
              </div>
              <TimePicker
                value={endTime || ''}
                onChange={(value) => setEndTime(value)}
                clearable={true}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-info justify-center text-xs font-medium shrink-0 mt-2 w-full"
            disabled={
              loading ||
              !!errors.searchDeviceQuery ||
              !!errors.startDate ||
              !!errors.endDate ||
              !searchDeviceQuery ||
              !startDate ||
              !endDate
            }
          >
            {loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <img src={toAbsoluteUrl('/media/icons/search.svg')} />
            )}
            <FormattedMessage id={'COMMON.SEARCH'} />
          </button>
        </form>
      </div>

      {replayData?.trips && replayData.trips.length > 0 && (
        <ReplayTripCard trips={replayData.allData} />
      )}
    </div>
  );
}
