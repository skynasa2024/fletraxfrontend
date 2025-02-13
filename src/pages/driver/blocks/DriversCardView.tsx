import { Paginated } from '@/api/common';
import { deleteDriver, DriverDetails, getDrivers } from '@/api/drivers';
import { DriverCard } from '@/pages/dashboards/blocks/Drivers/DriverCard';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';

type DriversCardViewProps = {
  refetch: () => void;
  searchQuery: string;
};

const COLUMN_COUNT = 3;
const SCROLLBAR_WIDTH = 20;

export default function DriversCardView({
  refetch: refetchStats,
  searchQuery
}: DriversCardViewProps) {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [drivers, setDrivers] = useState<Paginated<DriverDetails>>();

  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);

  const remoteRowCount = useMemo(() => {
    const totalCount = drivers?.totalCount ?? 0;
    return Math.ceil(totalCount / COLUMN_COUNT);
  }, [drivers]);

  const isRowLoaded = ({ index: rowIndex }: { index: number }) => {
    if (!drivers?.data) return false;
    const baseIndex = rowIndex * COLUMN_COUNT;
    for (let i = 0; i < COLUMN_COUNT; i++) {
      if (!drivers.data[baseIndex + i]) {
        return false;
      }
    }
    return true;
  };

  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const itemStart = startIndex * COLUMN_COUNT;
    const itemStop = stopIndex * COLUMN_COUNT + (COLUMN_COUNT - 1);

    const fetched = await getDrivers({
      start: itemStart,
      end: itemStop + 1,
      search: searchQuery
    });

    setDrivers((prev) => {
      const oldData = prev?.data ?? [];
      const newData = [...oldData];
      fetched.data.forEach((item, idx) => {
        newData[itemStart + idx] = item;
      });
      return {
        data: newData,
        totalCount: fetched.totalCount
      };
    });

    setMaxLoadedIndex((prevMax) => Math.max(prevMax, itemStop));
  };

  async function refetchAllLoadedRows() {
    if (maxLoadedIndex < 0) return;
    const fetched = await getDrivers({
      start: 0,
      end: maxLoadedIndex + 1,
      search: searchQuery
    });
    setDrivers(fetched);
  }

  useEffect(() => {
    (async () => {
      const fetched = await getDrivers({
        start: 0,
        end: 10,
        search: searchQuery
      });
      setDrivers(fetched);
      setMaxLoadedIndex(10);
    })();
  }, [searchQuery]);

  if (!drivers?.data.length)
    return <div className="text-gray-600 text-center font-semibold">No Drivers Available</div>;

  return (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={remoteRowCount}>
      {({ onRowsRendered, registerChild }) => (
        <div style={{ width: '100%', height: '450px' }}>
          <AutoSizer>
            {({ width, height }) => {
              const widthWithoutScrollBar = width - SCROLLBAR_WIDTH;

              return (
                <Grid
                  ref={registerChild}
                  width={width}
                  height={height}
                  columnCount={COLUMN_COUNT}
                  columnWidth={widthWithoutScrollBar / COLUMN_COUNT}
                  rowCount={remoteRowCount}
                  rowHeight={275}
                  overscanRowCount={2}
                  onSectionRendered={({ rowOverscanStartIndex, rowOverscanStopIndex }) =>
                    onRowsRendered({
                      startIndex: rowOverscanStartIndex,
                      stopIndex: rowOverscanStopIndex
                    })
                  }
                  cellRenderer={({ key, rowIndex, columnIndex, style }) => {
                    const itemIndex = rowIndex * COLUMN_COUNT + columnIndex;
                    const driver = drivers?.data[itemIndex];

                    if (itemIndex >= (drivers?.totalCount ?? 0)) {
                      return null;
                    }

                    return (
                      <div key={key} style={style} className="p-2">
                        <DriverCard
                          driver={driver}
                          refetchStats={refetchStats}
                          onDelete={async () => {
                            await deleteDriver(drivers!.data[itemIndex].id);
                            enqueueSnackbar(
                              intl.formatMessage({
                                id: 'DRIVER.DELETE_SUCCESS',
                                defaultMessage: 'Driver deleted successfully'
                              }),
                              { variant: 'success' }
                            );
                            await refetchAllLoadedRows();
                          }}
                        />
                      </div>
                    );
                  }}
                />
              );
            }}
          </AutoSizer>
        </div>
      )}
    </InfiniteLoader>
  );
}
