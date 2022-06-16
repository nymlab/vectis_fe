import React, { useCallback, useState } from "react";
import { IntlNumber } from "utils/intl";
import { comissionRateToHuman, convertMicroDenomToDenom } from "utils/conversion";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import ValidatorModal from "./modals/ValidatorModal";

interface Props {
  validators?: Validator[];
}

const ValidatorTable: React.FC<Props> = ({ validators }) => {
  const [validator, setValidator] = useState<Validator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeVisibility = useCallback(() => setIsModalOpen(!isModalOpen), [isModalOpen]);

  if (!validators) return null;

  return (
    <div className="overflow-visible">
      <table id="validator-list" className="table table-zebra w-full">
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
                <td>
                  <label
                    className="cursor-pointer rounded dark:text-white bg-gray-100 hover:bg-gray-200 p-2.5 dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={() => [setValidator(validator), changeVisibility()]}
                    htmlFor={`validator-modal-${validator.description?.moniker}`}
                  >
                    Manage
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isModalOpen && <ValidatorModal validators={validators} validator={validator} onClose={changeVisibility} />}
    </div>
  );
};

export default ValidatorTable;
