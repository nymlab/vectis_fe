import React from "react";
import { IntlNumber } from "utils/intl";
import { comissionRateToHuman, convertMicroDenomToDenom } from "utils/conversion";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";

interface Props {
  validators?: Validator[];
}

const ValidatorTable: React.FC<Props> = ({ validators }) => {
  if (!validators) return null;

  return (
    <table className="table table-zebra w-full h-full ">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Validator</th>
          <th>Voting Power</th>
          <th>Comission</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {validators?.map((validator, index) => {
          return (
            <tr key={`validator-${index}`}>
              <th>{index + 1}</th>
              <td>{validator.description?.moniker}</td>
              <td>{IntlNumber(convertMicroDenomToDenom(validator.tokens))} Juno</td>
              <td>{comissionRateToHuman(validator.commission?.commissionRates?.rate!)} %</td>
              <td>Manage</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ValidatorTable;
