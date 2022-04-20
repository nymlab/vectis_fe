import { useEffect, useState } from "react";
import { useSigningClient } from "contexts/cosmwasm";
import { convertFromMicroDenom, convertMicroDenomToDenom } from "util/conversion";
import { env } from "env";

export const useBalance = () => {
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const { walletAddress, signingClient } = useSigningClient();

  function fetchBalance() {
    signingClient
      ?.getBalance(walletAddress, env.stakingDenom)
      .then((response: any) => {
        const { amount, denom }: { amount: number; denom: string } = response;
        setBalance(`${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`);
      })
      .catch((error) => {
        setError(`Error! ${error.message}`);
        console.error("Error signingClient.getBalance(): ", error);
      });
  }

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return;
    }
    setError("");

    fetchBalance();
  }, [signingClient, walletAddress]);

  return {
    balance,
    refreshBalance: fetchBalance,
    error
  }
}
