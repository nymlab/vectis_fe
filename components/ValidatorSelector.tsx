import React, { useCallback, useEffect, useState } from "react";
import Dropdown, { DropdownOption } from "./Dropdown";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";

interface Props {
  validators: Validator[];
  onChangeValidator?: (validator: string) => void;
}

const ValidatorSelector: React.FC<Props> = ({ validators, onChangeValidator }) => {
  const [validatorOptions, setValidatorOptions] = useState<DropdownOption[] | null>(null);

  useEffect(() => {
    if (!validators) return;
    setValidatorOptions(validators.map((validator) => ({ label: validator.description?.moniker!, value: validator.operatorAddress })));
  }, [validators]);

  const onChange = useCallback(({ value }: DropdownOption) => onChangeValidator?.(value), []);

  if (!validatorOptions?.length) return null;

  return <Dropdown full initialLabel="Select a validator" options={validatorOptions} onChange={onChange} />;
};

export default ValidatorSelector;
