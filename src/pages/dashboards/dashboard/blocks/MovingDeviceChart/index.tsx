import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useEffect, useMemo, useState } from 'react';
import { getCarCount } from '@/api/cars';
import { CircularProgress } from '@mui/material';
import { ButtonRadioGroup } from '../ButtonRadioGroup';
import { toAbsoluteUrl } from '@/utils';
import './style.css';

const MovingDeviceChart = () => {
  const [selection, setSelection] = useState('Device');
  const [allData, setAllData] = useState<Record<string, number>>();
  const data = useMemo(() => {
    if (allData) {
      return selection === 'Moving'
        ? [allData.Moving, allData.Parked]
        : [allData.Online, allData.Offline];
    }
    return null;
  }, [allData, selection]);
  const labels = useMemo(() => {
    if (allData) {
      return selection === 'Moving' ? ['Moving', 'Parked'] : ['Online', 'Offline'];
    }
    return null;
  }, [allData, selection]);
  const colors: string[] = ['var(--tw-success)', 'var(--tw-danger)'];

  const options: ApexOptions = {
    series: data ?? [],
    labels: labels ?? [],
    colors: colors,
    fill: {
      colors: colors
    },
    chart: {
      type: 'donut'
    },
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        startAngle: -120,
        endAngle: 360 - 120,
        donut: {
          size: '80%'
        }
      }
    },
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getCarCount().then((data) => {
        setAllData(data);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data || !labels) {
    return <CircularProgress />;
  }

  return (
    <div
      className="card hover:shadow-md h-full"
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      }}
    >
      <div className="px-7 py-6 flex items-center justify-between">
        <div className="card-title">
          <h3>Moving & Device</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">Status</h4>
        </div>

        <ButtonRadioGroup
          selection={selection}
          setSelection={setSelection}
          selections={['Moving', 'Device']}
        />
      </div>

      <div className="card-body flex flex-col gap-4 justify-center items-center px-3 py-1 pb-6">
        <div className="relative">
          <div className="absolute flex justify-center items-center size-full top-0 text-4xl font-bold">
            {data && data.reduce((acc, val) => acc + val)}
          </div>
          <ApexChart
            id="contributions_chart"
            options={options}
            series={options.series}
            type="donut"
            width="100%"
          />
        </div>
        <div className="grid grid-cols-2 w-full px-6 gap-10">
          <div className="flex gap-3">
            <img src={toAbsoluteUrl('/media/icons/online.svg')} />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{data[0]}</div>
              <div className="text-xs font-medium text-gray-600">{labels[0]}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <img src={toAbsoluteUrl('/media/icons/offline.svg')} />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{data[1]}</div>
              <div className="text-xs font-medium text-gray-600">{labels[1]}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <img src={toAbsoluteUrl('/media/icons/total.svg')} />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{data.reduce((acc, val) => acc + val)}</div>
              <div className="text-xs font-medium text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MovingDeviceChart };
