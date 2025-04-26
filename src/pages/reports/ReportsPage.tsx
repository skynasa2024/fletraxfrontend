import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MileageReport from './blocks/MileageReport';
import EngineHoursReport from './blocks/EngineHoursReport';
import TripsAndParkingReport from './blocks/TripsAndParkingReport';
import AlarmReport from './blocks/AlarmReport';
import clsx from 'clsx';
import MaxSpeedReport from './blocks/MaxSpeedReport';
import SubscriptionExpirtyReport from './blocks/SubscriptionExpiryReport';

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
    report: <EngineHoursReport />
  },
  {
    id: 'tripsAndParking',
    label: 'Trips/Parking Report',
    description: 'Trips/Parking Report',
    report: <TripsAndParkingReport />
  },
  {
    id: 'alarm',
    label: 'Alarm Report',
    description: 'Alarm Report',
    report: <AlarmReport />
  },
  {
    id: 'maxSpeed',
    label: 'Max Speed Report',
    description: 'Max Speed Report',
    report: <MaxSpeedReport />
  },
  {
    id: 'subscriptionExpiry',
    label: 'Subscription Expiry Report',
    description: 'Subscription Expiry Report',
    report: <SubscriptionExpirtyReport />
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
            className={clsx(
              'items-center btn btn-info h-full justify-center p-2 text-sm rounded-lg border-2',
              report.id !== activeReportTab.id && 'btn-light text-info hover:text-info'
            )}
          >
            {report.label}
          </button>
        ))}
      </div>

      <div className="card">{activeReportTab.report}</div>
    </Container>
  );
}
