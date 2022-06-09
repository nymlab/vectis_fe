import type { NextPage } from "next";
import Head from "next/head";
import { useCosmWasmClient } from "contexts/cosmwasm";
import { useEffect, useState } from "react";
import { Validator } from "@cosmjs/tendermint-rpc";

const Validators: NextPage = () => {
  const [validators, setValidators] = useState<Validator[] | null>(null);
  const { queryClient } = useCosmWasmClient();

  useEffect(() => {
    if (!queryClient) return;
    const getValidators = async () => {
      const { validators } = await queryClient.staking.validators("BOND_STATUS_BONDED");
      setValidators(validators as unknown as Validator[]);
    };
    getValidators();
  }, [queryClient]);

  return (
    <>
      <Head>
        <title>Vectis | Validators</title>
      </Head>
    </>
  );
};

export default Validators;
