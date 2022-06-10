import { useEffect, useState } from "react";
import { useCosm } from "contexts/cosmwasm";
import { convertFromMicroDenom, convertMicroDenomToDenom } from "utils/conversion";

export const useBalance = () => {
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const { address, signingClient, network } = useCosm();

  const getBalance = async () => {
    if (!address) return;
    setError("");
    try {
      const { amount, denom } = await signingClient.getBalance(address, network.feeToken);
      setBalance(`${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`);
    } catch (error) {
      setError(`Error! ${(error as Error).message}`);
      console.error("Error signingClient.getBalance(): ", error);
    }
  };

  useEffect(() => {
    getBalance();
  }, [address]);

  return {
    balance,
    refreshBalance: getBalance,
    error,
  };
};
