import { useState, useEffect } from "react";
import type { NextPage } from "next";
import {
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from "util/conversion";
import { useSigningClient } from "contexts/cosmwasm";

import WalletLoader from "components/WalletLoader";
import SCWCreateForm from "components/SCWCreateForm";
import { env } from "env";

const SCW: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return;
    }
    setError("");

    signingClient
      .getBalance(walletAddress, env.stakingDenom)
      .then((response: any) => {
        const { amount, denom }: { amount: number; denom: string } = response;
        setBalance(
          `${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`
        );
      })
      .catch((error) => {
        setError(`Error! ${error.message}`);
        console.error("Error signingClient.getBalance(): ", error);
      });
  }, [signingClient, walletAddress]);

  return (
    <WalletLoader>
      <p className="text-2xl">Your personal wallet has {balance}</p>

      <SCWCreateForm />
    </WalletLoader>
  );
};

export default SCW;
