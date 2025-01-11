import React from 'react';

type VehicleInfoCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export default function VehicleInfoCard({ label, value, icon }: VehicleInfoCardProps) {
  return (
    <div className="card p-4 rounded-lg hover:shadow-md flex flex-col gap-2 justify-between h-full w-full">
      <span className="text-gray-600 mb-3">{icon}</span>
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-lg font-semibold text-gray-900 capitalize">{value}</span>
    </div>
  );
}
