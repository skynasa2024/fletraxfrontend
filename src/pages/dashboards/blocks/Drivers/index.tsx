import { Paginated } from '@/api/common';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { deleteDriver, DriverDetails, getDrivers } from '@/api/drivers';
import { DriverCard } from './DriverCard';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';
import { KeenIcon } from '@/components';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguage } from '@/i18n';

const CARD_WIDTH = 402; // Base card width

const DriverList = () => {
  const intl = useIntl();
  const { isRTL } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [drivers, setDrivers] = useState<Paginated<DriverDetails>>();
  const remoteRowCount = useMemo(() => drivers?.totalCount ?? 0, [drivers]);
  const [searchQuery, setSearchQuery] = useState('');
  const gridRef = useRef<Grid>(null);

  const isRowLoaded = ({ index }: { index: number }) =>
    isRTL() ? !!drivers?.data[remoteRowCount - index - 1] : !!drivers?.data[index];

  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const computedStart = isRTL() ? Math.max(remoteRowCount - stopIndex - 1, 0) : startIndex;
    const computedStop = isRTL() ? Math.max(remoteRowCount - startIndex - 1, 0) : stopIndex;
    const vehicles = await getDrivers({ start: computedStart, end: computedStop });
    setDrivers((prev) => {
      const data = prev?.data ?? [];
      vehicles.data.forEach((vehicle, index) => {
        data[computedStart + index] = vehicle;
      });
      return {
        data,
        totalCount: vehicles.totalCount
      };
    });
  };

  useEffect(() => {
    getDrivers({ start: 0, end: 10, search: searchQuery }).then(setDrivers);
  }, [searchQuery]);

  const getColumnWidth = (width: number) => {
    const totalWidth = remoteRowCount * CARD_WIDTH;
    return width - totalWidth;
  };

  return (
    <div className="card">
      <div className="px-7 pt-6 flex items-center justify-between">
        <div className="card-title">
          <h3>
            <FormattedMessage id="DRIVER.TITLE" defaultMessage="Driver" />
          </h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            <FormattedMessage
              id="DRIVER.SUBTITLE"
              defaultMessage="You have {count} {count, plural, one {customer} other {customers}}"
              values={{ count: drivers?.totalCount ?? 0 }}
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
          <a href="/drivers/add-driver">
            <button className="btn btn-info px-4">
              <img src={toAbsoluteUrl('/media/icons/add-user.svg')} />
              <FormattedMessage id="DRIVER.ADD" defaultMessage="Add Driver" />
            </button>
          </a>
        </div>
      </div>

      <div className="card-body pt-2 px-6 pb-3 [direction:ltr]">
        <AutoSizer disableHeight onResize={() => gridRef.current?.recomputeGridSize()}>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={remoteRowCount + (isRTL() && getColumnWidth(width) > 0 ? 1 : 0)}
            >
              {({ onRowsRendered, registerChild }) => (
                <Grid
                  ref={(e) => {
                    registerChild(e);
                    gridRef.current = e;
                  }}
                  className="scrollable-x !overflow-y-hidden"
                  height={291}
                  width={width}
                  columnCount={remoteRowCount + (isRTL() && getColumnWidth(width) > 0 ? 1 : 0)}
                  columnWidth={({ index }) =>
                    isRTL() && index === 0 && getColumnWidth(width) > 0
                      ? getColumnWidth(width)
                      : CARD_WIDTH
                  }
                  rowCount={1}
                  rowHeight={291}
                  scrollToColumn={isRTL() ? remoteRowCount - 1 : undefined}
                  onSectionRendered={({ columnOverscanStartIndex, columnOverscanStopIndex }) =>
                    onRowsRendered({
                      startIndex: columnOverscanStartIndex,
                      stopIndex: columnOverscanStopIndex
                    })
                  }
                  cellRenderer={({ key, columnIndex: index, style }) => {
                    if (!drivers) return null;
                    const indexOffset = getColumnWidth(width) > 1 ? 1 : 0;
                    const driver = isRTL()
                      ? drivers.data[remoteRowCount - index - 1 + indexOffset]
                      : drivers.data[index];

                    if (isRTL() && indexOffset && index === 0) {
                      return (
                        <div key={key} style={style}>
                          <div className="w-full h-full" />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        style={{ ...style, direction: isRTL() ? 'rtl' : 'ltr' }}
                        className="pe-4"
                      >
                        <DriverCard
                          driver={driver}
                          onDelete={async () => {
                            const offset = {
                              start: Math.max(0, index - 10),
                              end: index + 10
                            };
                            await deleteDriver(drivers.data[index].id);
                            // Updated deletion message using intl.formatMessage
                            enqueueSnackbar(
                              intl.formatMessage({
                                id: 'DRIVER.DELETE_SUCCESS',
                                defaultMessage: 'Driver deleted successfully'
                              }),
                              { variant: 'success' }
                            );
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
                    );
                  }}
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
