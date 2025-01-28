import { ConnectIcon, OnOffIcon, ViewIcon } from './blocks/icons';
import DeviceCard from './blocks/DeviceCard';
import DeviceNavigation from './DeviceNavigation';
import SpeedGauge from './SpeedGuage';
import Car from './Car';
import Map from './Map';
import MaintenanceList from './MaintenanceList';
import DeviceIcon from './svg/device.svg?react';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { DeviceDTO, getDeviceModel } from '@/api/devices';
import { CarPlate } from '../dashboards/dashboard/blocks/CarPlate';

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState<DeviceDTO | null>(null);
  useEffect(() => {
    if (!id) return;
    getDeviceModel(+id)
      .then((data) => {
        setDevice(data);
      })
      .catch(() => {
        navigate('/error/404');
      });
  }, [id, navigate]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  if (!device) {
    return null;
  }

  return (
    <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full m-5">
      <div className="p-4 w-full">
        <div className="space-y-4">
          <table className="card w-full p-2">
            <tbody>
              <tr className="w-full grid grid-cols-4 gap-6 items-center">
                <td className="text-start flex items-center">
                  <div className="flex items-center gap-4">
                    <DeviceIcon color="#5151F9" className="size-12 min-w-12" />
                    <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary">
                      <div className="font-bold">{device.name}</div>
                      <div className="font-sm text-gray-500">{device.ident}</div>
                      <div className="font-sm">
                        {device.phoneCode} {device.phone}
                      </div>
                    </a>
                  </div>
                </td>
                <td className="flex-1">
                  <div className="w-full">
                    <DeviceCard
                      deviceName="Jimi IoT"
                      lastActive="16 minutes ago"
                      icon1Count={2}
                      icon2Count={5}
                      icon3Count={8}
                      icon4Count={4}
                    />
                  </div>
                </td>
                <td className="flex-1">
                  <div className="flex items-center justify-center">
                    <CarPlate className="w-auto" plate={device.vehiclePlate} />
                  </div>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <div className="flex justify-center items-center w-12 h-12 rounded-lg hover:bg-gray-100">
                      <ViewIcon />
                    </div>
                    <div className="flex justify-center items-center w-12 h-12 rounded-lg hover:bg-gray-100">
                      <ConnectIcon />
                    </div>
                    <div className="flex justify-center items-center w-12 h-12 rounded-lg hover:bg-gray-100">
                      <OnOffIcon />
                    </div>
                  </div>
                </td>
              </tr>
              <DeviceNavigation />
            </tbody>
          </table>
        </div>
        <div>
          <div className="grid grid-cols-3 p-2">
            {/* Speed Gauge */}
            <div className="flex items-center justify-start">
              <SpeedGauge />
            </div>

            {/* Map */}
            <div className="flex items-center justify-center">
              <Map />
            </div>

            {/* Car */}
            <div className="flex items-center justify-end">
              <Car />
            </div>
          </div>

          <MaintenanceList />
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsPage;
