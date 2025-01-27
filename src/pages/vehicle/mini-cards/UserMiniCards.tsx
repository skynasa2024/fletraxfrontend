import React from 'react';
import clsx from 'clsx';

export interface MetricData {
  value: string | number;
  label: string;
  textColor: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

export default function UserMiniCards({ metrics }: { metrics: MetricData[] }) {
  return (
    <>
      <div className="flex flex-wrap gap-4 w-full">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            classNames={{
              root: metric.bgColor,
              icon: metric.textColor,
              label: metric.textColor,
              value: metric.textColor
            }}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
    </>
  );
}

interface MertricCardProps {
  classNames?: {
    root?: string;
    icon?: string;
    label?: string;
    value?: string;
  };
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function MetricCard({ classNames, icon, label, value }: MertricCardProps) {
  return (
    <div
      className={clsx(
        'card rounded-lg flex flex-col items-start hover:shadow-lg w-full md:flex-1',
        classNames?.root
      )}
    >
      <div className={clsx('w-4 h-4 p-4', classNames?.icon)}>{icon}</div>
      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className={clsx('text-2xl font-semibold mt-1', classNames?.value)}>{value}</p>
            <p className={clsx('text-sm', classNames?.label)}>{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
