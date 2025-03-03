import { Container, DataGrid, KeenIcon } from '@/components';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export default function ManageDevices() {
  const intl = useIntl();

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.NAME' }),
        enableSorting: true
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PHONE' }),
        enableSorting: true
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PROTOCOL' })
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.TYPE' })
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PLATE' }),
        cell: () => <CarPlate />
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.BRANCH' })
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.START_DATE' })
      },
      {
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.END_DATE' })
      },
      {
        header: intl.formatMessage({ id: 'COMMON.ACTIONS' })
      }
    ],
    [intl]
  );

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>

      <div className="card">
        <div className="flex justify-between items-center p-4">
          <h2 className="font-semibold">49,053 Device</h2>

          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeenIcon style="duotone" icon="magnifier" />
              </div>
              <input
                type="text"
                placeholder="Search Device..."
                className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info input"
              />
            </div>
            <button className="btn btn-info rounded-lg">
              <img src={toAbsoluteUrl('/media/icons/white-device.svg')} alt="Add" />
              <span>Device</span>
            </button>
          </div>
        </div>
        <div className="report-table-container">
          <DataGrid columns={columns} />
        </div>
      </div>
    </Container>
  );
}
