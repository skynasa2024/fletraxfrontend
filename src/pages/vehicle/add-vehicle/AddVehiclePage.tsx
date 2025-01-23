import React, { useRef, useState } from 'react';
import { Information, Registration, InspectionAndInsurance, CarScratches } from './blocks';

type TabType = 'information' | 'registration' | 'inspectionAndInsurance' | 'carScratches';

const AddVehiclePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('information');

  const refs = {
    information: useRef<HTMLDivElement>(null),
    registration: useRef<HTMLDivElement>(null),
    inspectionAndInsurance: useRef<HTMLDivElement>(null),
    carScratches: useRef<HTMLDivElement>(null)
  };

  const tabConfig = [
    { id: 'information', label: 'Information' },
    { id: 'registration', label: 'Registration' },
    { id: 'inspectionAndInsurance', label: 'Inspection & Insurance' },
    { id: 'carScratches', label: 'Car Scratches' }
  ] as const;

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);

    refs[tab].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    const header = refs[tab].current?.querySelector('h2, h3') as HTMLElement | null;
    if (header) {
      header.setAttribute('tabindex', '-1');
      header.focus();
    }
  };

  const handleNextClick = () => {
    const currentIndex = tabConfig.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabConfig.length - 1) {
      handleTabClick(tabConfig[currentIndex + 1].id as TabType);
    }
  };

  const handleSaveClick = () => {
    alert('Vehicle details saved successfully!');
    // Implement save functionality here
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'information':
        return <Information title="Information" />;
      case 'registration':
        return <Registration />;
      case 'inspectionAndInsurance':
        return <InspectionAndInsurance />;
      case 'carScratches':
        return <CarScratches />;
      default:
        return null;
    }
  };

  const isLastTab = activeTab === tabConfig[tabConfig.length - 1].id;

  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[85rem] mx-auto">
      <div className="flex">
        {/* Main Content */}
        <div className="w-full align-center">
          {/* Tabs Navigation */}
          <div className="tabs flex flex-wrap border-b mb-4" data-tabs="true">
            {tabConfig.map(({ id, label }) => (
              <button
                key={id}
                className={`tab px-4 py-2 font-medium text-lg border-b-4 -mb-[1px] ${
                  activeTab === id
                    ? 'text-primary border-primary'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabClick(id as TabType)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <div ref={refs[activeTab]} className="focus:outline-none">
              {renderContent()}
              <div className="mt-5 flex justify-end">
                {/* Next or Save Button */}
                {!isLastTab ? (
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddVehiclePage };
