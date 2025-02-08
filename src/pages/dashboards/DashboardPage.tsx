import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';

import { DashboardContent } from '.';
import { FormattedMessage } from 'react-intl';

const DashboardPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title={<FormattedMessage id="SIDEBAR.MENU.DASHBOARD" />} description="" />
        </Toolbar>
      </Container>

      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
};

export { DashboardPage };
