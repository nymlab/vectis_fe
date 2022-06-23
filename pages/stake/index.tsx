import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCosm } from "contexts/cosmwasm";
import { useStaking } from "stores";
import { IntlNumber } from "utils/intl";
import type { NextPage } from "next";
import ValidatorCard from "components/ValidatorCard";
import ValidatorTable from "components/ValidatorTable";
import DelegationTable from "components/DelegationTable";
import { FaCoins, FaUsers, FaBoxes } from "react-icons/fa";
import { convertMicroDenomToDenom } from "utils/conversion";

const Validators: NextPage = () => {
  const { query, push: goToPage, isReady } = useRouter();
  const { queryClient, tmClient } = useCosm();
  const { delegations, validators, updateDelegations, updateValidators, updateScwalletAddr } = useStaking();
  const [numberOfValidators, setNumberOfValidators] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const { address } = query;

  const bondedTokens = useMemo(() => validators.reduce((acc, validator) => acc + convertMicroDenomToDenom(validator.tokens), 0), [validators]);

  useEffect(() => {
    if (isReady && !address) goToPage("/wallets");
  }, [isReady]);

  useEffect(() => {
    if (!queryClient?.staking || !tmClient || !address) return;
    const getValidators = async () => {
      const { validators } = await queryClient.staking.validators("BOND_STATUS_BONDED");
      const { delegationResponses } = await queryClient.staking.delegatorDelegations(address as string);
      const { block } = await tmClient.block();
      setNumberOfValidators(validators.length);
      setBlockHeight(block.header.height);
      updateScwalletAddr(address as string);
      updateValidators(validators);
      updateDelegations(delegationResponses);
    };
    getValidators();
  }, [queryClient, tmClient]);

  if (!address) return null;

  return (
    <>
      <Head>
        <title>Vectis | Validators</title>
      </Head>
      <div className="flex flex-grow flex-col w-full px-16 py-4">
        <section id="validator-cards" className="w-full grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-20 gap-y-5 pb-5">
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
        {delegations && delegations.length > 0 && (
          <>
            <div className="card pl-4 rounded-xl bg-base-200 p-2 mb-2 text-xl">
              <p className="font-bold">Delegations</p>
            </div>
            <DelegationTable />
            <div className="divider" />
          </>
        )}
        <div className="card pl-4 rounded-xl bg-base-200 p-2 mb-2 text-xl">
          <p className="font-bold">Validators</p>
        </div>
        <ValidatorTable />
      </div>
    </>
  );
};

export default Validators;
