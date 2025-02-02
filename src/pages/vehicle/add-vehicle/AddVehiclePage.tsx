import React, { useEffect, useRef, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router';
import {
  createScratches,
  createVehicle,
  getVehicleDetails,
  updateVehicle,
  VehicleDTO
} from '@/api/cars';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

type RadioOption<T> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
};

type TabType = 'information' | 'registration' | 'inspectionAndInsurance' | 'carScratches';

interface AdditionalVehicleInfo {
  vehicleImage?: string;
  plate: string;
  status: string;
  hgsNumber: string;
  currentMileage: string;
  maintenanceMileage: string;
  fuelConsumption: number;
  licenseImageFile?: string;
}

export type FuelType = 'Hybrid' | 'Diesel' | 'Benzin' | 'LPG' | 'Kerosine' | 'Electric';
export const fuelOptions: Array<RadioOption<FuelType>> = [
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Benzin', value: 'Benzin' },
  { label: 'LPG', value: 'LPG' },
  { label: 'Kerosine', value: 'Kerosine' },
  { label: 'Electric', value: 'Electric' }
];

export type CarType = 'PROMO' | 'Pickup' | 'COMFORT' | 'SUV' | 'Bus' | 'Van';
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

export type GearType = 'Automatic' | 'Manual';
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
  modelYear: number;
  volume: string;
  power: string;
  fuelType: FuelType;
  carType: CarType;
  gearType: GearType;
  color: string;
  numberOfSeats: number;
}

export type RegistrationType = 'Individual' | 'Company';
export const registrationTypeOptions: Array<RadioOption<RegistrationType>> = [
  { label: 'Individual', value: 'Individual', icon: <IndividualTypeIcon /> },
  { label: 'Company', value: 'Company', icon: <CompanyTypeIcon /> }
];

export interface RegistrationFormField {
  registrationType: RegistrationType;
  identifyNumber: string;
  chassisNumber: string;
  engineNumber: string;
  registrationNumber: string;
  registrationDate: string;
  firstRegistrationDate: string;
  licenseSerialNumber: string;
  price: number;
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
  image?: string;
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
  const { id: carId } = useParams();
  const [currentVehicle, setCurrentVehicle] = useState<VehicleDTO | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('information');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const navigate = useNavigate();

  const currentVehicleInitialValues: AddVehicleForm = {
    ...currentVehicle,
    status: currentVehicle?.status || 'unavailable',
    fuelType: currentVehicle?.fuelType || 'Hybrid',
    carType: currentVehicle?.carType || 'PROMO',
    gearType: currentVehicle?.gear || 'Automatic',
    color: currentVehicle?.color || 'Black',
    numberOfSeats: currentVehicle?.numberOfSeats || 4,
    registrationType: currentVehicle?.type || 'Individual',
    scratches: (currentVehicle?.scratches as any[]) || [
      { place: 1, explanationOf: '', vehicleId: '' }
    ],
    price: currentVehicle?.price || 0,
    volume: currentVehicle?.volume || '',
    power: currentVehicle?.power || '',
    identifyNumber: currentVehicle?.identifyNumber || '',
    chassisNumber: currentVehicle?.chassisNumber || '',
    engineNumber: currentVehicle?.engineNumber || '',
    registrationNumber: currentVehicle?.registrationNumber || '',
    registrationDate: currentVehicle?.registrationDate || '',
    firstRegistrationDate: currentVehicle?.firstRegistrationDate || '',
    licenseSerialNumber: currentVehicle?.licenseSerialNumber || '',
    inspectionStartDate: currentVehicle?.inspectionStartDate || '',
    inspectionEndDate: currentVehicle?.inspectionEndDate || '',
    insuranceStartDate: currentVehicle?.insuranceStartDate || '',
    insuranceEndDate: currentVehicle?.insuranceEndDate || '',
    kaskoStartDate: currentVehicle?.kaskoInsuranceStartDate || '',
    kaskoEndDate: currentVehicle?.kaskoInsuranceEndDate || '',
    exhaustStartDate: currentVehicle?.exhaustStartDate || '',
    exhaustEndDate: currentVehicle?.exhaustEndDate || '',
    currentMileage: currentVehicle?.currentMileage || '',
    maintenanceMileage: currentVehicle?.maintenanceMileage || '',
    fuelConsumption: currentVehicle?.fuelConsumption || 0,
    hgsNumber: currentVehicle?.hgsNumber || '',
    plate: currentVehicle?.plate || '',
    vehicleImage: currentVehicle?.imageFile || undefined,
    licenseImageFile: currentVehicle?.licenseImageFile || undefined,
    brand: currentVehicle?.brand || '',
    model: currentVehicle?.model || '',
    modelSeries: currentVehicle?.modelSeries || '',
    modelYear: currentVehicle?.modelYear || 0
  };

