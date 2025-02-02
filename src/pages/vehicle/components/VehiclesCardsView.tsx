import { getVehicles, VehicleDetails } from '@/api/cars';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';
import { Paginated } from '@/api/common.ts';
import VehicleCard from './VehicleCard';

const COLUMN_COUNT = 3;
const SCROLLBAR_WIDTH = 20;

type VehiclesCardsViewProps = {
  searchQuery: string;
  refetchStats: () => void;
};

export default function VehiclesCardsView({ searchQuery, refetchStats }: VehiclesCardsViewProps) {
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();

  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);

  const remoteRowCount = useMemo(() => {
    const totalCount = vehicles?.totalCount ?? 0;
    return Math.ceil(totalCount / COLUMN_COUNT);
  }, [vehicles]);

  const isRowLoaded = ({ index: rowIndex }: { index: number }) => {
    if (!vehicles?.data) return false;
    const baseIndex = rowIndex * COLUMN_COUNT;
    for (let i = 0; i < COLUMN_COUNT; i++) {
      if (!vehicles.data[baseIndex + i]) {
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

    const fetched = await getVehicles({
      start: itemStart,
      end: itemStop + 1,
      search: searchQuery
    });

    setVehicles((prev) => {
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
    const fetched = await getVehicles({
      start: 0,
      end: maxLoadedIndex + 1,
      search: searchQuery
    });
    setVehicles(fetched);
  }

  useEffect(() => {
    (async () => {
      const fetched = await getVehicles({
        start: 0,
        end: 10,
        search: searchQuery
      });
      setVehicles(fetched);
      setMaxLoadedIndex(10);
    })();
  }, [searchQuery]);

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
                    const vehicle = vehicles?.data[itemIndex];

                    if (itemIndex >= (vehicles?.totalCount ?? 0)) {
                      return null;
                    }

                    return (
                      <div key={key} style={style} className="p-2">
                        <VehicleCard
                          vehicle={vehicle}
                          refetchVehicles={refetchAllLoadedRows}
                          refetchStats={refetchStats}
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
