import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import { useSigningClient } from "contexts/cosmwasm";
import { Proposal, WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { queryProxyWalletInfo, queryProposals } from "services/vectis";
import FreezeButton from "./buttons/FreezeButton";
import RotateKeyButton from "./buttons/RotateKeyButton";
import Loader from "./Loader";
import ProposalDetailsModal from "./modals/ProposalDetailsModal";
import TokenAmount from "./TokenAmount";

export default function GuardianView() {
  const { signingClient, walletAddress } = useSigningClient();

  const [proxyWalletAddress, setProxyWalletAddress] = useState("");
  const [fetchingSCW, setFetchingSCW] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [walletInfo, setWalletInfo] = useState<WalletInfoWithBalance | null>(null);
  const [walletActiveProposals, setWalletActiveProposals] = useState<Proposal[]>([]);
  const [success, setSuccess] = useState("");
  const [operationError, setOperationError] = useState<Error | null>(null);

  const [showProposalDetailsModal, setShowProposalDetailsModal] = useState<Record<number, boolean>>({});

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

  function getWalletFreezeProposal() {
    return walletActiveProposals.find((p) => p.title.toLowerCase().includes("freeze"));
  }
  function getWalletKeyRotationProposal() {
    return walletActiveProposals.find((p) => p.title.toLowerCase().includes("key"));
  }

  function fetchSCW() {
    if (!checkValidationErrors()) {
      return;
    }

    setError(null);
    setFetchingSCW(true);
    return queryProxyWalletInfo(signingClient!, walletAddress, proxyWalletAddress)
      .then((info) => {
        if (!info.guardians.includes(walletAddress)) {
          setError(new Error("You are not a guardian of this Smart Contract Wallet."));
          return;
        }
        if (info.multisig_address) {
          queryProposals(signingClient!, info.multisig_address!)
            .then((props) => setWalletActiveProposals(props.filter((p) => p.status !== "executed")))
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

  function toggleProposalDetailsModal(proposal: Proposal) {
    setShowProposalDetailsModal({
      ...showProposalDetailsModal,
      [proposal.id]: !showProposalDetailsModal[proposal.id],
    });
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
    setSuccess("Key rotation performed successfully!");
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
            {getWalletFreezeProposal() && (
              <label
                htmlFor={`proposal-details-modal-${getWalletFreezeProposal()!.id}`}
                className="link link-hover hover:text-primary transition-colors tooltip"
                data-tip="Show proposal details"
                onClick={() => toggleProposalDetailsModal(getWalletFreezeProposal()!)}
              >
                Proposal to {walletInfo.is_frozen ? "unfreeze" : "freeze"} wallet{" "}
                {getWalletFreezeProposal()?.status === "passed" ? "has passed" : "is active"}
              </label>
            )}
            {getWalletKeyRotationProposal() && (
              <label
                htmlFor={`proposal-details-modal-${getWalletKeyRotationProposal()!.id}`}
                className="link link-hover hover:text-primary transition-colors tooltip"
                data-tip="Show proposal details"
                onClick={() => toggleProposalDetailsModal(getWalletKeyRotationProposal()!)}
              >
                Proposal to rotate owner key{" "}
                {getWalletKeyRotationProposal()?.status === "passed" ? "has passed" : "is active"}
              </label>
            )}
          </div>

          <FreezeButton
            proxyWalletAddress={proxyWalletAddress}
            proxyWalletInfo={walletInfo}
            freezeProposal={getWalletFreezeProposal()}
            onStart={onFreezeStart}
            onSuccess={onFreezeSuccess}
            onError={onFreezeError}
          />
          <RotateKeyButton
            proxyWalletAddress={proxyWalletAddress}
            proxyWalletInfo={walletInfo}
            keyRotationProposal={getWalletKeyRotationProposal()}
            onKeyRotation={onKeyRotation}
            onKeyRotationProposal={fetchSCW}
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

      {Object.entries(showProposalDetailsModal).map(([id, show]) => {
        const proposal = walletActiveProposals.find((prop) => prop.id === +id)!;
        return (
          show && (
            <ProposalDetailsModal
              key={id}
              multisigAddress={walletInfo?.multisig_address!}
              proposal={proposal}
              onExecute={fetchSCW}
              onClose={() => toggleProposalDetailsModal(proposal)}
            />
          )
        );
      })}
    </>
  );
}
