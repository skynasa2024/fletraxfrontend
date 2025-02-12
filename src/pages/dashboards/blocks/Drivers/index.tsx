import { Paginated } from '@/api/common';
import { useEffect, useMemo, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { deleteDriver, DriverDetails, getDrivers } from '@/api/drivers';
import { DriverCard } from './DriverCard';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';
import { KeenIcon } from '@/components';
import { useSnackbar } from 'notistack';

const DriverList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [drivers, setDrivers] = useState<Paginated<DriverDetails>>();
  const remoteRowCount = useMemo(() => drivers?.totalCount ?? 0, [drivers]);
  const [searchQuery, setSearchQuery] = useState('');

  const isRowLoaded = ({ index }: { index: number }) => !!drivers?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const drivers = await getDrivers({ start: startIndex, end: stopIndex });
    setDrivers((prev) => {
      const data = prev?.data ?? [];
      drivers.data.forEach((driver, index) => {
        data[startIndex + index] = driver;
      });
      return {
        data,
        totalCount: drivers.totalCount
      };
    });
  };

  useEffect(() => {
    getDrivers({ start: 0, end: 10, search: searchQuery }).then(setDrivers);
  }, [searchQuery]);

  return (
    <div className="card">
      <div className="px-7 pt-6 flex items-center justify-between">
        <div className="card-title">
          <h3>Driver</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            You have {drivers?.totalCount}{' '}
            {(drivers?.totalCount ?? 0 > 1) ? 'customers' : 'customer'}
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
          <a href="/drivers/add-driver">
            <button className="btn btn-info px-4">
              <img src={toAbsoluteUrl('/media/icons/add-user.svg')} />
              Add Driver
            </button>
          </a>
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
                  columnCount={drivers?.totalCount ?? 0}
                  columnWidth={402}
                  rowCount={1}
                  rowHeight={291}
                  onSectionRendered={({ columnOverscanStartIndex, columnOverscanStopIndex }) =>
                    onRowsRendered({
                      startIndex: columnOverscanStartIndex,
                      stopIndex: columnOverscanStopIndex
                    })
                  }
                  cellRenderer={({ key, columnIndex: index, style }) =>
                    drivers && (
                      <div key={key} style={style} className="pr-4">
                        <DriverCard
                          driver={drivers.data[index]}
                          onDelete={async () => {
                            const offset = {
                              start: Math.max(0, index - 10),
                              end: index + 10
                            };
                            await deleteDriver(drivers.data[index].id);
                            enqueueSnackbar('Driver deleted successfully', {
                              variant: 'success'
                            });
                            const driverRequest = await getDrivers(offset);
                            let newDrivers: Paginated<DriverDetails> = {
                              totalCount: driverRequest.totalCount,
                              data: []
                            };
                            for (let i = offset.start; i <= offset.end; i++) {
                              newDrivers.data[i] = driverRequest.data[i];
                            }
                            setDrivers(newDrivers);
                          }}
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
};

export { DriverList };
