import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useCosmWasmClient } from "contexts/cosmwasm";
import ValidatorCard from "components/ValidatorCard";
import ValidatorTable from "components/ValidatorTable";
import { FaCoins, FaUsers, FaBoxes } from "react-icons/fa";
import { IntlNumber } from "utils/intl";
import { convertMicroDenomToDenom } from "utils/conversion";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";

const Validators: NextPage = () => {
  const [validators, setValidators] = useState<Validator[] | null>(null);
  const [numberOfValidators, setNumberOfValidators] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const { queryClient, tmClient } = useCosmWasmClient();

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
      <div className="flex flex-grow flex-col min-h-full w-full px-16">
        <h1 className="text-4xl p-4">Validators</h1>
        <section id="validator-cards" className="grid grid-cols-3 gap-2 pb-8">
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
        <ValidatorTable validators={sortedValidators} />
      </div>
    </>
  );
};

export default Validators;
