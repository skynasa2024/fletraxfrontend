import React from 'react';
import { Icon1, Icon2, Icon3, Icon4 } from './icons';

interface DeviceCardProps {
  deviceName: string;
  lastActive: string;
  icon1Count: number;
  icon2Count: number;
  icon3Count: number;
  icon4Count: number;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  deviceName,
  lastActive,
  icon1Count,
  icon2Count,
  icon3Count,
  icon4Count
}) => {
  return (
    <div className="device-card p-4">
      {/* Device Info Section */}
      <div className="device-name text-start font-semibold text-xl">{deviceName}</div>
      <div className="device-status text-start text-sm text-gray-500">
        Last active: {lastActive}
      </div>

    </div>
  );
};

export default DeviceCard;
