import { IVectisContext } from "contexts/vectis";
import { useEffect, useState } from "react";
import { queryVectisWalletInfo, queryVectisWalletsOfUser, WalletInfo } from "services/vectis";

export const useVectisClient = (walletAddress: string): IVectisContext => {
  const [proxyWallets, setProxyWallets] = useState<string[]>([]);

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    setLoading(true);
    setError(null);

    queryVectisWalletsOfUser(walletAddress)
      .then((wallets) => setProxyWallets(wallets))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  async function fetchWalletsInfo(addresses: string[]): Promise<{ [key: string]: WalletInfo }> {
    const infos = await Promise.all(
      addresses.map(async (address) => ({
        address,
        info: await queryVectisWalletInfo(address),
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
