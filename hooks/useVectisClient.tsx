import { IVectisContext } from "contexts/vectis";
import { useEffect, useState } from "react";
import { queryVectisWalletsOfUser } from "services/vectis";

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

  return {
    proxyWallets,
    loading,
    error,
  };
};
