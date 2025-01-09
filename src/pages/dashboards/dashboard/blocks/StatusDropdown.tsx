import { KeenIcon, Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';

export interface StatusDropdownProps {
  selected: string;
  // eslint-disable-next-line no-unused-vars
  setSelected: (value: string) => void;
  options: Record<
    string,
    {
      color: string;
      backgroundColor: string;
      name?: string;
    }
  >;
}

export const StatusDropdown = ({ selected, setSelected, options }: StatusDropdownProps) => {
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
                offset: [0, 10] // [skid, distance]
              }
            }
          ]
        }}
      >
        <MenuToggle
          className="btn btn-clear font-bold text-xs h-fit px-3 py-[6px]"
          style={{
            color: options[selected]?.color ?? 'white',
            backgroundColor: options[selected]?.backgroundColor ?? 'gray'
          }}
        >
          {options[selected]?.name || selected}
          <KeenIcon icon="down" className="!text-inherit !text-xs" />
        </MenuToggle>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
          {Object.entries(options).map(([key, options]) => (
            <MenuItem
              key={key}
              onClick={() => {
                setSelected(key);
              }}
            >
              <MenuLink>
                <MenuTitle>
                  <div
                    style={{
                      color: options.color
                    }}
                  >
                    {options.name || key}
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
