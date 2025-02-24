import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { FormattedMessage } from 'react-intl';

export default function ReportsPage() {
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading title={<FormattedMessage id="SIDEBAR.MENU.REPORTS" />} description="" />
      </Toolbar>
    </Container>
  );
}
