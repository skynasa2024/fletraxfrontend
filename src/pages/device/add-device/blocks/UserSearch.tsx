import { Paginated } from '@/api/common';
import { getUsers, getUsersUnderParent, UserModel } from '@/api/user';
import { KeenIcon } from '@/components';
import { Skeleton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { FormattedMessage, useIntl } from 'react-intl';

interface UserSearchProps {
  search?: string;
  // eslint-disable-next-line no-unused-vars
  setSearch?: (value: string) => void;
  parentId?: string;
  // eslint-disable-next-line no-unused-vars
  onSelectUserId?: (userId: string, name: string) => void;
  initialSearch?: string;
}
export const UserSearch = ({
  search,
  setSearch,
  parentId,
  onSelectUserId,
  initialSearch
}: UserSearchProps) => {
  const intl = useIntl();
  const [privateSearch, setPrivateSearch] = useState(initialSearch ?? '');
  const [users, setUsers] = useState<Paginated<UserModel>>();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const remoteRowCount = useMemo(() => users?.totalCount ?? 0, [users]);

  const isRowLoaded = ({ index }: { index: number }) => !!users?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const remoteData = parentId
      ? await getUsersUnderParent(parentId, { start: startIndex, end: stopIndex })
      : await getUsers({ start: startIndex, end: stopIndex });
    setUsers((prev) => {
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
    if (!parentId) {
      getUsers({ start: 0, end: 10, search: search ?? privateSearch }).then(setUsers);
    } else {
      getUsersUnderParent(parentId, { start: 0, end: 10, search: search ?? privateSearch }).then(
        setUsers
      );
    }
  }, [parentId, privateSearch, search]);

  useEffect(() => {
    if (initialSearch) setPrivateSearch(initialSearch);
  }, [initialSearch]);

  return (
    <div className="input input-sm h-[34px] shrink-0 relative">
      <input
        type="text"
        placeholder={intl.formatMessage({ id: 'USER.SEARCH.PLACEHOLDER' })}
        value={search ?? privateSearch}
        onChange={(e) => (setSearch ? setSearch(e.target.value) : setPrivateSearch(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        className="btn btn-icon"
        type="button"
        onClick={() => {
          setSearch ? setSearch('') : setPrivateSearch('');
          onSelectUserId?.('', '');
        }}
      >
        <KeenIcon icon="cross" />
      </button>
      {(focused || hovered) && (
        <div
          className="absolute bottom-[calc(100%+4px)] left-0 w-full max-h-96 card dark:border-gray-200 mt-1 z-50 scrollable-y"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!users && (
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
                    className="scrollable-y px-2 !overflow-x-hidden"
                    height={384}
                    width={width}
                    rowCount={remoteRowCount}
                    rowHeight={28}
                    rowRenderer={({ key, index, style }) => {
                      const user = users?.data[index];

                      if (!user) {
                        return <Skeleton key={key} style={style} />;
                      }

                      return (
                        <div key={key} style={style}>
                          <div
                            key={user.username}
                            className="p-2 hover:bg-gray-100 flex justify-between items-center gap-2 cursor-pointer"
                            onClick={() => {
                              if (setSearch) {
                                setSearch(user.name);
                              } else {
                                setPrivateSearch(user.name);
                              }
                              onSelectUserId?.(user.id, user.name);
                              setHovered(false);
                            }}
                          >
                            <div>{user.name}</div>
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
    </div>
  );
};
