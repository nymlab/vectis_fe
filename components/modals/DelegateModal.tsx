import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useCosm } from "contexts/cosmwasm";
import { useStaking, useModal } from "stores";
import { executeDelegation } from "services/vectis";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import toast from "react-hot-toast";
import Modal from "components/Modal";
import ValidatorModal from "./ValidatorModal";
import TokenAmount from "../TokenAmount";

const DelegateModal: React.FC = () => {
  const { signingClient, queryClient, address, getBalance } = useCosm();
  const { validator, scwalletAddr, refreshDelegations } = useStaking();
  const { openModal, closeModal } = useModal();
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getBalance(scwalletAddr).then(setBalance);
  }, []);

  const delegate = async () => {
    setIsLoading(true);
    try {
      await toast.promise(
        (async () => {
          await executeDelegation(signingClient, address, scwalletAddr, validator!.operatorAddress, Number(amount));
          await refreshDelegations(queryClient);
        })(),
        {
          loading: "Delegating...",
          success: <b>Delegation successful!</b>,
          error: ({ message }) => message.split("submessages:")[1],
        }
      );
      getBalance(scwalletAddr).then(setBalance);
    } catch (err) {}
    setAmount("0");
    setIsLoading(false);
  };

  if (!validator) return null;

  return (
    <Modal id="delegate-modal" onClose={closeModal} defaultOpen>
      <h3 className="font-bold text-lg">{validator.description?.moniker}</h3>
      <div className="py-4">
        <p className="font-bold">Available balance:</p>
        {balance && <TokenAmount token={balance} />}
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
          <button className="btn" onClick={() => openModal(<ValidatorModal />)}>
            back
          </button>
        )}
        <button disabled={isLoading} className={clsx("btn", { loading: isLoading })} onClick={() => delegate()}>
          delegate
        </button>
      </div>
    </Modal>
  );
};

export default DelegateModal;