  const additionalVehicleInfoInitialValues: AdditionalVehicleInfo = {
    currentMileage: '',
    fuelConsumption: 0,
    hgsNumber: '',
    maintenanceMileage: '',
    plate: '',
    licenseImageFile: undefined,
    vehicleImage: undefined,
    status: 'unavailable'
  };

  const informationInitialValues: InformationFormField = {
    brand: '',
    model: '',
    modelSeries: '',
    modelYear: 0,
    volume: '',
    power: '',
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
    price: 0
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
    scratches: []
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

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = tabConfig.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabConfig.length - 1) {
      handleTabClick(tabConfig[currentIndex + 1].id as TabType);
    }
  };

  const handleSaveClick = async (values: AddVehicleForm) => {
    const { scratches, ...vehicle } = values;

    setIsLoadingSave(true);
    try {
      let newId: string;
      if (carId && currentVehicle) {
        const updatedVehicle: VehicleDTO = {
          ...vehicle,
          vehicleId: currentVehicle.vehicleId,
          id: currentVehicle.id,
          deviceId: currentVehicle.deviceId,
          owner: currentVehicle.owner,
          userId: currentVehicle.userId,
          deviceIdent: currentVehicle.deviceIdent,
          type: vehicle.registrationType,
          gear: vehicle.gearType,
          kaskoInsuranceEndDate: vehicle.kaskoEndDate,
          kaskoInsuranceStartDate: vehicle.kaskoStartDate,
          scratches: currentVehicle.scratches,
          licenseImage: '',
          image: ''
        };

        if (vehicle.vehicleImage) {
          updatedVehicle.imageFile = vehicle.vehicleImage;
        }

        if (vehicle.licenseImageFile) {
          updatedVehicle.licenseImageFile = vehicle.licenseImageFile;
        }

        const newVehicle = await updateVehicle(updatedVehicle);
        newId = newVehicle.vehicleId;

        if (scratches.length > 0) {
          await createScratches(scratches);
        }
      } else {
        const vehicleData: Partial<VehicleDTO> = {
          ...vehicle,
          type: vehicle.registrationType,
          gear: vehicle.gearType,
          kaskoInsuranceEndDate: vehicle.kaskoEndDate,
          kaskoInsuranceStartDate: vehicle.kaskoStartDate,
          licenseImage: '',
          image: ''
        };

        if (vehicle.vehicleImage) {
          vehicleData.imageFile = vehicle.vehicleImage;
        }

        if (vehicle.licenseImageFile) {
          vehicleData.licenseImageFile = vehicle.licenseImageFile;
        }
        const newVehicle = await createVehicle(vehicleData);
        newId = newVehicle.vehicleId;
        if (scratches.length > 0) {
          await createScratches(scratches);
        }
      }
      navigate(`/vehicles/vehicle/${newId}`);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setIsLoadingSave(false);
    }
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

  useEffect(() => {
    (async () => {
      if (!carId) return;
      setIsLoading(true);
      try {
        const vehicle = await getVehicleDetails(carId);
        setCurrentVehicle(vehicle);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [carId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={48} />
      </div>
    );
  }

  return (
    <Formik
      initialValues={carId ? currentVehicleInitialValues : initialValues}
      onSubmit={handleSaveClick}
    >
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
                          type="button"
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
                            type="button"
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
                              type="button"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              className={clsx(
                                'px-4 py-2 bg-success text-white rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3',
                                { 'w-32': isLoadingSave, 'w-auto': !isLoadingSave }
                              )}
                              type="submit"
                              disabled={isLoadingSave}
                            >
                              {isLoadingSave && <CircularProgress size={14} color="success" />}
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
