import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useCosm } from "contexts/cosmwasm";
import { executeUndelegation } from "services/vectis";
import { coin, convertMicroDenomToDenom } from "utils/conversion";
import Modal from "components/Modal";

import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { Coin } from "@cosmjs/proto-signing";

interface Props {
  validator: Validator;
  delegation: DelegationResponse;
  scwallet: string;
  onClose: (modal: string) => void;
}

const UndelegateModal: React.FC<Props> = ({ validator, scwallet, delegation, onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<Coin>(delegation.balance!);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signingClient, queryClient, address } = useCosm();
  const { description } = validator;

  const closeModal = useCallback(() => onClose("delegate"), [onClose]);

  const undelegate = async () => {
    setIsLoading(true);
    try {
      await toast
        .promise(executeUndelegation(signingClient, address, scwallet, validator.operatorAddress, amount), {
          loading: "UnDelegating...",
          success: <b>UnDelegation successful!</b>,
          error: <b>UnDelegation failed</b>,
        })
        .catch(console.log);
      setAmount(0);
      const { delegationResponse } = await queryClient.staking.delegation(scwallet, validator.operatorAddress);
      setBalance(delegationResponse?.balance || coin(0));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <Modal style={{ overflowY: "initial" }} id={`undelegate-modal-${description?.moniker}`} onClose={closeModal}>
      <div className="">
        <h3 className="font-bold text-lg">{description?.moniker}</h3>
        <div className="py-4">
          {balance && (
            <p className="font-bold">
              Available for undelegation:{" "}
              <span className="font-normal" data-testid="undelegation-modal-balance">
                {convertMicroDenomToDenom(balance.amount) + ` ${balance.denom.toUpperCase()}`}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pb-4">
          <input
            name="undelegate"
            value={amount}
            onChange={({ target }) => setAmount(+target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className={clsx("flex items-center", { "justify-end": isLoading, " justify-between": !isLoading })}>
          {!isLoading && (
            <label htmlFor={`undelegate-modal-${description?.moniker}`} className="btn" onClick={closeModal}>
              back
            </label>
          )}
          <button disabled={isLoading} className={clsx("btn", { loading: isLoading })} onClick={() => undelegate()}>
            Undelegate
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UndelegateModal;
