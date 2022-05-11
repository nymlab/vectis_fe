import { useSigningClient } from "contexts/cosmwasm";
import { IVectisContext, WalletInfoWithBalance } from "contexts/vectis";
import { useEffect, useState } from "react";
import { queryVectisWalletInfo, queryVectisWalletsOfUser } from "services/vectis";

export const useVectisClient = (walletAddress: string): IVectisContext => {
  const { walletAddress: userAddress, signingClient } = useSigningClient();
  const [proxyWallets, setProxyWallets] = useState<string[]>([]);

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    setLoading(true);
    setError(null);

    queryVectisWalletsOfUser(signingClient!, walletAddress)
      .then((wallets) => setProxyWallets(wallets))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  async function fetchWalletsInfo(addresses: string[]): Promise<{ [key: string]: WalletInfoWithBalance }> {
    const infos = await Promise.all(
      addresses.map(async (address) => ({
        address,
        info: await queryVectisWalletInfo(signingClient!, userAddress, address),
      }))
    );
    return infos.reduce((acc, cur) => ({ ...acc, [cur.address]: cur.info }), {});
  }

  return {
    proxyWallets,
    loading,
    error,
    fetchWalletsInfo,
  };
};
