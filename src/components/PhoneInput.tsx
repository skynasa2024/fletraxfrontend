import '/node_modules/flag-icons/css/flag-icons.min.css';
import { countries } from 'countries-list';
import { useMemo, useState } from 'react';
import { Autocomplete } from './AutoComplete';

export interface PhoneInputProps {
  phoneCodeName: string;
  phoneCodeInitialValue?: string;
  name: string;
  initialValue?: string;
  required?: boolean;
}

const PhoneInput = (props: PhoneInputProps) => {
  const [search, setSearch] = useState(props.phoneCodeInitialValue ?? '');
  const [selected, setSelected] = useState<string | null>(props.phoneCodeInitialValue ?? null);
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
  const phoneCodes = useMemo(() => {
    const set = new Set<string>();
    phoneCodesList.forEach(([, phone]) => {
      set.add(phone);
    });
    return Array.from(set);
  }, [phoneCodesList]);

  const phoneToCodes = useMemo(() => {
    let map = new Map<string, string>();
    phoneCodesList.forEach(([code, phone]) => {
      map.set(phone, code);
    });

    return map;
  }, [phoneCodesList]);

  return (
    <div className="input !pl-0">
      <Autocomplete
        options={phoneCodes}
        renderPrefix={(option) => {
          return (
            <span
              className={`fi fis fi-${phoneToCodes.get(option)?.toLowerCase()} rounded-full !size-5`}
            />
          );
        }}
        renderValue={(option) => {
          if (!option) return null;

          return (
            <div className="flex gap-1">
              <span
                className={`fi fis fi-${phoneToCodes.get(option)?.toLowerCase()} rounded-full !size-5`}
              />
              <span>{option}</span>
            </div>
          );
        }}
        onChange={(e, v) => setSelected(v)}
        value={selected}
        inputValue={search}
        onInputChange={(e, v) => setSearch(v ?? '')}
        isOptionEqualToValue={(option, value) => option === value}
      />
      <input
        hidden
        readOnly
        required={props.required}
        type="text"
        name={props.phoneCodeName}
        value={selected ?? ''}
      />
      <input
        required={props.required}
        placeholder="Phone number"
        type="phone"
        defaultValue={props.initialValue}
        name={props.name}
        className="w-full"
      />
    </div>
  );
};

export default PhoneInput;
