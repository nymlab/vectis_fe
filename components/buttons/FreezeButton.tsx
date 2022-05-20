import { useSigningClient } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useState } from "react";
import {
  executeProxyWalletMSProposal,
  proposeToggleProxyWalletFreezeStatus,
  toggleProxyWalletFreezeStatus,
} from "services/vectis";
import Loader from "../Loader";

type FreezeButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  onStart?: () => void;
  onSuccess?: (msg: string) => void;
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

  // This function should be called only if the proxy wallet is NOT multisig
  // Otherwise it will error out
  function toggleFreezeStatus() {
    onStart?.();
    setLoading(true);
    toggleProxyWalletFreezeStatus(signingClient!, walletAddress, proxyWalletAddress)
      .then(() =>
        onSuccess?.(`${proxyWalletInfo?.is_frozen ? "Unfreeze" : "Freeze"} operation was executed correctly!`)
      )
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false));
  }

  // This function should be called only if the proxy wallet IS multisig
  function proposeToggleFreezeStatus() {
    if (!proxyWalletInfo.multisig_address) {
      console.warn("Tried to call proposeToggleFreezeStatus on a non-multisig wallet.");
      return;
    }

    onStart?.();
    setLoading(true);
    proposeToggleProxyWalletFreezeStatus(signingClient!, walletAddress, proxyWalletInfo.multisig_address!)
      //executeProxyWalletMSProposal(signingClient!, walletAddress, proxyWalletInfo.multisig_address!, 1)
      .then(() =>
        onSuccess?.(`${proxyWalletInfo?.is_frozen ? "Unfreeze" : "Freeze"} operation was proposed correctly!`)
      )
      .catch((err) => {
        console.error(err);
        onError?.(err);
      })
      .finally(() => setLoading(false));
  }

  if (loading) {
    return <Loader />;
  }

  if (proxyWalletInfo.multisig_address) {
    return (
      <button
        className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
        onClick={proposeToggleFreezeStatus}
      >
        PROPOSE FREEZE
      </button>
    );
  }

  return (
    <button
      className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
      onClick={toggleFreezeStatus}
    >
      {proxyWalletInfo.is_frozen ? "UNFREEZE" : "FREEZE"}
    </button>
  );
}
