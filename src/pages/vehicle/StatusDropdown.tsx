import { KeenIcon, Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';
import { Dispatch, SetStateAction } from 'react';

type DropdownOption = {
  color: string;
  backgroundColor: string;
  name: string;
};

export type DropdownOptions<T extends string> = Record<T, DropdownOption>;

export interface StatusDropdownProps<T extends string> {
  selected: T | null;
  setSelected: Dispatch<SetStateAction<T | null>>;
  options: DropdownOptions<T>;
}

export const StatusDropdown = <T extends string>({
  selected,
  setSelected,
  options
}: StatusDropdownProps<T>) => {
  const selectedOption = selected ? options[selected] : null;

  return (
    <Menu>
      <MenuItem
        toggle="dropdown"
        trigger="click"
        dropdownProps={{
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10]
              }
            }
          ]
        }}
      >
        <MenuToggle
          className="btn btn-clear font-bold text-xs h-fit px-3 py-[6px]"
          style={{
            color: selectedOption?.color ?? 'white',
            backgroundColor: selectedOption?.backgroundColor ?? '#41424663'
          }}
        >
          {selectedOption?.name ?? 'Unknown'}
          <KeenIcon icon="down" className="!text-inherit !text-xs" />
        </MenuToggle>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
          {(Object.entries(options) as [T, DropdownOption][]).map(([key, option]) => (
            <MenuItem key={key}>
              <MenuLink
                handleClick={() => {
                  setSelected(key);
                }}
              >
                <MenuTitle>
                  <div
                    style={{
                      color: option.color
                    }}
                  >
                    {option.name}
                  </div>
                </MenuTitle>
              </MenuLink>
            </MenuItem>
          ))}
        </MenuSub>
      </MenuItem>
    </Menu>
  );
};
