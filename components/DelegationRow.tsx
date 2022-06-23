import React, { useEffect, useState } from "react";
import { useCosm } from "contexts/cosmwasm";
import { useModal, useStaking } from "stores";
import { Coin } from "@cosmjs/amino";
import { fromRewardsRate } from "utils/conversion";
import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import TokenAmount from "./TokenAmount";
import ValidatorModal from "./modals/ValidatorModal";

interface Props {
  delegationResponse: DelegationResponse;
}

const DelegationRow: React.FC<Props> = ({ delegationResponse }) => {
  const { scwalletAddr, updateValidator } = useStaking();
  const { queryClient } = useCosm();
  const { openModal } = useModal();
  const { delegation, balance } = delegationResponse;
  const [rewards, setRewards] = useState<Coin | null>(null);
  const [validator, setValidator] = useState<Validator | null>();

  useEffect(() => {
    if (!delegation) return;
    queryClient.distribution.delegationRewards(scwalletAddr, delegation.validatorAddress).then(({ rewards }) => setRewards(rewards[0]));
    queryClient.staking.validator(delegation.validatorAddress).then(({ validator }) => setValidator(validator!));
  }, []);

  if (!validator || !delegation) return null;

  return (
    <tr key={`validator-${delegation.validatorAddress}`}>
      <td>{validator?.description?.moniker || "Unknown Name"}</td>
      <td>{balance && <TokenAmount token={balance} fixedLength={2} />}</td>
      <td>{rewards && <TokenAmount token={{ denom: rewards.denom, amount: fromRewardsRate(rewards.amount) }} fixedLength={4} />}</td>
      <td>
        <label
          className="cursor-pointer rounded dark:text-white bg-gray-100 hover:bg-gray-200 p-2.5 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={() => [updateValidator(validator), openModal(<ValidatorModal />)]}
          htmlFor={`validator-modal-${validator?.description?.moniker}`}
        >
          Manage
        </label>
      </td>
    </tr>
  );
};

export default DelegationRow;
