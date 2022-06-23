import React from "react";
import { useStaking } from "stores";
import DelegationRow from "./DelegationRow";

const DelegationTable: React.FC = () => {
  const { delegations } = useStaking();

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
          {delegations.map((delegationResponse) => (
            <DelegationRow key={delegationResponse.delegation?.validatorAddress} delegationResponse={delegationResponse} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DelegationTable;
