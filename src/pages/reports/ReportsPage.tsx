import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const ReportTypes = [
  {
    id: 'mileage',
    label: 'Mileage Report'
  },
  {
    id: 'engineHours',
    label: 'Engine Hours Report'
  },
  {
    id: 'tripsAndParking',
    label: 'Trips/Parking Report'
  },
  {
    id: 'alarm',
    label: 'Alarm Report'
  }
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState(ReportTypes[0]);

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.REPORTS" />}
          description={activeReport.label}
        />
      </Toolbar>

      <div className="grid gap-4 grid-cols-4 lg:grid-cols-8 my-4">
        {ReportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report)}
            className="items-center btn btn-info h-full justify-center p-2 text-sm rounded-lg border-2"
          >
            {report.label}
          </button>
        ))}
      </div>
    </Container>
  );
}
