import PhoneInput from '@/components/PhoneInput';
import { AddDevicePageProps } from '../AddDevicePage';
import { useDeviceProvider } from '@/providers/DeviceProvider';
import { useEffect, useState } from 'react';

const Information = ({ device }: AddDevicePageProps) => {
  const { protocols, types, getTypesOfProtocol } = useDeviceProvider();
  const [protocolId, setProtocolId] = useState<string>();
  const [typeId, setTypeId] = useState<string>();

  useEffect(() => {
    if (device?.protocolId && protocols && types) {
      setProtocolId(device.protocolId);
      setTypeId(device.typeId);
    }
  }, [device, protocols, types]);

  return (
    <div className=" card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Information</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="input"
              name="name"
              placeholder="Name"
              defaultValue={device?.name}
            />
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Identify Number</label>
            <input
              type="text"
              className="input"
              name="ident"
              placeholder="Identify Number"
              defaultValue={device?.ident}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Phone</label>
            <PhoneInput
              required
              phoneCodeName="phoneCode"
              phoneCodeInitialValue={device?.phoneCode ? device?.phoneCode : '+90'}
              name="phone"
              initialValue={device?.phone}
            />
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Protocol</label>
            <select
              className="select"
              name="protocolId"
              required
              defaultValue={device?.protocolId}
              onChange={(e) => setProtocolId(e.target.value)}
              value={protocolId}
            >
              <option value="">Select Protocol</option>
              {Object.entries(protocols).map(([id, data]) => (
                <option key={id} value={id}>
                  {data}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Device Type</label>
            <select
              required
              className="select"
              name="typeId"
              defaultValue={device?.typeId}
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              {protocolId ? (
                <>
                  <option value="">Select Type</option>
                  {getTypesOfProtocol(protocolId).map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </>
              ) : (
                <option>Select Protocol</option>
              )}
            </select>
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Plate</label>
            <input
              type="text"
              className="input"
              name="vehiclePlate"
              placeholder="Plate"
              defaultValue={device?.vehiclePlate}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Subscription Start Date</label>
            <input
              required
              type="date"
              className="input w-full dark:[color-scheme:dark]"
              name="subscriptionStartDate"
              placeholder="DD/MM/YYYY"
              defaultValue={device?.subscriptionStartDate}
            />
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Supscription End Date</label>
            <input
              required
              type="date"
              className="input w-full dark:[color-scheme:dark]"
              name="subscriptionEndDate"
              placeholder="DD/MM/YYYY"
              defaultValue={device?.subscriptionEndDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Information };
