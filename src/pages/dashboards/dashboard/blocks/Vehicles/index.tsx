import { getVehicles, VehicleDetails } from '@/api/cars';
import { Paginated } from '@/api/common';
import { KeenIcon } from '@/components';
import VehicleCard from '@/pages/vehicle/components/VehicleCard';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();
  const remoteRowCount = useMemo(() => vehicles?.totalCount ?? 0, [vehicles]);
  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const isRowLoaded = ({ index }: { index: number }) => !!vehicles?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const vehicles = await getVehicles({ start: startIndex, end: stopIndex });
    setVehicles((prev) => {
      const data = prev?.data ?? [];
      vehicles.data.forEach((vehicle, index) => {
        data[startIndex + index] = vehicle;
      });
      return {
        data,
        totalCount: vehicles.totalCount
      };
    });

    setMaxLoadedIndex((prev) => Math.max(prev, stopIndex));
  };

  const fetchAllLoadedVehicles = async () => {
    const drivers = await getVehicles({ start: 0, end: maxLoadedIndex + 1 });
    setVehicles(drivers);
  };

  useEffect(() => {
    getVehicles({ start: 0, end: 10, search: searchQuery }).then(setVehicles);
  }, [searchQuery]);

  return (
    <div className="card">
      <div className="px-7 pt-6 flex items-center justify-between">
        <div className="card-title">
          <h3>Vehicle</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            You have {vehicles?.totalCount}{' '}
            {(vehicles?.totalCount ?? 0 > 1) ? 'vehicles' : 'vehicle'}
          </h4>
        </div>
        <div className="flex gap-7 items-center">
          <div className="input max-w-48">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-info px-8">
            <img src={toAbsoluteUrl('/media/icons/add-user.svg')} />
            Add Car
          </button>
        </div>
      </div>

      <div className="card-body pt-2 px-6 pb-3">
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
                      <div key={key} style={style} className="pr-4">
                        <VehicleCard
                          vehicle={vehicles.data[index]}
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
