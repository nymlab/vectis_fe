import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import { useSigningClient } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { queryProxyWalletInfo, toggleProxyWalletFreezeStatus } from "services/vectis";
import Loader from "./Loader";
import TokenAmount from "./TokenAmount";

type FreezeButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

function FreezeButton({ proxyWalletAddress, proxyWalletInfo, onStart, onSuccess, onError }: FreezeButtonProps) {
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

export default function GuardianView() {
  const { signingClient, walletAddress } = useSigningClient();

  const [proxyWalletAddress, setProxyWalletAddress] = useState("");
  const [fetchingSCW, setFetchingSCW] = useState(false);
  const [error, setError] = useState<any>(null);

  const [walletInfo, setWalletInfo] = useState<WalletInfoWithBalance | null>(null);
  const [freezeSuccess, setFreezeSuccess] = useState("");
  const [freezeError, setFreezeError] = useState<Error | null>(null);

  const { getValueValidationError, checkValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "walletAddress",
        value: proxyWalletAddress,
        message: "This field is mandatory",
        validate: () => !!proxyWalletAddress,
      },
    ],
  });

  function copyAddress(address: string) {
    navigator.clipboard.writeText(address);
  }

  function fetchSCW() {
    if (!checkValidationErrors()) {
      return;
    }

    setFetchingSCW(true);
    return queryProxyWalletInfo(signingClient!, walletAddress, proxyWalletAddress)
      .then((info) => {
        if (!info.guardians.includes(walletAddress)) {
          setError(new Error("You are not a guardian of this Smart Contract Wallet."));
          return;
        }

        setWalletInfo(info);
      })
      .catch((err) => {
        setError(err);
        setWalletInfo(null);
      })
      .finally(() => setFetchingSCW(false));
  }

  function onFreezeStart() {
    setFreezeSuccess("");
    setFreezeError(null);
  }
  async function onFreezeSuccess() {
    await fetchSCW();
    setFreezeSuccess(`${walletInfo?.is_frozen ? "Unfreeze" : "Freeze"} operation was executed correctly!`);
  }
  function onFreezeError(error: Error) {
    setFreezeError(error);
  }

  if (fetchingSCW) {
    return <Loader>Fetching Smart Contract Wallet...</Loader>;
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchSCW();
        }}
      >
        <p className="text-2xl my-8">Insert the Smart Contract Wallet address for which you are a guardian of</p>
        <Input
          placeholder="Smart Contract Wallet address"
          onChange={(event) => setProxyWalletAddress(event.target.value)}
          error={getValueValidationError("walletAddress")}
          value={proxyWalletAddress}
        />
        <button
          className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl rounded-full flex-grow my-5"
          type="submit"
        >
          SEARCH
        </button>
      </form>

      {error && (
        <div className="my-5">
          <AlertError>{error.message}</AlertError>
        </div>
      )}

      {walletInfo && (
        <div className="border-2 rounded-lg p-5">
          <h1 className="text-3xl font-bold mb-5">Smart Contract Wallet</h1>
          <div className="flex flex-col items-start text-xl">
            <p>
              Owner Address:{" "}
              <a
                className="hover:text-primary hover:underline hover:cursor-pointer transition-colors tooltip"
                data-tip="Copy wallet address"
                onClick={() => copyAddress(walletInfo.user_addr)}
              >
                {walletInfo.user_addr}
              </a>
            </p>
            <p>Status: {walletInfo.is_frozen ? "Frozen" : "Not Frozen"}</p>
            <p>MultiSig Enabled: {walletInfo.multisig_address ? "Yes" : "No"}</p>
            <p>
              Balance: <TokenAmount token={walletInfo.balance} />
            </p>
          </div>

          <FreezeButton
            proxyWalletAddress={proxyWalletAddress}
            proxyWalletInfo={walletInfo}
            onStart={onFreezeStart}
            onSuccess={onFreezeSuccess}
            onError={onFreezeError}
          />

          {freezeSuccess && (
            <div className="mt-5">
              <AlertSuccess>{freezeSuccess}</AlertSuccess>
            </div>
          )}

          {freezeError && (
            <div className="mt-5">
              <AlertError>Error! {freezeError.message}</AlertError>
            </div>
          )}
        </div>
      )}
    </>
  );
}
