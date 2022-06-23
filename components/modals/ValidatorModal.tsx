import React, { useEffect, useMemo, useState } from "react";
import { useCosm } from "contexts/cosmwasm";
import { useStaking, useModal } from "stores";
import { executeClaimDelegationReward } from "services/vectis";
import { fromRewardsRate } from "utils/conversion";

import toast from "react-hot-toast";
import Modal from "components/Modal";
import { Anchor } from "components/Anchor";
import ValidatorButton from "components/buttons/ValidatorButton";
import TokenAmount from "components/TokenAmount";

import { DecCoin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import clsx from "clsx";

const ValidatorModal: React.FC = () => {
  const { queryClient, signingClient, address } = useCosm();
  const { closeModal } = useModal();
  const { validator, delegations, delegation, scwalletAddr, updateDelegation } = useStaking();
  const [rewards, setRewards] = useState<DecCoin | null>(null);

  const areRewardsAvailable = useMemo(() => rewards && Number(fromRewardsRate(rewards.amount)) > 0.0001, [rewards]);

  useEffect(() => {
    const delegation = delegations.find(({ delegation }) => delegation?.validatorAddress === validator?.operatorAddress);
    if (!delegation) return updateDelegation(null);
    updateDelegation(delegation);
    fetchRewards();
  }, [validator, delegations]);

  const fetchRewards = async () => {
    if (!validator || !delegation) return;
    const { rewards } = await queryClient.distribution.delegationRewards(scwalletAddr, validator.operatorAddress);
    setRewards(rewards[0]);
  };

  const claimRewards = async () => {
    if (!validator || !delegation) return;
    try {
      await toast
        .promise(executeClaimDelegationReward(signingClient, address, scwalletAddr, validator.operatorAddress), {
          loading: "Claiming...",
          success: <b>Claim successful!</b>,
          error: <b>Claim failed</b>,
        })
        .catch(console.log);
      await fetchRewards();
    } catch (err) {
      console.log(err);
    }
  };

  if (!validator || !validator.description) return null;
  return (
    <Modal id={`validator-modal-${validator.description.moniker}`} onClose={closeModal} defaultOpen>
      <div className="">
        <h3 className="font-bold text-lg">{validator.description.moniker}</h3>
        <div className="py-4">
          {validator.description.website ? (
            <>
              <p className="font-bold">Website:</p>
              <Anchor external href={validator.description.website}>
                {validator.description.website}
              </Anchor>
            </>
          ) : (
            <p className="font-bold">No website information</p>
          )}
        </div>
        <div className="pb-4">
          <p className="font-bold">Description:</p>
          <p>{validator.description.details}</p>
        </div>
        {delegation?.balance && (
          <div className="flex items-center justify-between pb-4">
            <p className="font-bold">Delegation:</p>
            <p>
              <TokenAmount token={delegation.balance} />
            </p>
          </div>
        )}
        {rewards && (
          <div className="flex items-center justify-between pb-4">
            <p className="font-bold">
              Rewards: <TokenAmount token={{ denom: rewards.denom, amount: fromRewardsRate(rewards.amount) }} fixedLength={4} />
            </p>
          </div>
        )}
        <div className={clsx("flex justify-end", { "justify-between": areRewardsAvailable })}>
          {areRewardsAvailable && (
            <button className="btn" data-testid="validator-modal-claim" onClick={claimRewards}>
              claim
            </button>
          )}
          <ValidatorButton />
        </div>
      </div>
    </Modal>
  );
};

export default ValidatorModal;
