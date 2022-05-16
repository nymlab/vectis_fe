import { useSigningClient } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useState } from "react";
import { toggleProxyWalletFreezeStatus } from "services/vectis";
import Loader from "./Loader";

type FreezeButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export default function FreezeButton({
  proxyWalletAddress,
  proxyWalletInfo,
  onStart,
  onSuccess,
  onError,
}: FreezeButtonProps) {
  const { signingClient, walletAddress } = useSigningClient();

  const [loading, setLoading] = useState(false);

  function toggleFreezeStatus() {
    // This function should be called only if the proxy wallet is NOT multisig
    // Otherwise it will error out
    onStart?.();
    setLoading(true);
    toggleProxyWalletFreezeStatus(signingClient!, walletAddress, proxyWalletAddress)
      .then(() => onSuccess?.())
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return <Loader />;
  }

  if (proxyWalletInfo.multisig_address) {
    return (
      <button className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow">
        REQUEST FREEZE
      </button>
    );
  }

  return (
    <button
      className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow"
      onClick={toggleFreezeStatus}
    >
      {proxyWalletInfo.is_frozen ? "UNFREEZE" : "FREEZE"}
    </button>
  );
}
