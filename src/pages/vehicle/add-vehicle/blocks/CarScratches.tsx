import React, { useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import TrashIcon from '../../blocks/svg/TrashIcon';
import UploadedFileIcon from '../../blocks/svg/UploadedFileIcon';
import { CircularProgress, Modal } from '@mui/material';
import Dropzone from '../components/Dropzone';
import { useParams } from 'react-router';
import { createScratch, deleteScratch, getScratches, ScratchDTO, updateScratch } from '@/api/cars';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { ResponseModel } from '@/api/response';
import { FormattedMessage, useIntl } from 'react-intl';

const CarScratches: React.FC = () => {
  const { id } = useParams();
  const [scratches, setScratches] = useState<ScratchDTO[]>();
  const [newScratch, setNewScratch] = useState<ScratchDTO>();

  const handleAddPlace = () => {
    setNewScratch({
      place: 1,
      explanationOf: '',
      vehicleId: id || '',
      image: null
    });
  };

  const handleRefresh = () => {
    if (id) {
      setScratches(undefined);
      getScratches(id, { start: 0, end: 10000 }).then((res) => {
        setScratches(res);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getScratches(id, { start: 0, end: 10000 }).then((res) => {
        setScratches(res);
      });
    }
  }, [id]);

  if (!scratches) {
    return <CircularProgress />;
  }

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">
          <FormattedMessage id="VEHICLE.SCRATCHES.TITLE" />
        </h3>
      </div>
      <div className="card-body grid gap-5 grid-cols-1 md:grid-cols-[1fr,300px]">
        {/* Left Column */}
        <div className="space-y-6 p-4">
          {/* Dropdown and Add Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FormattedMessage id="VEHICLE.SCRATCHES.CHOOSE_PLACE" />
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleAddPlace()}
                className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
              >
                <FormattedMessage id="COMMON.ADD" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              <FormattedMessage id="VEHICLE.SCRATCHES.AS_PER_SIDE_IMAGE" />
            </p>
          </div>

          {/* Place Sections */}
          {scratches.map((scratch, index) => (
            <CarScratchForm
              key={index} // Using index as key since places can be duplicated
              index={index}
              scratch={scratch}
              onRefresh={handleRefresh}
            />
          ))}
          {newScratch && (
            <CarScratchForm
              index={scratches.length}
              scratch={newScratch}
              onRefresh={() => {
                setNewScratch(undefined);
                handleRefresh();
              }}
              newScratch
              onDelete={() => setNewScratch(undefined)}
            />
          )}
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
  scratch: ScratchDTO;
  onRefresh: () => void;
  newScratch?: boolean;
  onDelete?: () => void;
}

const CarScratchForm: React.FC<CarScratchFormProps> = ({
  scratch,
  onRefresh,
  newScratch,
  onDelete
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [place, setPlace] = useState(scratch.place);
  const [changed, setChanged] = useState(newScratch || false);
  const [file, setFile] = useState<File | undefined>(
    scratch.image ? new File([], 'File') : undefined
  );
  const fileInpueRef = React.createRef<HTMLInputElement>();
  const handleRemove = async () => {
    if (onDelete) {
      onDelete();
      return;
    }
    try {
      if (!scratch.id) return;
      await deleteScratch(scratch.id);
      enqueueSnackbar(
        intl.formatMessage({ id: 'VEHICLE.SCRATCHES.NOTIFICATIONS.DELETE_SUCCESS' }),
        { variant: 'success' }
      );
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ResponseModel<never>>;
        enqueueSnackbar(
          axiosError.response?.data.message || intl.formatMessage({ id: 'COMMON.ERROR' }),
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar(intl.formatMessage({ id: 'COMMON.ERROR' }), { variant: 'error' });
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (newScratch) {
        await createScratch(formData);
      } else {
        formData.append('scratches[0].id', scratch.id || '');
        await updateScratch(formData);
      }
      enqueueSnackbar(intl.formatMessage({ id: 'VEHICLE.SCRATCHES.NOTIFICATIONS.SAVE_SUCCESS' }), {
        variant: 'success'
      });
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ResponseModel<never>>;
        enqueueSnackbar(
          axiosError.response?.data.message || intl.formatMessage({ id: 'COMMON.ERROR' }),
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar(intl.formatMessage({ id: 'COMMON.ERROR' }), { variant: 'error' });
      }
    }
  };

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (file?.name === 'File' && scratch.image) {
          formData.set(`scratches[0].image`, scratch.image);
        }
        if (file && file.size > 0) {
          formData.set(`scratches[0].imageFile`, file);
        }
        handleSave(formData);
      }}
    >
      <input type="hidden" name={`scratches[0].vehicleId`} value={scratch.vehicleId} />
      <div className="p-4 border rounded-xl border-gray-600 relative">
        {/* Dynamic Place Label */}
        <h3 className="text-lg font-medium mb-4">
          <FormattedMessage id="VEHICLE.SCRATCHES.PLACE" values={{ number: place }} />
        </h3>

        {/* Delete Button */}
        <button
          type="button"
          className="absolute top-4 end-4 text-red-500 hover:text-red-700"
          onClick={handleRemove}
        >
          <TrashIcon />
        </button>

        <div className="space-y-4">
          <div className="flex gap-4">
            {/* Place Dropdown */}
            <div className="w-1/3">
              <select
                name={`scratches[0].place`}
                className="select border rounded-lg border-gray-600 h-16 w-full"
                value={place}
                onChange={(e) => {
                  setPlace(+e.target.value);
                  setChanged(true);
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                <FormattedMessage id="VEHICLE.SCRATCHES.AS_PER_SIDE_IMAGE" />
              </p>
            </div>

            {/* Image Upload */}
            <div className="w-2/3">
              <Dropzone
                onDrop={(file) => {
                  setFile(file ?? undefined);
                  setChanged(true);
                }}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2 border border-gray-600 p-4 h-16 rounded-lg">
                    <UploadedFilePreview file={file ?? undefined} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setFile(undefined);
                        setChanged(true);
                      }}
                      className="text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 hover:bg-red-500/5 px-6 py-2 rounded-md"
                    >
                      <FormattedMessage id="COMMON.REMOVE" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`scratches[0].imageFile`}
                    className="relative border border-gray-600 rounded-lg h-16 flex items-center justify-between px-4 cursor-pointer"
                  >
                    <span className="text-gray-500">
                      <FormattedMessage id="FILE_UPLOAD.DRAG_DROP" />
                    </span>
                    <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                      <FormattedMessage id="FILE_UPLOAD.CHOOSE_FILES" />
                    </span>
                  </label>
                )}
              </Dropzone>
              <input type="file" name={`scratches[0].imageFile`} hidden ref={fileInpueRef} />
            </div>
          </div>

          {/* Explanation Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FormattedMessage id="VEHICLE.SCRATCHES.EXPLANATION" />
            </label>
            <textarea
              name={`scratches[0].explanationOf`}
              defaultValue={scratch.explanationOf}
              className="dark:bg-light-active dark:light-active mt-1 w-full p-3 border rounded-xl border-gray-600 resize-none h-32"
              placeholder={intl.formatMessage({ id: 'VEHICLE.SCRATCHES.EXPLANATION.PLACEHOLDER' })}
              onChange={() => setChanged(true)}
            />
          </div>
          {changed && (
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 btn btn-success">
                <FormattedMessage id="COMMON.SAVE" />
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

type UploadedFilePreviewProps = {
  file?: File;
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

  if (!file) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 items-center justify-between grow">
        <div className="flex gap-4 items-center">
          <UploadedFileIcon fileExtension={file.type?.split('/')?.[1]} />
          <span className="max-w-44 text-ellipsis truncate">{file.name}</span>
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
          <FormattedMessage id="COMMON.VIEW" />
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
