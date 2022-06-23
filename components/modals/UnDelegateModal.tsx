import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useCosm } from "contexts/cosmwasm";
import { executeUndelegation } from "services/vectis";
import { coin } from "utils/conversion";
import Modal from "components/Modal";
import { Coin } from "@cosmjs/proto-signing";
import { useModal, useStaking } from "stores";
import ValidatorModal from "./ValidatorModal";
import TokenAmount from "components/TokenAmount";

const UndelegateModal: React.FC = () => {
  const { signingClient, queryClient, address } = useCosm();
  const { delegation, validator, scwalletAddr, refreshDelegations } = useStaking();
  const { openModal, closeModal } = useModal();
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<Coin>(delegation?.balance || coin(0));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const undelegate = async () => {
    setIsLoading(true);
    try {
      await toast.promise(
        (async () => {
          await executeUndelegation(signingClient, address, scwalletAddr, validator!.operatorAddress, Number(amount));
          await refreshDelegations(queryClient);
        })(),
        {
          loading: "UnDelegating...",
          success: <b>UnDelegation successful!</b>,
          error: ({ message }) => message.split("submessages:")[1],
        }
      );
      setBalance(coin(Number(balance.amount) - Number(amount)));
    } catch (err) {}
    setAmount("0");
    setIsLoading(false);
  };

  if (!validator || !delegation) return null;

  return (
    <Modal id={`undelegate-modal-${validator.description?.moniker}`} onClose={closeModal} defaultOpen>
      <div className="">
        <h3 className="font-bold text-lg">{validator.description?.moniker}</h3>
        <div className="py-4">
          {balance && (
            <p className="font-bold">
              Available for undelegation: <TokenAmount token={balance} data-testid="undelegation-modal-balance" />
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pb-4">
          <input
            name="undelegate"
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className={clsx("flex items-center", { "justify-end": isLoading, " justify-between": !isLoading })}>
          {!isLoading && (
            <label htmlFor={`undelegate-modal-${validator.description?.moniker}`} className="btn" onClick={() => openModal(<ValidatorModal />)}>
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
