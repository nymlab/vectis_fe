import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { Validator, DelegationResponse } from "cosmjs-types/cosmos/staking/v1beta1/staking";

interface Props {
  validator: Validator;
  delegation: DelegationResponse | null;
  openModal: (modal: string) => void;
}

const ValidatorButton: React.FC<Props> = ({ delegation, validator, openModal }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const isDelegated = !!delegation;

  const changeVisibility = useCallback(() => setIsDropdownVisible(!isDropdownVisible), [isDropdownVisible]);

  return (
    <>
      <div className="relative">
        <div className="btn-group justify-end">
          <label
            className={clsx("btn", { "rounded-none": isDelegated })}
            htmlFor={`delegate-modal-${validator.description?.moniker}`}
            onClick={() => openModal("delegate")}
          >
            delegate
          </label>
          {isDelegated && (
            <>
              <button data-testid="delegator-group-button-dropdown" className="btn" onClick={changeVisibility}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </>
          )}
        </div>
        {isDelegated && (
          <div className={clsx("absolute top-12 right-7 flex flex-col", { hidden: !isDropdownVisible })}>
            <label
              className="btn rounded-none"
              htmlFor={`redelegate-modal-${validator.description?.moniker}`}
              onClick={() => [changeVisibility(), openModal("redelegate")]}
            >
              redelegate
            </label>
            <label
              className="btn rounded-none"
              htmlFor={`undelegate-modal-${validator.description?.moniker}`}
              onClick={() => [changeVisibility(), openModal("undelegate")]}
            >
              undelegate
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default ValidatorButton;
