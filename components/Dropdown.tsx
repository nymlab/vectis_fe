import clsx from "clsx";
import React from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface Props {
  initialLabel: string;
  options: { label: string; value: string }[];
  onChange?: (option: DropdownOption) => void;
  full?: boolean;
}

const Dropdown: React.FC<Props> = ({ initialLabel, options, onChange, full }) => {
  const [selected, setSelected] = React.useState<string>(initialLabel);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(false);

  const onSelection = (option: DropdownOption) => {
    setIsDropdownVisible(false);
    setSelected(option.label);
    onChange?.(option);
  };

  return (
    <div data-testid="wallet-selector" className={clsx("dropdown", { "w-full": full })}>
      <button className={clsx("btn m-1", { "w-full": full })} onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
        {selected}
      </button>
      <ul
        className={clsx("menu p-2 shadow bg-base-100 rounded-box absolute", {
          hidden: !isDropdownVisible,
          "w-full max-h-40 overflow-y-scroll": full,
        })}
      >
        {options.map((option) => (
          <li key={option.value} onClick={() => onSelection(option)}>
            <a>{option.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

Dropdown.displayName = "Dropdown";

export default Dropdown;
