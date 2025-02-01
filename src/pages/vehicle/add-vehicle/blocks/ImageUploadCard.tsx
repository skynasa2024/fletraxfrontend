import { Field } from 'formik';
import { STATUS_OPTIONS } from '../../constants';
import FormikFileUpload from '../components/FormikFileUpload';

const ImageUploadCard = () => {
  return (
    <div className="flex flex-col gap-5 p-3">
      <div className="p-4 card grid gap-2.5 overflow-auto">
        <label className="form-label card-title">Vehicle Image</label>
        <FormikFileUpload name="vehicleImage" />
      </div>
      <div className="card p-4 gap-4">
        <label className="form-label card-title">Plate Number</label>

        <div className="flex font-medium">
          <div className="rounded-s-lg py-2 px-2 bg-[#5271FF] text-white">TR</div>
          <Field
            type="text"
            className="input rounded-s-none"
            name="plateNumber"
            placeholder="56084684"
          />
        </div>
      </div>
      <div className="card p-4 gap-4">
        <h3 className="card-title">Status</h3>
        <Field as="select" name="status" className="select">
          {Object.entries(STATUS_OPTIONS).map(([key, value], idx) => (
            <option key={key + idx} value={key}>
              {value.name}
            </option>
          ))}
        </Field>
      </div>

      {/* HGS Number Card */}
      <div className="card p-4 gap-4">
        <h3 className="card-title">HGS Number</h3>
        <Field type="text" className="input" name="hgsNumber" placeholder="HGS Number" />
      </div>

      {/* Performance Metrics Card */}
      <div className="card p-4 gap-4">
        <h3 className="card-title">Performance Metrics</h3>
        <div className="grid gap-2.5">
          <div className="grid gap-2.5">
            <label className="form-label">Current Mileage</label>
            <Field
              type="number"
              className="input"
              name="currentMileage"
              placeholder="Current Mileage"
            />
          </div>
          <div className="grid gap-2.5 mt-4">
            <label className="form-label">Maintenance Mileage</label>
            <Field
              type="number"
              className="input"
              name="maintenanceMileage"
              placeholder="Maintenance Mileage"
            />
          </div>
          <div className="grid gap-2.5 mt-4">
            <label className="form-label">Fuel Consumption (KM)</label>
            <Field
              type="number"
              className="input"
              name="fuelConsumption"
              placeholder="Fuel Consumption"
            />
          </div>
        </div>
      </div>
      <div className="card p-4 grid gap-2.5 overflow-auto">
        <label className="form-label card-title">Documents</label>
        <FormikFileUpload name="documents" />
      </div>
    </div>
  );
};

export { ImageUploadCard };
