import React, { useMemo } from "react";
import { useStaking, useModal } from "stores";
import { IntlNumber } from "utils/intl";
import { convertMicroDenomToDenom, fromValidationRate } from "utils/conversion";
import ValidatorModal from "./modals/ValidatorModal";

const ValidatorTable: React.FC = () => {
  const { openModal } = useModal();
  const { validators, updateValidator } = useStaking();

  const sortedValidators = useMemo(() => validators.sort((a, b) => Number(b.tokens) - Number(a.tokens)), [validators]);

  return (
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
        {sortedValidators?.map((validator, index) => {
          return (
            <tr key={`validator-${index}`}>
              <th>{index + 1}</th>
              <td>{validator.description?.moniker}</td>
              <td>{IntlNumber(convertMicroDenomToDenom(validator.tokens))} Juno</td>
              <td>{fromValidationRate(validator.commission?.commissionRates?.rate!)} %</td>
              <td>
                <label
                  className="cursor-pointer rounded dark:text-white bg-gray-100 hover:bg-gray-200 p-2.5 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => [updateValidator(validator), openModal(<ValidatorModal />)]}
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
  );
};

export default ValidatorTable;
