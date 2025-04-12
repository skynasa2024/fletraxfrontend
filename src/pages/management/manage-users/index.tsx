import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { FormattedMessage } from 'react-intl';

export default function ManageUsers() {
  return (
    <>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.USERS.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>
    </>
  );
}
