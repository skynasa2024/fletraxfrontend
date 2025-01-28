import React, { useState } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { ArrayHelpers, ErrorMessage, Field, FieldArray, FormikProps } from 'formik';
import { AddVehicleForm, CarScratchesFormField, Scratch } from '../AddVehiclePage';
import TrashIcon from '../../blocks/svg/TrashIcon';
import UploadedFileIcon from '../../blocks/svg/UploadedFileIcon';
import { Modal } from '@mui/material';
import Dropzone from '../components/Dropzone';

interface CarScratchesProps {
  formikProps: FormikProps<AddVehicleForm>;
}

const CarScratches: React.FC<CarScratchesProps> = ({ formikProps }) => {
  const { values } = formikProps;
  const [selectedPlace, setSelectedPlace] = useState<string>('8');

  const handleAddPlace = (arrayHelpers: ArrayHelpers) => {
    const placeNumber = parseInt(selectedPlace, 10);
    arrayHelpers.push({
      place: placeNumber,
      explanationOf: '',
      vehicleId: '',
      image: null
    });
  };

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">Car Scratches</h3>
      </div>
      <div className="card-body grid gap-5 grid-cols-1 md:grid-cols-[1fr,300px]">
        {/* Left Column */}
        <div className="space-y-6 p-4">
          {/* Dropdown and Add Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose a place</label>
            <div className="flex gap-4">
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="select"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={String(num)}>
                    {num}
                  </option>
                ))}
              </select>
              <FieldArray name="scratches">
                {(arrayHelpers) => (
                  <button
                    type="button"
                    onClick={() => handleAddPlace(arrayHelpers)}
                    className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
                  >
                    Add
                  </button>
                )}
              </FieldArray>
            </div>
            <p className="mt-2 text-sm text-gray-500">As per side image</p>
          </div>

          {/* Place Sections */}
          <FieldArray name="scratches">
            {(arrayHelpers) =>
              values.scratches.map((scratch, index) => (
                <CarScratchForm
                  key={index} // Using index as key since places can be duplicated
                  index={index}
                  arrayHelpers={arrayHelpers}
                  scratch={scratch}
                  setFieldValue={formikProps.setFieldValue}
                />
              ))
            }
          </FieldArray>
        </div>

        {/* Right Column - Image Space */}
        <div className="relative flex p-4 justify-center items-center w-[310px] h-[800px]">
          <img src={toAbsoluteUrl('/media/images/car.png')} alt="Car" className="" />
          {/* Corners */}
          <div className="absolute top-[130px] left-10 w-16 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-full" />
          <div
            className="absolute top-[130px] right-10 w-16 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-full"
            style={{ boxShadow: '4px 0px 0px 0px rgba(0, 0, 0, 0.1)' }}
          />
          <div className="absolute bottom-[130px] left-10 w-16 h-20 border-b-2 border-l-2 border-blue-500 rounded-bl-full shadow-lg" />
          <div className="absolute bottom-[130px] right-10 w-16 h-20 border-b-2 border-r-2 border-blue-500 rounded-br-full shadow-lg" />
          {/* Buttons */}
          {/* Top */}
          <button className="absolute top-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            1
          </button>
          <button className="absolute top-[110px] left-0 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            10
          </button>
          <button className="absolute top-[110px] right-0 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            2
          </button>
          {/* Upper Middle */}
          <button className="absolute top-[290px] left-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            9
          </button>
          <button className="absolute top-[300px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            11
          </button>
          <button className="absolute top-[290px] right-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            3
          </button>
          {/* Lower Middle */}
          <button className="absolute bottom-1/3 left-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            8
          </button>
          <button className="absolute bottom-[280px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            12
          </button>
          <button className="absolute bottom-1/3 right-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            4
          </button>
          {/* Bottom */}
          <button className="absolute bottom-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            6
          </button>
          <button className="absolute bottom-[110px] left-4 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            7
          </button>
          <button className="absolute bottom-[110px] right-4 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            5
          </button>
        </div>
      </div>
    </div>
  );
};

interface CarScratchFormProps {
  index: number;
  arrayHelpers: any;
  scratch: Scratch;
  setFieldValue: FormikProps<CarScratchesFormField>['setFieldValue'];
}

const CarScratchForm: React.FC<CarScratchFormProps> = ({
  index,
  arrayHelpers,
  scratch,
  setFieldValue
}) => {
  const handleRemove = () => {
    arrayHelpers.remove(index);
  };

  return (
    <div className="space-y-2">
      <div className="p-4 border rounded-xl border-gray-600 relative">
        {/* Dynamic Place Label */}
        <h3 className="text-lg font-medium mb-4">Place {scratch.place}</h3>

        {/* Delete Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          onClick={handleRemove}
        >
          <TrashIcon />
        </button>

        <div className="space-y-4">
          <div className="flex gap-4">
            {/* Place Dropdown */}
            <div className="w-1/3">
              <Field
                as="select"
                name={`scratches.${index}.place`}
                className="select border rounded-lg border-gray-600 h-16 w-full"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name={`scratches.${index}.place`}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">As per side image</p>
            </div>

            {/* Image Upload */}
            <div className="w-2/3">
              <Dropzone
                onDrop={(file) => {
                  setFieldValue(`scratches.${index}.image`, file || null);
                }}
              >
                {scratch.image ? (
                  <div className="flex items-center justify-center gap-2 border border-gray-600 p-4 h-16 rounded-lg">
                    <UploadedFilePreview file={scratch.image} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setFieldValue(`scratches.${index}.image`, null);
                      }}
                      className="text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 hover:bg-red-500/5 px-6 py-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`scratches.${index}.image`}
                    className="relative border border-gray-600 rounded-lg h-16 flex items-center justify-between px-4 cursor-pointer"
                  >
                    <span className="text-gray-500">Drag and drop your files</span>
                    <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                      Or choose files
                    </span>
                  </label>
                )}
              </Dropzone>
            </div>
          </div>

          {/* Explanation Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Explanation of Place</label>
            <Field
              as="textarea"
              name={`scratches.${index}.explanationOf`}
              className="dark:bg-light-active dark:light-active mt-1 w-full p-3 border rounded-xl border-gray-600 resize-none h-32"
              placeholder={`Describe the scratch in detail. For example: 
- Length: Approximately 15cm long scratch
- Type: Appears to be from contact with another car's door
- Color of affected area: White paint with some gray marks
- Additional details: Minor paint transfer visible, no denting observed`}
            />
            <ErrorMessage
              name={`scratches.${index}.explanationOf`}
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type UploadedFilePreviewProps = {
  file: File;
};

function UploadedFilePreview({ file }: UploadedFilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleModalClose = (e?: React.SyntheticEvent | MouseEvent | KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-between grow">
        <div className="flex gap-4 items-center">
          <UploadedFileIcon fileExtension={file.type.split('/')[1]} />
          <span className="max-w-56 text-ellipsis truncate">{file.name}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsPreviewOpen(true);
          }}
          className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
        >
          View
        </button>
      </div>

      <Modal
        open={isPreviewOpen}
        onClose={(e) => handleModalClose(e as React.SyntheticEvent)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white rounded-lg shadow-lg p-4 flex justify-center items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={URL.createObjectURL(file)} alt={file.name} className="object-contain" />
        </div>
      </Modal>
    </>
  );
}

export { CarScratches };
