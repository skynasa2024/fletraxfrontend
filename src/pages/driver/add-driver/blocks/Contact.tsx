import PhoneInput from '@/components/PhoneInput';
import { Select, Option } from '@/components/Select';
import { SelectOption } from '@mui/base';
import { countries, getCountryCode } from 'countries-list';

const Contact = () => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">Contact</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Phone</label>
            <PhoneInput
              required
              phoneCodeName="firstPhoneCode"
              phoneCodeInitialValue="+90"
              name="firstPhone"
            />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Email</label>
            <input required className="input" name="email" placeholder="Email" type="text" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Phone 2</label>
            <PhoneInput
              required
              phoneCodeName="secondPhoneCode"
              phoneCodeInitialValue="+90"
              name="secondPhone"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Country</label>
            <Select
              name="country"
              defaultValue="Turkey"
              renderValue={(option) => {
                if (!option) return null;

                return (
                  <div className="flex gap-1">
                    <span
                      className={`fi fis fi-${(getCountryCode((option as SelectOption<string>).value) as string).toLowerCase()} rounded-full !size-5`}
                    />
                    <span>{(option as SelectOption<string>).value}</span>
                  </div>
                );
              }}
            >
              {Object.entries(countries).map(([code, country]) => (
                <Option key={code} value={country.name}>
                  <div className="flex gap-1">
                    <span className={`fi fis fi-${code.toLowerCase()} rounded-full !size-5`} />
                    <span>{country.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">City</label>
            <input required type="text" className="input" placeholder="City" name="city" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Area</label>
            <input required type="text" className="input" placeholder="Area" name="state" />
          </div>
        </div>
        <div className="grid gap-2.5">
          <label className="form-label">Address in Detail</label>
          <input
            required
            type="text"
            className="input"
            placeholder="Address in Detail"
            name="address"
          />
        </div>
      </div>
    </div>
  );
};

export { Contact };
