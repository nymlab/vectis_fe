import React, { useState } from "react";
import { useCosm } from "contexts/cosmwasm";
import { useStaking, useModal } from "stores";
import { executeRedelegation } from "services/vectis";
import { convertMicroDenomToDenom } from "utils/conversion";
import clsx from "clsx";
import toast from "react-hot-toast";
import Modal from "components/Modal";
import ValidatorSelector from "components/ValidatorSelector";
import ValidatorModal from "./ValidatorModal";

const RedelegateModal: React.FC = () => {
  const { signingClient, queryClient, address } = useCosm();
  const { validator, delegation, validators, scwalletAddr, refreshDelegations } = useStaking();
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newValidator, setNewValidator] = useState<string | null>(null);
  const { description } = validator!;
  const { balance } = delegation!;

  const redelegate = async () => {
    if (!newValidator || !balance || !validator) return;
    setIsLoading(true);
    try {
      await toast.promise(
        (async () => {
          await executeRedelegation(
            signingClient,
            address,
            scwalletAddr,
            validator!.operatorAddress,
            newValidator,
            convertMicroDenomToDenom(balance.amount)
          );
          await refreshDelegations(queryClient);
        })(),
        {
          loading: "Redelegating...",
          success: <b>Redelegation successful!</b>,
          error: ({ message }) => message.split("submessages:")[1],
        }
      );
    } catch (err) {}
    setIsLoading(false);
  };

  return (
    <Modal id={`redelegate-modal-${description?.moniker}`} onClose={closeModal} defaultOpen>
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
            <label htmlFor={`redelegate-modal-${description?.moniker}`} className="btn" onClick={() => openModal(<ValidatorModal />)}>
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
