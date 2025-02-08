import { CellContext } from '@tanstack/react-table';
import { useSettings } from '@/providers';
import { useAuthContext } from '@/auth';
import { useDataGrid } from '@/components';
import React from 'react';
import { IMaintenanceTableData, updateMaintenanceStatus } from '@/api/maintenance.ts';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown.tsx';

export const MaintenanceStatusDropdown = (info: CellContext<IMaintenanceTableData, unknown> & {
  refetch: () => void
}) => {
  const { settings } = useSettings();
  const { currentUser } = useAuthContext();

  const reload = useDataGrid().fetchServerSideData;

  return (
    <StatusDropdown
      selected={info.row.original.status.toString()}
      setSelected={async (status) => {
        await updateMaintenanceStatus(info.row.original.id, status);
        reload();
        info.refetch();
      }}
      readOnly={currentUser?.role !== 'admin'}
      options={{
        ongoing: {
          color: '#50CD89',
          backgroundColor: settings.themeMode == 'dark' ? '#15171c' : '#ffffff',
          name: 'Ongoing'
        },
        finished: {
          color: '#F1416C',
          backgroundColor: settings.themeMode == 'dark' ? '#15171c' : '#ffffff',
          name: 'Finished'
        }
      }}
    />
  );
};