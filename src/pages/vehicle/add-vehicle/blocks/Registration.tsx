import { registrationTypeOptions } from '../AddVehiclePage';
import FormRadioButton from '../components/FormRadioButton';
import { Field } from 'formik';
import CalendarIcon from '../../blocks/svg/CalendarIcon';

const Registration = () => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">Registration</h3>
      </div>

      <div className="card-body grid gap-5">
        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2.5">
            <label className="form-label">Type</label>
            <div className="flex w-full gap-4">
              {registrationTypeOptions.map((type) => (
                <FormRadioButton name="registrationType" value={type} label={type} />
              ))}
            </div>
          </div>
          {/* Identify Number */}
          <div className="grid gap-2.5">
            <label className="form-label">Identify Number</label>
            <Field
              type="text"
              className="input"
              name="identifyNumber"
              placeholder="Identify Number"
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2.5">
            <label className="form-label">Chassis Number</label>
            <Field
              type="text"
              className="input"
              name="chassisNumber"
              placeholder="Chassis Number"
            />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Engine Number</label>
            <Field type="text" className="input" name="engineNumber" placeholder="Engine Number" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Registration Number</label>
            <Field
              type="text"
              className="input"
              name="registrationNumber"
              placeholder="Registration Number"
            />
          </div>
        </div>

        {/* Registration Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2.5">
            <label className="form-label">Registration Date</label>
            <div className="input">
              <Field type="text" name="registrationDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">First Registration Date</label>
            <div className="input">
              <Field type="text" name="firstRegistrationDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* License and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2.5">
            <label className="form-label">License Serial Number</label>
            <Field
              type="text"
              className="input"
              name="licenseSerialNumber"
              placeholder="License Serial Number"
            />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Price</label>
            <div className="input">
              <Field type="text" name="price" placeholder="Price" />$
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Registration };
