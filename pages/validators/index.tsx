import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useCosm } from "contexts/cosmwasm";
import ValidatorCard from "components/ValidatorCard";
import ValidatorTable from "components/ValidatorTable";
import DelegationTable from "components/DelegationTable";
import { FaCoins, FaUsers, FaBoxes } from "react-icons/fa";
import { IntlNumber } from "utils/intl";
import { convertMicroDenomToDenom } from "utils/conversion";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { useRouter } from "next/router";

const Validators: NextPage = () => {
  const { query } = useRouter();
  const { queryClient, tmClient } = useCosm();
  const [validators, setValidators] = useState<Validator[] | null>(null);
  const [numberOfValidators, setNumberOfValidators] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const { address: scwalletAddr } = query;

  const sortedValidators = useMemo(() => validators?.sort((a, b) => Number(b.tokens) - Number(a.tokens)), [validators]);
  const bondedTokens = useMemo(() => validators?.reduce((acc, validator) => acc + convertMicroDenomToDenom(validator.tokens), 0), [validators]);

  useEffect(() => {
    if (!queryClient || !tmClient) return;
    const getValidators = async () => {
      const { validators } = await queryClient.staking.validators("BOND_STATUS_BONDED");
      const { block } = await tmClient.block();
      setNumberOfValidators(validators.length);
      setBlockHeight(block.header.height);
      setValidators(validators);
    };
    getValidators();
  }, [queryClient, tmClient]);

  return (
    <>
      <Head>
        <title>Vectis | Validators</title>
      </Head>
      <div className="flex flex-grow flex-col w-full px-16 py-4">
        <section id="validator-cards" className="grid grid-cols-3 gap-2 pb-5">
          <ValidatorCard title="Height" Icon={<FaBoxes size={28} />}>
            {blockHeight}
          </ValidatorCard>
          <ValidatorCard title="Validators" Icon={<FaUsers size={28} />}>
            {numberOfValidators}
          </ValidatorCard>
          <ValidatorCard title="Bonded Tokens" Icon={<FaCoins size={24} />}>
            {bondedTokens && IntlNumber(bondedTokens)}
          </ValidatorCard>
        </section>
        <div className="card pl-4 rounded-xl bg-base-200 p-2 mb-2 text-xl">
          <p className="font-bold">Delegations</p>
        </div>
        {scwalletAddr && <DelegationTable validators={sortedValidators} scwalletAddr={scwalletAddr as string} />}
        <div className="divider" />
        <div className="card pl-4 rounded-xl bg-base-200 p-2 mb-2 text-xl">
          <p className="font-bold">Validators</p>
        </div>
        <ValidatorTable validators={sortedValidators} showManageButtons={!!scwalletAddr} />
      </div>
    </>
  );
};

export default Validators;
