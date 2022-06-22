import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "components/Modal";
import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { Anchor } from "components/Anchor";
import ValidatorButton from "components/buttons/ValidatorButton";
import DelegateModal from "components/modals/DelegateModal";
import RedelegateModal from "components/modals/ReDelegateModal";
import UndelegateModal from "components/modals/UnDelegateModal";
import { useCosm } from "contexts/cosmwasm";
import { fromValidationRate } from "utils/conversion";
import { DecCoin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import toast from "react-hot-toast";
import { executeClaimDelegationReward } from "services/vectis";
import { useRouter } from "next/router";
import TokenAmount from "components/TokenAmount";

interface ModalsVisibility {
  delegate: boolean;
  redelegate: boolean;
  undelegate: boolean;
}

interface Props {
  validator: Validator | null;
  validators: Validator[];
  onClose: () => void;
}

const ValidatorModal: React.FC<Props> = ({ validators, validator, onClose }) => {
  const { query } = useRouter();
  const { queryClient, signingClient, address } = useCosm();
  const [delegation, setDelegation] = useState<DelegationResponse | null>(null);
  const [rewards, setRewards] = useState<DecCoin | null>(null);
  const [modalsVisibility, setModalsVisibility] = useState<ModalsVisibility>({ delegate: false, redelegate: false, undelegate: false });
  const { address: scwallet } = query as { address: string };

  const openModal = useCallback((modal: string) => setModalsVisibility({ ...modalsVisibility, [modal]: true }), []);
  const closeModal = useCallback((modal: string) => setModalsVisibility({ ...modalsVisibility, [modal]: false }), []);

  const areRewardsAvailable = useMemo(() => rewards && Number(fromValidationRate(rewards.amount)) > 0.0001, [rewards]);

  const fetchRewards = async () => {
    if (!validator || !scwallet || !delegation) return;
    const { rewards } = await queryClient.distribution.delegationRewards(scwallet, validator.operatorAddress);
    setRewards(rewards[0]);
  };

  const claimRewards = async () => {
    if (!validator || !scwallet) return;
    try {
      await toast
        .promise(executeClaimDelegationReward(signingClient, address, scwallet, validator.operatorAddress), {
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

  useEffect(() => {
    if (!scwallet || !validator) return;
    queryClient.staking
      .delegation(scwallet, validator.operatorAddress)
      .then(({ delegationResponse }) => setDelegation(delegationResponse!))
      .catch(console.log);
  }, [scwallet, validator, modalsVisibility]);

  useEffect(() => {
    fetchRewards();
  }, [delegation]);

  if (!validator || !validator.description) return null;
  return (
    <Modal id={`validator-modal-${validator.description.moniker}`} onClose={onClose}>
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
        {rewards && areRewardsAvailable && (
          <div className="flex items-center justify-between pb-4">
            <p className="font-bold">
              Rewards: {<TokenAmount token={{ denom: rewards.denom, amount: fromValidationRate(rewards.amount) }} fixedLength={4} />}
            </p>
            <button className="btn" data-testid="validator-modal-claim" onClick={claimRewards}>
              claim
            </button>
          </div>
        )}
        {delegation?.balance && (
          <div className="flex items-center justify-between pb-4">
            <p className="font-bold">Delegation:</p>
            <p>
              <TokenAmount token={delegation.balance} />
            </p>
          </div>
        )}

        <div className="flex items-center">
          {scwallet && <ValidatorButton openModal={openModal} validator={validator} delegation={delegation} />}
        </div>
        {modalsVisibility.delegate && scwallet && <DelegateModal scwallet={scwallet} validator={validator} onClose={closeModal} />}
        {delegation && scwallet && (
          <>
            {modalsVisibility.redelegate && (
              <RedelegateModal scwallet={scwallet} validator={validator} validators={validators} delegation={delegation} onClose={closeModal} />
            )}
            {modalsVisibility.undelegate && (
              <UndelegateModal scwallet={scwallet} validator={validator} delegation={delegation} onClose={closeModal} />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ValidatorModal;
