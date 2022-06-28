import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { useStaking, useModal } from "stores";
import DelegateModal from "components/modals/DelegateModal";
import RedelegateModal from "components/modals/ReDelegateModal";
import UndelegateModal from "components/modals/UnDelegateModal";

const ValidatorButton: React.FC = () => {
  const { openModal } = useModal();
  const { delegation } = useStaking();
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const isDelegated = !!delegation;

  const changeDropdownVisibility = useCallback(() => setIsDropdownVisible(!isDropdownVisible), [isDropdownVisible]);

  return (
    <>
      <div className="relative">
        <div className="btn-group justify-end">
          {isDelegated && (
            <>
              <button data-testid="delegator-group-button-dropdown" className="btn" onClick={changeDropdownVisibility}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </>
          )}
          <button className={clsx("btn", { "rounded-br-sm": isDelegated })} onClick={() => openModal(<DelegateModal />)}>
            delegate
          </button>
        </div>
        {isDelegated && (
          <div className={clsx("absolute top-12 right-0 flex flex-col", { hidden: !isDropdownVisible })}>
            <button className="btn rounded-none" onClick={() => openModal(<RedelegateModal />)}>
              redelegate
            </button>
            <button className="btn rounded-none" onClick={() => openModal(<UndelegateModal />)}>
              undelegate
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ValidatorButton;
