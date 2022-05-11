import { useState } from "react";
import { connectKeplr } from "services/keplr";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { env } from "env";
import { ISigningCosmWasmClientContext } from "contexts/cosmwasm";
import { GasPrice } from "@cosmjs/stargate";

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const connectWallet = async () => {
    setLoading(true);

    try {
      await connectKeplr();

      // Enable website to access Keplr
      await (window as any).keplr.enable(env.chainId);

      // Get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSigner(env.chainId);

      // Make client
      const client = await SigningCosmWasmClient.connectWithSigner(env.chainRpcEndpoint, offlineSigner, {
        gasPrice: GasPrice.fromString(env.gasPrice + env.stakingDenom),
      });
      setSigningClient(client);

      // Get user address
      const [{ address }] = await offlineSigner.getAccounts();
      setWalletAddress(address);

      localStorage.setItem("walletAddress", address);
      setLoading(false);
      return address;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect();
    }

    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    setSigningClient(null);
    setLoading(false);
  };

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
  };
};
