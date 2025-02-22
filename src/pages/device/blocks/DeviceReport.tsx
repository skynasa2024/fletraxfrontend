import { DeviceStatistics, DeviceStatisticsParams, getDeviceStatistics } from '@/api/devices';
import { KeenIcon, Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ApexCharts from 'react-apexcharts';
import { toAbsoluteUrl } from '@/utils';
import { ButtonRadioGroup } from '../../dashboards/blocks/ButtonRadioGroup';
import { useSettings } from '@/providers';

type DeviceReportProps = {
  ident: string;
};

type FilterOption = 'lastWeek' | 'lastMonth' | 'lastYear';

const options: Record<
  FilterOption,
  {
    name: string;
    nameKey?: string;
  }
> = {
  lastWeek: {
    name: 'Last 7 days'
    // nameKey: 'DASHBOARD.REPORT.LAST_7_DAYS'
  },
  lastMonth: {
    name: 'Last Month'
    // nameKey: 'DASHBOARD.REPORT.LAST_MONTH'
  },
  lastYear: {
    name: 'Last Year'
    // nameKey: 'DASHBOARD.REPORT.LAST_YEAR'
  }
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

const CAR_ICON = {
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
    image: CAR_ICON
  }),
  marker: { size: -1 }
});

const formatHoursAndMinutes = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

const safeParseFloat = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const safeParseEngineHours = (engineHours: string): number => {
  if (!engineHours) return 0;
  try {
    const [hoursStr = '0', minutesStr = '0'] = engineHours.split(' h , ');
    const hours = parseInt(hoursStr.replace(/[^\d]/g, '')) || 0;
    const minutes = parseInt(minutesStr.replace(/[^\d]/g, '')) || 0;
    return Number((hours + minutes / 60).toFixed(2));
  } catch (error) {
    console.error('Error parsing engine hours:', error);
    return 0;
  }
};

export default function DeviceReport({ ident }: DeviceReportProps) {
  const intl = useIntl();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('lastWeek');
  const [metricType, setMetricType] = useState('Mileage');
  const [statistics, setStatistics] = useState<DeviceStatistics[] | null>(null);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);
  const { settings } = useSettings();
  const isDarkMode = settings.themeMode === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingStatistics(true);
      try {
        const data = await getDeviceStatistics({
          ident,
          ...getQueryParams(selectedFilter)
        });
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching device statistics:', error);
      } finally {
        setIsLoadingStatistics(false);
      }
    };

    fetchData();
  }, [ident, selectedFilter]);

  const getQueryParams = (selected: FilterOption): Omit<DeviceStatisticsParams, 'ident'> => {
    switch (selected) {
      case 'lastWeek': {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        const endDate = new Date();
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          groupedBy: 'daily'
        };
      }
      case 'lastMonth': {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setDate(startDate.getDate() + 1);
        const endDate = new Date();
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          groupedBy: 'daily'
        };
      }
      case 'lastYear': {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        const endDate = new Date();
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          groupedBy: 'monthly'
        };
      }
      default: {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        const endDate = new Date();
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          groupedBy: 'daily'
        };
      }
    }
  };

  const getChartData = (statistics?: DeviceStatistics[] | null) => {
    if (!statistics) return { name: '', data: [] };
    if (metricType === 'Mileage') {
      return {
        name: 'Daily Kilometers',
        data: statistics?.map((stat) => safeParseFloat(stat.existingKilometers))
      };
    }
    return {
      name: 'Engine Hours',
      data: statistics?.map((stat) => safeParseEngineHours(stat.engineHours))
    };
  };

  const getTooltipContent = (dataPointIndex: number) => {
    const data = statistics?.[dataPointIndex];
    if (!data) return '';

    const date = data.date;
    const value = metricType === 'Mileage' ? data.existingKilometers : data.engineHours;

    return `
      <div class="p-2 text-xs bg-white rounded shadow-md">
        <div class="font-semibold">${date}</div>
        <hr class="my-1" />
        <div class="font-semibold">${value}</div>
      </div>
    `;
  };

  const values = statistics?.map((stat) => safeParseFloat(stat.existingKilometers));
  const maxValue = Math.max(...((values?.length ? values : [0]) ?? 0));
  // Set minimum height as 20% of max value
  const minHeightForIcon = maxValue * 0.2;

  return (
    <div className="card h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between">
        <div>
          <h2 className="card-title">Device Report</h2>
          <h3 className="text-sm font-thin text-[#B5B5C3]">
            <FormattedMessage id="DASHBOARD.MILEAGE_ENGINE.TITLE" />
          </h3>
        </div>
        <div className="flex gap-5 items-center">
          <ButtonRadioGroup
            selection={metricType}
            setSelection={setMetricType}
            selections={['Mileage', 'Engine']}
            translations={{
              Engine: intl.formatMessage({ id: 'DASHBOARD.MILEAGE_ENGINE.ENGINE' }),
              Mileage: intl.formatMessage({ id: 'DASHBOARD.MILEAGE_ENGINE.MILEAGE' })
            }}
            disabled={!statistics}
          />
          <ReportFilterDropdown
            selected={selectedFilter}
            setSelected={setSelectedFilter}
            options={options}
          />
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
              categories: statistics?.map((stat) => stat.date) || [],
              labels: {
                style: { fontSize: '12px', colors: '#B5B5C3' },
                formatter: (val) => {
                  if (selectedFilter === 'lastYear') {
                    const d = new Date(val);
                    return d.toLocaleString('default', { month: 'short' });
                  }
                  return formatDate(val);
                }
              },
              axisBorder: { show: true, color: '#ccc' }
            },
            yaxis: {
              labels: {
                style: { fontSize: '12px', colors: '#B5B5C3' },
                formatter: (val) => {
                  if (metricType === 'Mileage') {
                    return `${val} km`;
                  }
                  return formatHoursAndMinutes(val);
                }
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
              points: statistics
                ?.filter((stat) => !!stat.date && safeParseFloat(stat.existingKilometers) > 0)
                ?.map((stat) => {
                  const value = safeParseFloat(stat.existingKilometers);
                  return createPointAnnotation(stat.date, value, minHeightForIcon);
                })
            },
            legend: {
              show: false
            },
            colors: ['#545FAB'],
            grid: {
              show: true,
              borderColor: isDarkMode ? '#dddddd53' : '#ddd',
              strokeDashArray: 4
            },
            tooltip: {
              enabled: true,
              shared: false,
              custom: ({ dataPointIndex }: { dataPointIndex: number }) =>
                getTooltipContent(dataPointIndex)
            },
            dataLabels: {
              enabled: true,
              formatter: (val: number) => {
                if (typeof val !== 'number' || val === 0) return '';
                if (metricType === 'Mileage') {
                  return `${val} km`;
                }
                return formatHoursAndMinutes(val);
              },
              style: {
                fontSize: '12px',
                colors: [isDarkMode ? '#dad1d1' : '#252525']
              },
              offsetY: -30,
              textAnchor: 'middle'
            }
          }}
          series={[getChartData(statistics)]}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export interface ReportFilterDropdownProps {
  selected: FilterOption;
  // eslint-disable-next-line no-unused-vars
  setSelected: (value: FilterOption) => void;
  readOnly?: boolean;
  options: Record<
    FilterOption,
    {
      name: string;
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
  const getOptionLabel = (key: FilterOption) => {
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
                setSelected(key as FilterOption);
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
