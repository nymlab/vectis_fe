import Modal from "components/Modal";
import VoteModal from "components/modals/VoteModal";
import ProposalDetails from "components/ProposalDetails";
import { useCosm } from "contexts/cosmwasm";
import { Proposal, WalletInfoWithBalance } from "contexts/vectis";
import { useEffect, useState } from "react";
import {
  executeProposal,
  proposeProxyWalletOperation,
  queryProposalVoteList,
  SCWOperation,
  toggleProxyWalletFreezeStatus,
} from "services/vectis";
import Loader from "../Loader";

type FreezeButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  freezeProposal?: Proposal;
  onStart?: () => void;
  onSuccess?: (msg: string) => void;
  onError?: (err: Error) => void;
  onVote?: () => void;
};

export default function FreezeButton({
  proxyWalletAddress,
  proxyWalletInfo,
  freezeProposal,
  onStart,
  onSuccess,
  onError,
  onVote,
}: FreezeButtonProps) {
  const { signingClient, address: userAddress } = useCosm();
  const [loading, setLoading] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  useEffect(() => {
    if (!freezeProposal) {
      return;
    }

    fetchVoteList();
  }, [freezeProposal]);

  function fetchVoteList() {
    setAlreadyVoted(false);
    queryProposalVoteList(signingClient!, proxyWalletInfo.multisig_address!, freezeProposal!.id)
      .then((votes) => setAlreadyVoted(!!votes.find((v) => v.voter === userAddress)))
      .catch(console.error);
  }

  // This function should be called only if the proxy wallet is NOT multisig
  // Otherwise it will error out
  function toggleFreezeStatus() {
    onStart?.();
    setLoading(true);
    toggleProxyWalletFreezeStatus(signingClient!, userAddress, proxyWalletAddress)
      .then(() => onSuccess?.(`${proxyWalletInfo?.is_frozen ? "Unfreeze" : "Freeze"} operation was executed correctly!`))
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
    proposeProxyWalletOperation(
      signingClient!,
      userAddress,
      proxyWalletAddress,
      proxyWalletInfo.multisig_address!,
      SCWOperation.ToggleFreeze,
      undefined,
      proxyWalletInfo?.is_frozen
    )
      .then(() => onSuccess?.(`${proxyWalletInfo?.is_frozen ? "Unfreeze" : "Freeze"} operation was proposed successfully!`))
      .catch((err) => {
        console.error(err);
        onError?.(err);
      })
      .finally(() => setLoading(false));
  }

  // This function should be called only if the proxy wallet IS multisig
  function openVoteModal() {
    if (alreadyVoted) {
      return;
    }

    setVoteModalOpen(true);
  }

  if (loading) {
    return <Loader />;
  }

  if (proxyWalletInfo.multisig_address) {
    return (
      <>
        <label
          htmlFor={freezeProposal ? `vote-modal-${freezeProposal.id}` : ""}
          className={`btn btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2 ${
            alreadyVoted || freezeProposal?.status === "passed" ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => (!freezeProposal ? proposeToggleFreezeStatus() : openVoteModal())}
        >
          {freezeProposal ? "VOTE to" : "PROPOSE to"} {proxyWalletInfo.is_frozen ? "UNFREEZE" : "FREEZE"}
        </label>

        {voteModalOpen && freezeProposal && (
          <Modal id={`vote-modal-${freezeProposal?.id}`}>
            <ProposalDetails
              multisigAddress={proxyWalletInfo?.multisig_address!}
              proposal={freezeProposal!}
              onVote={() => {
                fetchVoteList();
                onVote?.();
              }}
              onExecute={() => {
                setVoteModalOpen(false);
                onVote?.();
              }}
            />
          </Modal>
        )}
      </>
    );
  }

  return (
    <button className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2" onClick={toggleFreezeStatus}>
      {proxyWalletInfo.is_frozen ? "UNFREEZE" : "FREEZE"}
    </button>
  );
}
