import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MileageReport from './blocks/MileageReport';

type ReportTabType = {
  id: string;
  label: string;
  description?: string;
  report: React.ReactNode;
};

const ReportTypes: ReportTabType[] = [
  {
    id: 'mileage',
    label: 'Mileage Report',
    description: 'Mileage Report',
    report: <MileageReport />
  },
  {
    id: 'engineHours',
    label: 'Engine Hours Report',
    description: 'Engine Hours Report',
    report: <div>Engine Hours</div>
  },
  {
    id: 'tripsAndParking',
    label: 'Trips/Parking Report',
    description: 'Trips/Parking Report',
    report: <div>Trips/Parking</div>
  },
  {
    id: 'alarm',
    label: 'Alarm Report',
    description: 'Alarm Report',
    report: <div>Alarm</div>
  }
];

export default function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState<ReportTabType>(ReportTypes[0]);

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.REPORTS" />}
          description={activeReportTab.label}
        />
      </Toolbar>

      <div className="grid gap-4 grid-cols-4 lg:grid-cols-8 mb-4">
        {ReportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReportTab(report)}
            className="items-center btn btn-info h-full justify-center p-2 text-sm rounded-lg border-2"
          >
            {report.label}
          </button>
        ))}
      </div>

      <div className="card">{activeReportTab.report}</div>
    </Container>
  );
}
