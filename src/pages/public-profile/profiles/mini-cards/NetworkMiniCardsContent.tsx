import React, { Fragment } from 'react';
import { KeenIcon } from '@/components';
import { ToolbarActions } from '@/layouts/demo1/toolbar/ToolbarActions';

interface IMetricCard {
  value: string | number;
  label: string;
  color: string;
  iconColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

const DeviceIcon = ({ color = "currentColor", className = "" }) => (
  <svg
    width="28"
    height="27"
    viewBox="0 0 28 27"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_620_10341)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0649 4.20825C17.7148 4.06324 17.2213 3.95449 16.7375 3.88757C16.6963 3.88187 16.6757 3.87902 16.6421 3.87754C16.3755 3.86576 16.0898 4.03288 15.9695 4.27112C15.9544 4.30104 15.9436 4.32857 15.922 4.38362C15.8979 4.44473 15.8859 4.47529 15.8726 4.50226C15.7612 4.72815 15.5396 4.87916 15.2886 4.90021C15.2587 4.90272 15.2258 4.90272 15.1601 4.90272H12.8139C12.7482 4.90272 12.7153 4.90272 12.6854 4.90021C12.4344 4.87916 12.2128 4.72815 12.1014 4.50226C12.0881 4.47529 12.0761 4.44473 12.0521 4.38362C12.0304 4.32857 12.0196 4.30104 12.0045 4.27112C11.8842 4.03288 11.5985 3.86576 11.3319 3.87754C11.2983 3.87902 11.2777 3.88187 11.2365 3.88757C10.7527 3.95449 10.2592 4.06324 9.90914 4.20825C8.67748 4.71842 7.69895 5.69697 7.18875 6.9286C6.98251 7.42659 6.89232 7.96278 6.84881 8.60015C6.80614 9.22554 6.80615 9.99863 6.80615 10.98V15.3415C6.80615 16.3228 6.80614 17.096 6.84881 17.7213C6.89232 18.3587 6.98251 18.8948 7.18875 19.3928C7.69895 20.6245 8.67748 21.603 9.90914 22.1132C10.4071 22.3195 10.9433 22.4096 11.5807 22.4532C12.2061 22.4958 12.9792 22.4958 13.9605 22.4958H14.0135C14.9948 22.4958 15.7679 22.4958 16.3933 22.4532C17.0308 22.4096 17.5669 22.3195 18.0649 22.1132C19.2965 21.603 20.2751 20.6245 20.7853 19.3928C20.9915 18.8948 21.0817 18.3587 21.1252 17.7213C21.1679 17.096 21.1679 16.3228 21.1679 15.3415V10.98C21.1679 9.99863 21.1679 9.22554 21.1252 8.60015C21.0817 7.96278 20.9915 7.42659 20.7853 6.9286C20.2751 5.69697 19.2965 4.71842 18.0649 4.20825ZM11.1147 18.9054C11.1147 18.5088 11.4361 18.1873 11.8327 18.1873H16.1413C16.5379 18.1873 16.8593 18.5088 16.8593 18.9054C16.8593 19.302 16.5379 19.6235 16.1413 19.6235H11.8327C11.4361 19.6235 11.1147 19.302 11.1147 18.9054Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_620_10341">
        <rect x="0.200195" width="27" height="27" rx="5" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const NetworkMiniCardsContent = () => {
  const metrics: IMetricCard[] = [
    {
      value: '5268',
      label: 'Total Devices',
      color: 'text-white',
      bgColor: 'bg-blue-500',
      icon: <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.833496" y="0.833008" width="10.2083" height="10.2083" rx="1.5" fill="white"/>
      <rect x="14.042" y="0.833008" width="10.2083" height="10.2083" rx="1.5" fill="#DADADA" fill-opacity="0.52"/>
      <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M2.3335 14.041C1.50507 14.041 0.833496 14.7126 0.833496 15.541V22.7493C0.833496 23.5778 1.50507 24.2493 2.3335 24.2493H9.61473C10.4432 24.2493 11.1147 23.5778 11.1147 22.7493V15.541C11.1147 14.7126 10.4432 14.041 9.61473 14.041H2.3335ZM15.5522 14.041C14.7238 14.041 14.0522 14.7126 14.0522 15.541V22.7493C14.0522 23.5778 14.7238 24.2493 15.5522 24.2493H22.8335C23.6619 24.2493 24.3335 23.5778 24.3335 22.7493V15.541C24.3335 14.7126 23.6619 14.041 22.8335 14.041H15.5522Z" fill="white"/>
      </svg>
      
    },
    {
      value: '8,345',
      label: 'Online Devices',
      color: 'text-gray-900',
      icon: <DeviceIcon color="#2bdedb " /> 
    },
    {
      value: '8,345',
      label: 'Offline Devices',
      color: 'text-gray-900',
      icon: <DeviceIcon color="#f50000" /> 
      
    },
    {
      value: '8,345',
      label: 'Active Devices',
      color: 'text-gray-900',
      icon: <DeviceIcon color="#f5e400" /> 
    },
    {
      value: '8,345',
      label: 'Inactive Devices',
      color: 'text-gray-900',
      icon: <DeviceIcon color="#0010f5" />
    }
  ];

  const renderMetricCard = (metric: IMetricCard, index: number) => (
    <div
      key={index}
      className={`rounded-xl p-5 flex flex-col items-start ${metric.bgColor || 'bg-white'} ${index === 0 ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="self-start mb-2">{metric.icon}</div>
      <span className={`text-2xl font-semibold ${metric.color}`}>
        {metric.value}
      </span>
      <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
        {metric.label}
      </span>
    </div>
  
  );

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8 ">
        {metrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      <div className="flex items-center justify-between gap-2.5 flex-wrap mb-7.5">
        <div className="flex items-center flex-wrap gap-2.5 ml-auto">
          <select className="select select-sm w-28">
            <option value="1">Export</option>
            <option value="2">Disabled</option>
            <option value="2">Pending</option>
          </select>

          <button className="btn btn-sm btn-outline btn-primary">
            <KeenIcon icon="setting-4" /> Filters
          </button>

          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="search-normal-1" /> Search...
            </label>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { NetworkMiniCardsContent };