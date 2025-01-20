import { useEffect, useMemo, useState } from 'react';
import { ButtonRadioGroup } from './ButtonRadioGroup';
import { CarMileageAndEngine, getCarsMileageAndEngine } from '@/api/cars';
import { CircularProgress, Skeleton } from '@mui/material';
import { Paginated } from '@/api/common';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import Image from '@/components/image/Image';
import { KeenIcon } from '@/components';

const MileageEngineGraph = () => {
  const [selection, setSelection] = useState('All');
  const [data, setData] = useState<Paginated<CarMileageAndEngine>>();
  const remoteRowCount = useMemo(() => data?.totalCount ?? 0, [data]);
  const [largestMileage, largestEngine] = useMemo(() => {
    if (!data) {
      return [0, 0];
    }
    return data.data.reduce(
      (acc, car) => [Math.max(acc[0], car.mileage), Math.max(acc[1], car.engine)],
      [0, 0]
    );
  }, [data]);

  const isRowLoaded = ({ index }: { index: number }) => !!data?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const remoteData = await getCarsMileageAndEngine({ start: startIndex, end: stopIndex });
    setData((prev) => {
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
    getCarsMileageAndEngine({ start: 0, end: 10 }).then(setData);
  }, []);

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <div className="card hover:shadow-md h-full">
      <div className="card-header">
        <div className="card-title">
          <h3>Mileage & Engine Hours</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">All today</h4>
        </div>

        <ButtonRadioGroup
          selection={selection}
          setSelection={setSelection}
          selections={['Engine', 'Mileage', 'All']}
        />
      </div>
      <div className="card-body flex flex-col grow px-3 py-3">
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={remoteRowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  ref={registerChild}
                  className="scrollable-y !overflow-x-hidden"
                  height={height}
                  width={width}
                  rowCount={remoteRowCount}
                  rowHeight={56}
                  rowRenderer={({ key, index, style }) => {
                    const car = data.data[index];

                    if (!car) {
                      return <Skeleton key={key} style={style} />;
                    }

                    return (
                      <div key={key} style={style}>
                        <div className="flex gap-4 py-2">
                          <Image
                            src={car.vehicle.brandImage}
                            className="size-12 object-cover"
                            fallback={
                              <div className="bg-neutral-200 size-10 aspect-square rounded-full flex items-center justify-center">
                                <KeenIcon style="duotone" icon="car" className="text-black" />
                              </div>
                            }
                          />
                          <div className="w-40">
                            <div className="font-medium text-sm text-gray-800">
                              {car.vehicle.plate}
                            </div>
                            <div className="text-sm text-gray-600">{car.vehicle.imei}</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-center gap-1">
                            {(selection === 'Mileage' || selection === 'All') && (
                              <div
                                className="h-2 bg-[#5151F9] rounded-lg"
                                style={{
                                  width: `${(car.mileage / largestMileage) * 100}%`
                                }}
                              />
                            )}
                            {(selection === 'Engine' || selection === 'All') && (
                              <div
                                className="h-2 bg-[#FFA800] rounded-lg"
                                style={{
                                  width: `${(car.engine / largestEngine) * 100}%`
                                }}
                              />
                            )}
                          </div>
                          <div className="w-40 flex flex-col justify-center">
                            {(selection === 'Mileage' || selection === 'All') && (
                              <div className="text-sm">{car.formattedMilage}</div>
                            )}
                            {(selection === 'Engine' || selection === 'All') && (
                              <div className="text-sm">{car.formattedEngine}</div>
                            )}
                          </div>
                        </div>
                        <div className="border-b-2 border-dashed" />
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
    </div>
  );
};

export { MileageEngineGraph };
