import { Field } from 'formik';
import {
  carOptions,
  colorOptions,
  fuelOptions,
  gearOptions,
  numberOfSeatsOptions
} from '../AddVehiclePage';
import FormRadioButton from '../components/FormRadioButton';
import CalendarIcon from '../../blocks/svg/CalendarIcon';

interface IGeneralSettingsProps {
  title: string;
}
const Information = ({ title }: IGeneralSettingsProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="vehicle_information">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        {/* Brand and Model Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Brand</label>
            <Field type="text" className="input" name="brand" placeholder="Brand" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Model</label>
            <Field type="text" className="input" name="model" placeholder="Model" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Model Series</label>
            <Field type="text" className="input" name="modelSeries" placeholder="Model Series" />
          </div>
        </div>

        {/* Model Year, Volume, Power Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Model Year</label>
            <div className="input">
              <Field type="number" step="1" name="modelYear" placeholder="Model Year" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Volume</label>
            <Field type="text" className="input" name="volume" placeholder="Volume" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Power</label>
            <Field type="text" className="input" name="power" placeholder="Power" />
          </div>
        </div>

        {/* Fuel Type */}
        <div className="grid gap-2.5">
          <label className="form-label">Fuel Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-col-6 gap-4 w-full">
            {fuelOptions.map((fuel, idx) => (
              <FormRadioButton
                key={fuel.value + idx}
                name={'fuelType'}
                value={fuel.value}
                label={fuel.label}
              />
            ))}
          </div>
        </div>

        {/* Car Type */}
        <div className="grid gap-2.5">
          <label className="form-label">Car Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
            {carOptions.map((type, idx) => (
              <FormRadioButton
                key={type.value + idx}
                name={'carType'}
                value={type.value}
                label={type.label}
                icon={type.icon}
              />
            ))}
          </div>
        </div>

        {/* Gear */}
        {/* Gear, Color, and Number of Seats Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Gear */}
          <div className="grid gap-2.5">
            <label className="form-label">Gear</label>
            <div className="grid  md:grid-cols-2 gap-4 w-full ">
              {gearOptions.map((gear, idx) => (
                <FormRadioButton
                  key={gear.value + idx}
                  name="gearType"
                  value={gear.value}
                  label={gear.label}
                  icon={gear.icon}
                />
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="grid gap-2.5 relative">
            <label className="form-label">Color</label>
            <Field as="select" name="color" className="select">
              {colorOptions.map((color, idx) => (
                <option key={color + idx} value={color}>
                  {color}
                </option>
              ))}
            </Field>
          </div>

          {/* Number of Seats */}
          <div className="grid gap-2.5 relative">
            <label className="form-label">Number of seats</label>
            <Field as="select" name="numberOfSeats" className="select">
              {numberOfSeatsOptions.map((num, idx) => (
                <option key={num + idx} value={num}>
                  {num}
                </option>
              ))}
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Information, type IGeneralSettingsProps };
