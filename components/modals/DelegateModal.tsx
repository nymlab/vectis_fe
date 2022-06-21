import React, { useCallback, useEffect, useState } from "react";
import Modal from "components/Modal";
import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { useCosm } from "contexts/cosmwasm";
import networks from "configs/networks";
import { executeDelegation } from "services/vectis";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { convertMicroDenomToDenom } from "utils/conversion";
import clsx from "clsx";
import toast from "react-hot-toast";

interface Props {
  validator: Validator;
  scwallet: string;
  onClose: (modal: string) => void;
}

const DelegateModal: React.FC<Props> = ({ validator, scwallet, onClose }) => {
  const { description } = validator;
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signingClient, address, getBalance } = useCosm();

  const closeModal = useCallback(() => onClose("delegate"), [onClose]);

  useEffect(() => {
    getBalance(scwallet).then(setBalance);
  }, []);

  const delegate = async () => {
    setIsLoading(true);
    await toast
      .promise(executeDelegation(signingClient, address, scwallet, validator.operatorAddress, Number(amount)), {
        loading: "Delegating...",
        success: <b>Delegation successful!</b>,
        error: <b>Delegation failed</b>,
      })
      .catch(console.log);
    getBalance(scwallet).then(setBalance);
    setAmount("0");
    setIsLoading(false);
  };

  return (
    <Modal style={{ overflowY: "initial" }} id={`delegate-modal-${description?.moniker}`} onClose={closeModal}>
      <h3 className="font-bold text-lg">{description?.moniker}</h3>
      <div className="py-4">
        <p className="font-bold">Available balance:</p>
        {balance && <p data-testid="delegate-modal-balance">{convertMicroDenomToDenom(balance.amount) + balance.denom}</p>}
      </div>

      <div className="flex items-center justify-between pb-4">
        <p className="font-bold">Amount to delegate:</p>
        <input
          name="delegate"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className={clsx("flex items-center", { "justify-end": isLoading, " justify-between": !isLoading })}>
        {!isLoading && (
          <label htmlFor={`delegate-modal-${description?.moniker}`} className="btn" onClick={closeModal}>
            back
          </label>
        )}
        <button disabled={isLoading} className={clsx("btn", { loading: isLoading })} onClick={() => delegate()}>
          delegate
        </button>
      </div>
    </Modal>
  );
};

export default DelegateModal;
