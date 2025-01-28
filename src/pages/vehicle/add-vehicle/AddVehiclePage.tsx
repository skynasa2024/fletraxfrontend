import React, { useRef, useState } from 'react';
import { Information, Registration, InspectionAndInsurance, CarScratches } from './blocks';
import { Form, Formik, FormikProps } from 'formik';

type TabType = 'information' | 'registration' | 'inspectionAndInsurance' | 'carScratches';

type FuelType = 'Hybrid' | 'Diesel' | 'Benzin' | 'LPG' | 'Kerosine' | 'Electric';
export const fuelOptions: Array<FuelType> = [
  'Hybrid',
  'Diesel',
  'Benzin',
  'LPG',
  'Kerosine',
  'Electric'
];

type CarType = 'PROMO' | 'Pickup' | 'COMFORT' | 'SUV' | 'Bus' | 'Van';
export const carOptions: Array<CarType> = ['PROMO', 'Pickup', 'COMFORT', 'SUV', 'Bus', 'Van'];

type GearType = 'Automatic' | 'Manual';
export const gearOptions: Array<GearType> = ['Automatic', 'Manual'];

export const colorOptions = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Gray',
  'Silver',
  'Gold',
  'Beige'
];

export const numberOfSeatsOptions = [2, 3, 4, 5, 6, 7, 8];

export interface InformationFormField {
  brand: string;
  model: string;
  modelSeries: string;
  modelYear: string;
  volume?: number;
  power?: number;
  fuelType: FuelType;
  carType: CarType;
  gearType: GearType;
  color: string;
  numberOfSeats: number;
}

type RegistrationType = 'Individual' | 'Company';
export const registrationTypeOptions: Array<RegistrationType> = ['Individual', 'Company'];

export interface RegistrationFormField {
  registrationType: string;
  identifyNumber: string;
  chassisNumber: string;
  engineNumber: string;
  registrationNumber: string;
  registrationDate: string;
  firstRegistrationDate: string;
  licenseSerialNumber: string;
  price?: number;
}

export interface InspectionAndInsuranceFormField {
  inspectionStartDate: string;
  inspectionEndDate: string;
  insuranceStartDate: string;
  insuranceEndDate: string;
  kaskoStartDate: string;
  kaskoEndDate: string;
  exhaustStartDate: string;
  exhaustEndDate: string;
}

export const scratchPlaces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export interface Scratch {
  place: number;
  explanationOf: string;
  vehicleId: string;
  image?: File;
}

export interface CarScratchesFormField {
  scratches: Array<Scratch>;
}

export type AddVehicleForm = InformationFormField &
  RegistrationFormField &
  InspectionAndInsuranceFormField &
  CarScratchesFormField;

const AddVehiclePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('information');

  const informationInitialValues: InformationFormField = {
    brand: '',
    model: '',
    modelSeries: '',
    modelYear: '',
    volume: undefined,
    power: undefined,
    fuelType: 'Hybrid',
    carType: 'PROMO',
    gearType: 'Automatic',
    color: 'Black',
    numberOfSeats: 4
  };

  const registrationInitialValues: RegistrationFormField = {
    registrationType: 'Individual',
    identifyNumber: '',
    chassisNumber: '',
    engineNumber: '',
    registrationNumber: '',
    registrationDate: '',
    firstRegistrationDate: '',
    licenseSerialNumber: '',
    price: undefined
  };

  const inspectionAndInsuranceInitialValues: InspectionAndInsuranceFormField = {
    inspectionStartDate: '',
    inspectionEndDate: '',
    insuranceStartDate: '',
    insuranceEndDate: '',
    kaskoStartDate: '',
    kaskoEndDate: '',
    exhaustStartDate: '',
    exhaustEndDate: ''
  };

  const carScratchesInitialValues: CarScratchesFormField = {
    scratches: [
      {
        place: 1,
        explanationOf: '',
        vehicleId: ''
      }
    ]
  };

  const initialValues: AddVehicleForm = {
    ...informationInitialValues,
    ...registrationInitialValues,
    ...inspectionAndInsuranceInitialValues,
    ...carScratchesInitialValues
  };

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
  };

  const renderContent = (formikProps: FormikProps<AddVehicleForm>) => {
    switch (activeTab) {
      case 'information':
        return <Information title="Information" />;
      case 'registration':
        return <Registration />;
      case 'inspectionAndInsurance':
        return <InspectionAndInsurance />;
      case 'carScratches':
        return <CarScratches formikProps={formikProps} />;
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
              <Formik initialValues={initialValues} onSubmit={() => {}}>
                {(props) => {
                  return <Form>{renderContent(props)}</Form>;
                }}
              </Formik>
              <div className="mt-5 flex justify-end gap-10">
                {/* Back Button */}
                {activeTab !== 'information' && (
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={() => {
                      const currentIndex = tabConfig.findIndex((tab) => tab.id === activeTab);
                      if (currentIndex > 0) {
                        handleTabClick(tabConfig[currentIndex - 1].id as TabType);
                      }
                    }}
                  >
                    Back
                  </button>
                )}
                {/* Next or Save Button */}
                <div>
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
    </div>
  );
};

export { AddVehiclePage };
