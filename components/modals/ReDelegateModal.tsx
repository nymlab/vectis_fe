import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useCosm } from "contexts/cosmwasm";
import { executeRedelegation } from "services/vectis";
import Modal from "components/Modal";

import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import ValidatorSelector from "components/ValidatorSelector";
import { convertMicroDenomToDenom } from "utils/conversion";

interface Props {
  validators: Validator[];
  validator: Validator;
  delegation: DelegationResponse;
  scwallet: string;
  onClose: (modal: string) => void;
}

const RedelegateModal: React.FC<Props> = ({ validators, validator, scwallet, delegation: { balance }, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newValidator, setNewValidator] = useState<string | null>(null);
  const { signingClient, address } = useCosm();
  const { description } = validator;

  const closeModal = useCallback(() => onClose("delegate"), [onClose]);

  const redelegate = async () => {
    if (!newValidator || !balance) return;
    setIsLoading(true);
    await toast
      .promise(
        executeRedelegation(
          signingClient,
          address,
          scwallet,
          validator.operatorAddress,
          newValidator,
          convertMicroDenomToDenom(balance.amount)
        ),
        {
          loading: "Redelegating...",
          success: <b>Redelegation successful!</b>,
          error: <b>Redelegation failed</b>,
        }
      )
      .catch(console.log);
    setIsLoading(false);
  };

  return (
    <Modal id={`redelegate-modal-${description?.moniker}`} onClose={closeModal}>
      <div className="">
        <h3 className="font-bold text-lg">{description?.moniker}</h3>
        <div className="py-4">
          <p className="font-bold">Redelegate to:</p>
        </div>

        <div className="pb-4 w-full">
          <ValidatorSelector validators={validators} onChangeValidator={setNewValidator} />
        </div>

        <div className={clsx("flex items-center", { "justify-end": isLoading, " justify-between": !isLoading })}>
          {!isLoading && (
            <label htmlFor={`redelegate-modal-${description?.moniker}`} className="btn" onClick={closeModal}>
              back
            </label>
          )}
          <button disabled={isLoading} className={clsx("btn", { loading: isLoading })} onClick={() => redelegate()}>
            Redelegate
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RedelegateModal;
