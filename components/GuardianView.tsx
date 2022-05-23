import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import { useSigningClient } from "contexts/cosmwasm";
import { Proposal, WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { queryProxyWalletInfo, queryProxyWalletMSProposals } from "services/vectis";
import FreezeButton from "./buttons/FreezeButton";
import RotateKeyButton from "./buttons/RotateKeyButton";
import Loader from "./Loader";
import TokenAmount from "./TokenAmount";

export default function GuardianView() {
  const { signingClient, walletAddress } = useSigningClient();

  const [proxyWalletAddress, setProxyWalletAddress] = useState("");
  const [fetchingSCW, setFetchingSCW] = useState(false);
  const [error, setError] = useState<any>(null);

  const [walletInfo, setWalletInfo] = useState<WalletInfoWithBalance | null>(null);
  const [walletActiveProposals, setWalletActiveProposals] = useState<Proposal[]>([]);
  const [success, setSuccess] = useState("");
  const [operationError, setOperationError] = useState<Error | null>(null);

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
    navigator.clipboard?.writeText(address);
  }

  function walletHasFreezeProposal() {
    return walletActiveProposals.find((p) => p.title.toLowerCase().includes("freeze"));
  }
  function walletHasKeyRotationProposal() {
    return walletActiveProposals.find((p) => p.title.toLowerCase().includes("key"));
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
        if (info.multisig_address) {
          queryProxyWalletMSProposals(signingClient!, info.multisig_address)
            .then((props) => setWalletActiveProposals(props))
            .catch(console.error);
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
    setSuccess("");
    setOperationError(null);
  }
  async function onFreezeSuccess(msg: string) {
    await fetchSCW();
    setSuccess(msg);
  }
  function onFreezeError(error: Error) {
    setOperationError(error);
  }

  function onKeyRotation() {
    fetchSCW();
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
          <div className="flex flex-col items-start text-xl mb-3">
            <p>
              Owner:{" "}
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
            {walletHasFreezeProposal() && <p>Proposal to freeze wallet is active</p>}
            {walletHasKeyRotationProposal() && <p>Proposal to rotate owner key is active</p>}
          </div>

          <FreezeButton
            proxyWalletAddress={proxyWalletAddress}
            proxyWalletInfo={walletInfo}
            onStart={onFreezeStart}
            onSuccess={onFreezeSuccess}
            onError={onFreezeError}
          />
          <RotateKeyButton
            proxyWalletAddress={proxyWalletAddress}
            proxyWalletInfo={walletInfo}
            onKeyRotation={onKeyRotation}
          />

          {success && (
            <div className="mt-5">
              <AlertSuccess>{success}</AlertSuccess>
            </div>
          )}

          {operationError && (
            <div className="mt-5">
              <AlertError>Error! {operationError.message}</AlertError>
            </div>
          )}
        </div>
      )}
    </>
  );
}
