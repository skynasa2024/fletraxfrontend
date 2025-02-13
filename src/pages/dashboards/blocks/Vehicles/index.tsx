import { getVehicles, VehicleDetails } from '@/api/cars';
import { Paginated } from '@/api/common';
import { KeenIcon } from '@/components';
import VehicleCard from '@/pages/vehicle/components/VehicleCard';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLanguage } from '@/i18n';

export function VehicleList() {
  const intl = useIntl();
  const { isRTL } = useLanguage();
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();
  const remoteRowCount = useMemo(() => vehicles?.totalCount ?? 0, [vehicles]);
  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const isRowLoaded = ({ index }: { index: number }) =>
    isRTL() ? !!vehicles?.data[remoteRowCount - index - 1] : !!vehicles?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const computedStart = isRTL() ? remoteRowCount - stopIndex - 1 : startIndex;
    const computedStop = isRTL() ? remoteRowCount - startIndex - 1 : stopIndex;
    const vehicles = await getVehicles({ start: computedStart, end: computedStop });
    setVehicles((prev) => {
      const data = prev?.data ?? [];
      vehicles.data.forEach((vehicle, index) => {
        data[computedStart + index] = vehicle;
      });
      return {
        data,
        totalCount: vehicles.totalCount
      };
    });

    setMaxLoadedIndex((prev) => Math.max(prev, computedStop));
  };

  const fetchAllLoadedVehicles = async () => {
    const drivers = await getVehicles({ start: 0, end: maxLoadedIndex + 1 });
    setVehicles(drivers);
  };

  useEffect(() => {
    getVehicles({ start: 0, end: 20, search: searchQuery }).then(setVehicles);
  }, [searchQuery]);

  return (
    <div className="card">
      <div className="px-7 pt-6 flex items-center justify-between">
        <div className="card-title">
          <h3>
            <FormattedMessage id="DASHBOARD.VEHICLE_LIST.TITLE" defaultMessage="Vehicle" />
          </h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            <FormattedMessage
              id="DASHBOARD.VEHICLE_LIST.SUBTITLE"
              defaultMessage="You have {count, plural, one {vehicle} other {vehicles}}"
              values={{ count: vehicles?.totalCount ?? 0 }}
            />
          </h4>
        </div>
        <div className="flex gap-7 items-center">
          <div className="input max-w-48">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'COMMON.SEARCH', defaultMessage: 'Search' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-info px-8">
            <img src={toAbsoluteUrl('/media/icons/add-user.svg')} />
            <FormattedMessage id="DASHBOARD.VEHICLE_LIST.ADD_CAR" />
          </button>
        </div>
      </div>

      <div className="card-body pt-2 px-6 pb-3 [direction:ltr]">
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={remoteRowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <Grid
                  ref={registerChild}
                  className="scrollable-x !overflow-y-hidden"
                  height={291}
                  width={width}
                  columnCount={vehicles?.totalCount ?? 0}
                  columnWidth={402}
                  scrollToColumn={remoteRowCount - 1}
                  rowCount={1}
                  rowHeight={291}
                  overscanColumnCount={20}
                  onSectionRendered={({ columnOverscanStartIndex, columnOverscanStopIndex }) =>
                    onRowsRendered({
                      startIndex: columnOverscanStartIndex,
                      stopIndex: columnOverscanStopIndex
                    })
                  }
                  cellRenderer={({ key, columnIndex: index, style }) =>
                    vehicles && (
                      <div key={key} style={style} className="pr-4 !h-[271px]">
                        <VehicleCard
                          vehicle={
                            isRTL()
                              ? vehicles.data[remoteRowCount - index - 1]
                              : vehicles.data[index]
                          }
                          refetchVehicles={fetchAllLoadedVehicles}
                        />
                      </div>
                    )
                  }
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
