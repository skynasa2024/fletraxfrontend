import { FormattedMessage } from 'react-intl';
import { useReplayContext } from '../providers/ReplayContext';
import { toAbsoluteUrl } from '@/utils';
import { CircularProgress } from '@mui/material';
import { TripsSearch } from '@/pages/trips/blocks/TripsSearch';
import { TimePicker } from '@/components';
import React, { useEffect, useMemo, useState } from 'react';
import ReplayTripCard from './ReplayTripCard';
import { useAuthContext } from '@/auth';
import {
  format,
  isAfter,
  isBefore,
  addDays,
  differenceInDays,
  parseISO,
  startOfDay
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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

  console.log(replayData?.allData);

  const { currentUser } = useAuthContext();

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

    // Get current date in user's timezone or default to system timezone
    const userTimezone = currentUser?.timezone || 'UTC';
    const nowInUserTz = toZonedTime(new Date(), userTimezone);
    const todayInUserTz = startOfDay(nowInUserTz);

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      try {
        // Convert the selected date to user's timezone
        const startDateObj = parseISO(startDate);
        const startDateInUserTz = toZonedTime(startDateObj, userTimezone);

        if (isAfter(startOfDay(startDateInUserTz), todayInUserTz)) {
          newErrors.startDate = 'Start date cannot be in the future';
        }
      } catch (error) {
        newErrors.startDate = 'Invalid date format';
      }
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate) {
      try {
        // Convert dates to user's timezone for comparison
        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);

        const startDateInUserTz = toZonedTime(startDateObj, userTimezone);
        const endDateInUserTz = toZonedTime(endDateObj, userTimezone);

        if (isBefore(startOfDay(endDateInUserTz), startOfDay(startDateInUserTz))) {
          newErrors.endDate = 'End date must be after start date';
        } else if (isAfter(startOfDay(endDateInUserTz), todayInUserTz)) {
          newErrors.endDate = 'End date cannot be in the future';
        } else {
          const diffDays = differenceInDays(
            startOfDay(endDateInUserTz),
            startOfDay(startDateInUserTz)
          );

          if (diffDays > 30) {
            newErrors.endDate = 'Date range cannot exceed 30 days';
          }
        }
      } catch (error) {
        newErrors.endDate = 'Invalid date format';
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
    // Get today's date in user's timezone or default to UTC
    const userTimezone = currentUser?.timezone || 'UTC';
    try {
      const nowInUserTz = toZonedTime(new Date(), userTimezone);
      const today = format(nowInUserTz, 'yyyy-MM-dd');

      const constraints = {
        startMin: '',
        startMax: today,
        endMin: '',
        endMax: today
      };

      if (startDate) {
        constraints.endMin = startDate;

        // Calculate max end date (start date + 30 days) in user's timezone
        const startDateObj = parseISO(startDate);
        const startDateInUserTz = toZonedTime(startDateObj, userTimezone);
        const maxEndDateInUserTz = addDays(startDateInUserTz, 30);
        const maxEndDateStr = format(maxEndDateInUserTz, 'yyyy-MM-dd');

        constraints.endMax = isBefore(parseISO(maxEndDateStr), parseISO(today))
          ? maxEndDateStr
          : today;
      }

      if (endDate) {
        constraints.startMax = endDate;

        // Calculate min start date (end date - 30 days) in user's timezone
        const endDateObj = parseISO(endDate);
        const endDateInUserTz = toZonedTime(endDateObj, userTimezone);
        const minStartDateInUserTz = addDays(endDateInUserTz, -30);

        constraints.startMin = format(minStartDateInUserTz, 'yyyy-MM-dd');
      }

      return constraints;
    } catch (error) {
      // Fallback to basic constraints if any date parsing fails
      return {
        startMin: '',
        startMax: new Date().toISOString().split('T')[0],
        endMin: '',
        endMax: new Date().toISOString().split('T')[0]
      };
    }
  }, [startDate, endDate, currentUser?.timezone]);

  useEffect(() => {
    validateForm();
  }, [searchDeviceQuery, startDate, endDate]);

  return (
    <div className="flex flex-col h-full">
      <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 grow-0">
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

      {replayData?.allData && replayData.allData.length > 0 && (
        <ReplayTripCard trips={replayData.allData} />
      )}
    </div>
  );
}
