import { fromValidationRate } from "utils/conversion";
import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import ValidatorModal from "./modals/ValidatorModal";
import { useCosm } from "contexts/cosmwasm";
import React, { useCallback, useEffect, useState } from "react";
import TokenAmount from "./TokenAmount";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { QueryClientWithExtentions } from "services/stargate";

interface Props {
  validators?: Validator[];
  scwalletAddr: string;
}

const DelegationTable: React.FC<Props> = ({ scwalletAddr, validators }) => {
  const { queryClient } = useCosm();
  const [delegations, setDelegations] = useState<DelegationResponse[] | null>(null);
  const [validator, setValidator] = useState<Validator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeVisibility = useCallback(() => setIsModalOpen(!isModalOpen), [isModalOpen]);
  const openModal = useCallback((validator: Validator) => [setValidator(validator), setIsModalOpen(true)], []);

  useEffect(() => {
    if (!queryClient) return;
    queryClient.staking.delegatorDelegations(scwalletAddr).then(({ delegationResponses }) => setDelegations(delegationResponses));
  }, [queryClient]);

  if (!scwalletAddr) return null;

  return (
    <>
      <table id="validator-list" className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount Staked</th>
            <th>Pending Rewards</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {delegations?.map((delegationResponse, index) => (
            <DelegationTr
              key={index}
              queryClient={queryClient}
              delegationResponse={delegationResponse}
              scwalletAddr={scwalletAddr}
              openModal={openModal}
            />
          ))}
        </tbody>
      </table>
      {isModalOpen && validators && <ValidatorModal validators={validators} validator={validator} onClose={changeVisibility} />}
    </>
  );
};

const DelegationTr: React.FC<{
  queryClient: QueryClientWithExtentions;
  delegationResponse: DelegationResponse;
  scwalletAddr: string;
  openModal: any;
}> = ({ queryClient, scwalletAddr, delegationResponse, openModal }) => {
  const { delegation, balance } = delegationResponse;
  const [rewards, setRewards] = useState<Coin | null>(null);
  const [validator, setValidator] = useState<Validator | null>(null);

  useEffect(() => {
    if (!delegation) return;
    queryClient.distribution.delegationRewards(scwalletAddr, delegation.validatorAddress).then(({ rewards }) => setRewards(rewards[0]));
    queryClient.staking.validator(delegation.validatorAddress).then(({ validator }) => setValidator(validator!));
  }, []);

  if (!validator || !rewards || !delegation) return null;

  return (
    <tr key={`validator-${delegation.validatorAddress}`}>
      <td>{validator?.description?.moniker || "Unknown Name"}</td>
      <td>{balance && <TokenAmount token={balance} fixedLength={2} />}</td>
      <td>
        <TokenAmount token={{ denom: rewards.denom, amount: fromValidationRate(rewards.amount) }} fixedLength={4} />
      </td>
      <td>
        <label
          className="cursor-pointer rounded dark:text-white bg-gray-100 hover:bg-gray-200 p-2.5 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={() => openModal(validator)}
          htmlFor={`validator-modal-${validator?.description?.moniker}`}
        >
          Manage
        </label>
      </td>
    </tr>
  );
};

export default DelegationTable;
