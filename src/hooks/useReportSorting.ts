interface UseReportSortingProps {
  defaultSort?: string;
  reportType?: string;
}

export function useReportSorting({ defaultSort = 'date,desc', reportType }: UseReportSortingProps) {
  const handleFetchWithSort = (params: any, filters: any, fetchData: Function) => {
    const sortParam = params.sorting?.[0]
      ? `${params.sorting[0].id},${params.sorting[0].desc ? 'desc' : 'asc'}`
      : defaultSort;

    const queryParams = {
      ...params,
      type: reportType,
      ...filters,
      sort: sortParam
    };

    return fetchData(queryParams);
  };

  return {
    handleFetchWithSort
  };
}
