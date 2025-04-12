import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router';

export default function ManageUsers() {
  return (
    <>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.USERS.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>
      <div className="grid gap-4 grid-cols-5">
        <div className="card col-span-1"></div>
        <div className="col-span-2">
          <Outlet />
        </div>
        <div className="card col-span-2"></div>
      </div>
    </>
  );
}
