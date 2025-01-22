import { Select, Option } from '@/components/Select';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { countries } from 'countries-list';
import { useMemo } from 'react';
import { SelectOption } from '@mui/base';

export interface PhoneInputProps {
  phoneCodeName: string;
  phoneCodeInitialValue?: string;
  name: string;
  initialValue?: string;
}

const PhoneInput = (props: PhoneInputProps) => {
  const phoneCodesList = useMemo(() => {
    const codeToPhone = Object.entries(countries).map(([code, country]) => [code, country.phone]);
    let phoneCodes: [string, string][] = [];
    codeToPhone.forEach(([code, phone]) => {
      (phone as number[]).forEach((phone) => {
        phoneCodes.push([code as string, `+${phone}`]);
      });
    });
    return phoneCodes;
  }, []);

  const phoneToCodes = useMemo(() => {
    let map = new Map<string, string>();
    phoneCodesList.forEach(([code, phone]) => {
      map.set(phone, code);
    });

    return map;
  }, [phoneCodesList]);

  return (
    <div className="input !pl-0">
      <Select
        className="border-0 border-r"
        name={props.phoneCodeName}
        defaultValue={props.phoneCodeInitialValue}
        renderValue={(option) => {
          if (!option) return null;

          return (
            <div className="flex gap-1">
              <span
                className={`fi fis fi-${phoneToCodes.get((option as SelectOption<string>).value)?.toLowerCase()} rounded-full !size-5`}
              />
              <span>{(option as SelectOption<string>).value}</span>
            </div>
          );
        }}
      >
        {phoneCodesList.map(([code, phone]) => (
          <Option key={code} value={phone}>
            <div className="flex gap-1">
              <span className={`fi fis fi-${code.toLowerCase()} rounded-full !size-5`} />
              <span>{phone}</span>
            </div>
          </Option>
        ))}
      </Select>
      <input
        placeholder="Phone number"
        type="phone"
        defaultValue={props.initialValue}
        name={props.name}
      />
    </div>
  );
};

export default PhoneInput;
