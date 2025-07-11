import { Box, CircularProgress, Modal } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { createDevice, DeviceDTO, updateDevice } from '@/api/devices';
import { useDeviceProvider } from '@/providers/DeviceProvider';
import PhoneInput from '@/components/PhoneInput';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError } from 'axios';
import { ResponseModel } from '@/api/response';
import { enqueueSnackbar } from 'notistack';
import { getFormattedDate } from '@/utils';
import { addYears } from 'date-fns';
import { useAuthContext } from '@/auth';

interface EditDeviceModalProps {
  device?: DeviceDTO | null;
  onSuccess: () => void;
  renderActionButton: (onClick: () => void) => React.ReactNode;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

export function DeviceMutationModal({
  device,
  onSuccess,
  renderActionButton
}: EditDeviceModalProps) {
  const { currentUser } = useAuthContext();
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { protocols, getTypesOfProtocol } = useDeviceProvider();
  const [protocolId, setProtocolId] = useState<string>('');
  const [typeId, setTypeId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (device) {
      setProtocolId(device.protocolId || '');
      setTypeId(device.typeId || '');
    }
  }, [device]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      await (device ? updateDevice(device.id, formData) : createDevice(formData));
      enqueueSnackbar(intl.formatMessage({ id: 'DEVICE.FORM.SAVE_SUCCESS' }), {
        variant: 'success'
      });
      onSuccess();
      handleClose();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {renderActionButton(handleOpen)}
      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose();
          }
        }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle}>
          <h2 className="text-xl font-semibold mb-4">
            <FormattedMessage id="DEVICE.EDIT.TITLE" />
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Identify Number */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.IDENTIFY_NUMBER" />
                </label>
                <input
                  type="text"
                  name="ident"
                  className="input w-full"
                  defaultValue={device?.ident}
                  required
                />
              </div>

              {/* Device Name */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.NAME" />
                </label>
                <input
                  type="text"
                  name="name"
                  className="input w-full"
                  defaultValue={device?.name}
                />
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.PHONE" />
                </label>
                <PhoneInput
                  required
                  phoneCodeName="phoneCode"
                  phoneCodeInitialValue={device?.phoneCode || '+90'}
                  name="phone"
                  initialValue={device?.phone}
                />
              </div>

              {/* Protocol */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.PROTOCOL" />
                </label>
                <select
                  className="select"
                  name="protocolId"
                  required
                  value={protocolId}
                  onChange={(e) => {
                    setProtocolId(e.target.value);
                    setTypeId('');
                  }}
                >
                  <option value="">
                    {intl.formatMessage({ id: 'DEVICE.FORM.SELECT_PROTOCOL' })}
                  </option>
                  {Object.entries(protocols).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.TYPE" />
                </label>
                <select
                  className="select"
                  name="typeId"
                  required
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                >
                  {protocolId ? (
                    <>
                      <option value="">
                        {intl.formatMessage({ id: 'DEVICE.FORM.SELECT_TYPE' })}
                      </option>
                      {getTypesOfProtocol(protocolId).map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="">
                      {intl.formatMessage({ id: 'DEVICE.FORM.SELECT_PROTOCOL_FIRST' })}
                    </option>
                  )}
                </select>
              </div>

              {/* Vehicle Plate */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.PLATE" />
                </label>
                <input
                  type="text"
                  name="vehiclePlate"
                  className="input w-full"
                  defaultValue={device?.vehiclePlate}
                />
              </div>

              {/* Start Date */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.START_DATE" />
                </label>
                <input
                  type="date"
                  name="subscriptionStartDate"
                  className="input w-full"
                  required
                  defaultValue={
                    device?.subscriptionStartDate ||
                    getFormattedDate(undefined, currentUser?.timezone)
                  }
                />
              </div>

              {/* End Date */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="MANAGEMENT.DEVICES.COLUMN.END_DATE" />
                </label>
                <input
                  type="date"
                  name="subscriptionEndDate"
                  className="input w-full"
                  required
                  defaultValue={
                    device?.subscriptionEndDate ||
                    getFormattedDate((d) => addYears(d, 1), currentUser?.timezone)
                  }
                />
              </div>

              {/* Installation Status */}
              <div className="grid gap-2.5">
                <label className="form-label">
                  <FormattedMessage id="DEVICE.FORM.INSTALATION_STATUS" />
                </label>
                <select
                  className="select"
                  name="installationStatus"
                  defaultValue={device?.installationStatus}
                  required
                >
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Installation Date */}
              <div className="grid gap-2.5">
                <label className="form-label">
                  <FormattedMessage id="DEVICE.FORM.INSTALATION_DATE" />
                </label>
                <input
                  required
                  type="date"
                  className="input w-full dark:[color-scheme:dark]"
                  name="installationDate"
                  placeholder="DD/MM/YYYY"
                  defaultValue={
                    device?.installationDate || getFormattedDate(undefined, currentUser?.timezone)
                  }
                />
              </div>

              {/* Distributor */}
              <div className="grid gap-2">
                <label className="form-label">
                  <FormattedMessage id="DEVICE.FORM.DISTRIBUTOR" />
                </label>
                <input
                  required
                  type="text"
                  className="input w-full dark:[color-scheme:dark]"
                  name="distributor"
                  defaultValue={device?.distributor}
                  placeholder={intl.formatMessage({ id: 'DEVICE.FORM.DISTRIBUTOR.PLACEHOLDER' })}
                />
              </div>

              {/* Odometer */}
              <div className="grid gap-2.5">
                <label className="form-label">
                  <FormattedMessage id="DEVICE.FORM.ODOMETER" />
                </label>
                <input
                  required
                  type="number"
                  className="input w-full dark:[color-scheme:dark]"
                  name="odometer"
                  defaultValue={device?.odometer}
                  placeholder={intl.formatMessage({ id: 'DEVICE.FORM.ODOMETER.PLACEHOLDER' })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="btn btn-light"
                onClick={handleClose}
                disabled={loading}
              >
                <FormattedMessage id="COMMON.CANCEL" />
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <CircularProgress size={12} color="inherit" />}
                <FormattedMessage id="COMMON.SAVE" />
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
