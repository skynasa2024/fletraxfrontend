import { getVehicles, VehicleDetails } from '@/api/cars';
import { Paginated } from '@/api/common';
import { KeenIcon } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { Skeleton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { FormattedMessage, useIntl } from 'react-intl';

interface VehicleSearchProps {
  initialSearch?: {
    plate: string;
    id: string;
  };
  place?: 'top' | 'bottom';
}
export const VehicleSearch = ({ initialSearch, place = 'top' }: VehicleSearchProps) => {
  const { formatMessage } = useIntl();
  const [privateSearch, setPrivateSearch] = useState(initialSearch?.plate);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialSearch?.id);
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const remoteRowCount = useMemo(() => vehicles?.totalCount ?? 0, [vehicles]);

  const isRowLoaded = ({ index }: { index: number }) => !!vehicles?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const remoteData = await getVehicles({ start: startIndex, end: stopIndex });
    setVehicles((prev) => {
      const newData = prev?.data ?? [];
      remoteData.data.forEach((car, index) => {
        newData[startIndex + index] = car;
      });
      return {
        data: newData,
        totalCount: remoteData.totalCount
      };
    });
  };

  useEffect(() => {
    getVehicles({ start: 0, end: 10, search: privateSearch || '' }).then(setVehicles);
  }, [privateSearch]);

  useEffect(() => {
    if (initialSearch) setPrivateSearch(initialSearch.plate);
  }, [initialSearch]);

  return (
    <div className="input shrink-0 relative">
      <input
        type="text"
        placeholder={formatMessage({ id: 'VEHICLE.SEARCH.PLACEHOLDER' })}
        value={privateSearch}
        onChange={(e) => setPrivateSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        className="btn btn-icon"
        type="button"
        onClick={() => {
          setPrivateSearch('');
          setSelectedVehicleId(undefined);
        }}
      >
        <KeenIcon icon="cross" />
      </button>
      {(focused || hovered) && (
        <div
          className={`absolute ${place === 'top' ? 'bottom' : 'top'}-[calc(100%+4px)] px-2 left-0 w-full max-h-96 card dark:border-gray-200 mt-1 z-50 scrollable-y`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!vehicles && (
            <div className="p-2">
              <FormattedMessage id="COMMON.LOADING" />
            </div>
          )}
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={remoteRowCount}
              >
                {({ onRowsRendered, registerChild }) => (
                  <List
                    ref={registerChild}
                    className="scrollable-y !overflow-x-hidden"
                    height={384}
                    width={width}
                    rowCount={remoteRowCount}
                    rowHeight={44}
                    rowRenderer={({ key, index, style }) => {
                      const vehicle = vehicles?.data[index];

                      if (!vehicle) {
                        return <Skeleton key={key} style={style} />;
                      }

                      return (
                        <div key={key} style={style}>
                          <div
                            key={vehicle.vehicle.id}
                            className="p-2 hover:bg-gray-100 flex justify-between items-center gap-2 cursor-pointer"
                            onClick={() => {
                              setPrivateSearch(vehicle.vehicle.plate);
                              setSelectedVehicleId(vehicle.vehicle.id);
                              setHovered(false);
                            }}
                          >
                            <CarPlate plate={vehicle.vehicle.plate} />{' '}
                            <span className="font-monospace">{vehicle.vehicle.imei}</span>
                          </div>
                        </div>
                      );
                    }}
                    onRowsRendered={onRowsRendered}
                  />
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>
      )}
      <input type="hidden" name="vehicleId" value={selectedVehicleId} />
    </div>
  );
};
