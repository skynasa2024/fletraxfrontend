import { Paginated } from '@/api/common';
import { DeviceStatistics, getDeviceStatistics } from '@/api/devices';
import { KeenIcon, Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ApexCharts from 'react-apexcharts';
import { toAbsoluteUrl } from '@/utils';

type DeviceReportProps = {
  ident: string;
};

const options = {
  lastWeek: {
    name: 'Last 7 days'
    // nameKey: 'DASHBOARD.REPORT.LAST_7_DAYS'
  },
  lastMonth: {
    name: 'Last Month'
    // nameKey: 'DASHBOARD.REPORT.LAST_MONTH'
  }
  // lastYear: {
  //   name: 'Last Year'
  //   // nameKey: 'DASHBOARD.REPORT.LAST_YEAR'
  // },
  // customDay: {
  //   name: 'Custom Day'
  //   // nameKey: 'DASHBOARD.REPORT.CUSTOM_DAY'
  // },
  // customMonth: {
  //   name: 'Custom Month'
  //   // nameKey: 'DASHBOARD.REPORT.CUSTOM_MONTH'
  // },
  // customYear: {
  //   name: 'Custom Year'
  //   // nameKey: 'DASHBOARD.REPORT.CUSTOM_YEAR'
  // }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
};

const CAR_ICON_CONFIG = {
  path: toAbsoluteUrl('/media/icons/chart-car.svg'),
  width: 45,
  height: 45,
  offsetY: 23,
  offsetX: 0
};

const createPointAnnotation = (date: string, value: number, minHeightForIcon: number) => ({
  x: date,
  y: value,
  ...(value > minHeightForIcon && {
    image: CAR_ICON_CONFIG
  }),
  marker: { size: -1 }
});

export default function DeviceReport({ ident }: DeviceReportProps) {
  const [selected, setSelected] = useState('lastWeek');
  const [statistics, setStatistics] = useState<Paginated<DeviceStatistics> | null>(null);

  useEffect(() => {
    (async () => {
      await getDeviceStatistics({ page: 0, size: 10 }, ident).then(setStatistics);
    })();
  }, [ident]);

  const getFilteredData = () => {
    if (!statistics?.data) return [];
    const today = new Date();

    return statistics.data.filter((stat) => {
      const statDate = new Date(stat.date);
      if (selected === 'lastWeek') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return statDate >= sevenDaysAgo;
      } else if (selected === 'lastMonth') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return statDate >= oneMonthAgo;
      } else if (selected === 'lastYear') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return statDate >= oneYearAgo;
      }
      // For customDay, customMonth, customYear, implement your own filtering logic or return all data
      return true;
    });
  };

  const filteredData = getFilteredData();

  const values = filteredData.map((stat) =>
    parseFloat(stat.dailyExistingKilometers.replace(' km', ''))
  );
  const maxValue = Math.max(...(values.length ? values : [0]));
  // Set minimum height as 20% of max value
  const minHeightForIcon = maxValue * 0.2;
  console.log(minHeightForIcon);

  return (
    <div className="card h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between">
        <div>
          <h2 className="card-title">Device Report</h2>
          <h3 className="text-sm font-thin text-[#B5B5C3]">
            <FormattedMessage id="DASHBOARD.MILEAGE_ENGINE.TITLE" />
          </h3>
        </div>
        <div>
          <ReportFilterDropdown selected={selected} setSelected={setSelected} options={options} />
        </div>
      </div>
      <div>
        <ApexCharts
          id="contributions_chart"
          options={{
            chart: {
              type: 'bar',
              toolbar: { show: false }
            },
            xaxis: {
              categories: filteredData.map((stat) => stat.date) || [],
              labels: {
                style: { fontSize: '12px', colors: '#B5B5C3' },
                formatter: (val) => formatDate(val)
              },
              axisBorder: { show: true, color: '#ccc' }
            },
            yaxis: {
              labels: {
                style: { fontSize: '12px', colors: '#B5B5C3' },
                formatter: (val) => `${val}`
              }
            },
            plotOptions: {
              bar: {
                borderRadius: 6,
                columnWidth: 22,
                dataLabels: { position: 'top' },
                distributed: true
              }
            },
            annotations: {
              points:
                filteredData.map((stat) => {
                  const value = parseFloat(stat.dailyExistingKilometers.replace(' km', ''));
                  return createPointAnnotation(stat.date, value, minHeightForIcon);
                }) || []
            },
            legend: {
              show: false
            },
            colors: ['#545FAB'],
            grid: { show: true, borderColor: '#ddd', strokeDashArray: 4 },
            tooltip: {
              enabled: true,
              shared: false,
              custom: ({ dataPointIndex }) => {
                return `
                  <div class="p-2 text-xs bg-white rounded shadow-md">
                    <div class="font-semibold">${filteredData[dataPointIndex].date}</div>
                    <hr class="my-1" />
                    <div class="font-semibold">${
                      filteredData[dataPointIndex].dailyExistingKilometers
                    }</div>
                  </div>
                `;
              }
            },
            dataLabels: {
              enabled: true,
              formatter: (val) => (val ? `${val} km` : ''),
              style: { fontSize: '12px', colors: ['#252525'] },
              offsetY: -30,
              textAnchor: 'middle'
            }
          }}
          series={[
            {
              name: 'Existing Kilometers',
              data:
                filteredData.map((stat) =>
                  parseFloat(stat.dailyExistingKilometers.replace(' km', ''))
                ) || []
            }
          ]}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export interface ReportFilterDropdownProps {
  selected: string;
  // eslint-disable-next-line no-unused-vars
  setSelected: (value: string) => void;
  readOnly?: boolean;
  options: Record<
    string,
    {
      name?: string;
      nameKey?: string;
    }
  >;
}

export const ReportFilterDropdown = ({
  selected,
  setSelected,
  options,
  readOnly = false
}: ReportFilterDropdownProps) => {
  const intl = useIntl();
  const getOptionLabel = (key: string) => {
    const option = options[key];
    if (option?.nameKey) {
      return intl.formatMessage({
        id: option.nameKey,
        defaultMessage: option.name || key
      });
    }
    return option?.name || key;
  };

  if (readOnly) {
    return (
      <div className="btn btn-clear font-semibold text-xs h-fit px-3 py-[6px] cursor-default text-gray-500 bg-gray-300">
        {getOptionLabel(selected)}
      </div>
    );
  }

  return (
    <Menu>
      <MenuItem
        toggle="dropdown"
        trigger="click"
        dropdownProps={{
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'offset',
              options: { offset: [0, 10] } // [skid, distance]
            }
          ]
        }}
      >
        <MenuToggle className="btn btn-clear gap-2 font-bold text-xs h-fit px-4 py-2.5 cursor-pointer text-gray-500 bg-gray-100">
          <KeenIcon icon="down" className="!text-inherit !text-xs" />
          <span>{getOptionLabel(selected)}</span>
          <KeenIcon icon="calendar" className="!text-inherit" />
        </MenuToggle>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
          {Object.entries(options).map(([key, option]) => (
            <MenuItem
              key={key}
              onClick={() => {
                setSelected(key);
              }}
            >
              <MenuLink>
                <MenuTitle>
                  {option.nameKey
                    ? intl.formatMessage({
                        id: option.nameKey,
                        defaultMessage: option.name || key
                      })
                    : option.name || key}
                </MenuTitle>
              </MenuLink>
            </MenuItem>
          ))}
        </MenuSub>
      </MenuItem>
    </Menu>
  );
};
