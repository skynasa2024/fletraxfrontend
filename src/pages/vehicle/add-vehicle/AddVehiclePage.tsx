import React, { useRef, useState } from 'react';
import {
  Information,
  Registration,
  InspectionAndInsurance,
  CarScratches,
  AdditionalVehicleInfo as AdditionalVehicleInfoBlock
} from './blocks';
import { Form, Formik, FormikProps } from 'formik';
import PromoCarTypeIcon from '../blocks/svg/PromoCarTypeIcon';
import PickupCarTypeIcon from '../blocks/svg/PickupCarTypeIcon';
import ComfortCarTypeIcon from '../blocks/svg/ComfortCarTypeIcon';
import SuvCarTypeIcon from '../blocks/svg/SuvCarTypeIcon';
import BusCarTypeIcon from '../blocks/svg/BusCarTypeIcon';
import VanCarTypeIcon from '../blocks/svg/VanCarTypeIcon';
import ManualGearTypeIcon from '../blocks/svg/ManualGearTypeIcon';
import AutomaticGearTypeIcon from '../blocks/svg/AutomaticGearTypeIcon';
import IndividualTypeIcon from '../blocks/svg/IndividualTypeIcon';
import CompanyTypeIcon from '../blocks/svg/CompanyTypeIcon';
import { useParams } from 'react-router';

type RadioOption<T> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
};

type TabType = 'information' | 'registration' | 'inspectionAndInsurance' | 'carScratches';

interface AdditionalVehicleInfo {
  vehicleImage?: File;
  plate: string;
  status: string;
  hgsNumber: string;
  currentMileage: number;
  maintenanceMileage: number;
  fuelConsumption: number;
  documents?: File;
  deviceId: string;
}

type FuelType = 'Hybrid' | 'Diesel' | 'Benzin' | 'LPG' | 'Kerosine' | 'Electric';
export const fuelOptions: Array<RadioOption<FuelType>> = [
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Benzin', value: 'Benzin' },
  { label: 'LPG', value: 'LPG' },
  { label: 'Kerosine', value: 'Kerosine' },
  { label: 'Electric', value: 'Electric' }
];

type CarType = 'PROMO' | 'Pickup' | 'COMFORT' | 'SUV' | 'Bus' | 'Van';
export const carOptions: Array<RadioOption<CarType>> = [
  {
    label: 'PROMO',
    value: 'PROMO',
    icon: <PromoCarTypeIcon />
  },
  {
    label: 'Pickup',
    value: 'Pickup',
    icon: <PickupCarTypeIcon />
  },
  {
    label: 'COMFORT',
    value: 'COMFORT',
    icon: <ComfortCarTypeIcon />
  },
  {
    label: 'SUV',
    value: 'SUV',
    icon: <SuvCarTypeIcon />
  },
  {
    label: 'Bus',
    value: 'Bus',
    icon: <BusCarTypeIcon />
  },
  {
    label: 'Van',
    value: 'Van',
    icon: <VanCarTypeIcon />
  }
];

type GearType = 'Automatic' | 'Manual';
export const gearOptions: Array<RadioOption<GearType>> = [
  { label: 'Automatic', value: 'Automatic', icon: <AutomaticGearTypeIcon /> },
  {
    label: 'Manual',
    value: 'Manual',
    icon: <ManualGearTypeIcon />
  }
];

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
export const registrationTypeOptions: Array<RadioOption<RegistrationType>> = [
  { label: 'Individual', value: 'Individual', icon: <IndividualTypeIcon /> },
  { label: 'Company', value: 'Company', icon: <CompanyTypeIcon /> }
];

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

export type AddVehicleForm = AdditionalVehicleInfo &
  InformationFormField &
  RegistrationFormField &
  InspectionAndInsuranceFormField &
  CarScratchesFormField;

const AddVehiclePage = () => {
  const {id: vehicleId} = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('information');

  const additionalVehicleInfoInitialValues: AdditionalVehicleInfo = {
    currentMileage: 0,
    fuelConsumption: 0,
    hgsNumber: '',
    maintenanceMileage: 0,
    plate: '',
    documents: undefined,
    vehicleImage: undefined,
    status: 'unavailable',
    deviceId: ''
  };

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
    ...carScratchesInitialValues,
    ...additionalVehicleInfoInitialValues
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

  const handleSaveClick = (values: AddVehicleForm) => {
    console.log(values);
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
    <Formik initialValues={initialValues} onSubmit={handleSaveClick}>
      {(props) => {
        return (
          <Form>
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-1">
                <AdditionalVehicleInfoBlock />
              </div>
              <div className="grid gap-5 lg:gap-7.5 mx-auto w-full col-span-3">
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
                        {renderContent(props)}
                      </div>

                      <div className="mt-5 flex justify-end gap-4">
                        {/* Back Button */}
                        {activeTab !== 'information' && (
                          <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            onClick={() => {
                              const currentIndex = tabConfig.findIndex(
                                (tab) => tab.id === activeTab
                              );
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
                              type="submit"
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
          </Form>
        );
      }}
    </Formik>
  );
};

export { AddVehiclePage };
