import Modal from "components/Modal";
import RotateKeyModal from "components/modals/RotateKeyModal";
import ProposalDetails from "components/ProposalDetails";
import { useCosm } from "contexts/cosmwasm";
import { Proposal, WalletInfoWithBalance } from "contexts/vectis";
import { useEffect, useState } from "react";
import { queryProposalVoteList } from "services/vectis";

type RotateKeyButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  keyRotationProposal?: Proposal;
  onKeyRotation: (newAddr: string) => void;
  onKeyRotationProposal: (newAddr: string) => void;
  onKeyRotationVote?: () => void;
};

export default function RotateKeyButton({
  proxyWalletAddress,
  proxyWalletInfo,
  keyRotationProposal,
  onKeyRotation,
  onKeyRotationProposal,
  onKeyRotationVote,
}: RotateKeyButtonProps) {
  const { signingClient, address: userAddress } = useCosm();

  const [rotateKeyModalOpen, setRotateKeyModalOpen] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  useEffect(() => {
    if (!keyRotationProposal) {
      return;
    }

    fetchVoteList();
  }, [keyRotationProposal]);

  function fetchVoteList() {
    setAlreadyVoted(false);
    queryProposalVoteList(signingClient!, proxyWalletInfo.multisig_address!, keyRotationProposal!.id)
      .then((votes) => setAlreadyVoted(!!votes.find((v) => v.voter === userAddress)))
      .catch(console.error);
  }

  // This function should be called only if the proxy wallet IS multisig
  function openVoteModal() {
    if (alreadyVoted) {
      return;
    }

    setVoteModalOpen(true);
  }

  if (proxyWalletInfo.multisig_address) {
    return (
      <>
        <label
          htmlFor={keyRotationProposal ? `vote-modal-${keyRotationProposal.id}` : "rotate-key-modal"}
          className={`btn btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2 ${
            alreadyVoted || keyRotationProposal?.status === "passed" ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => (!keyRotationProposal ? setRotateKeyModalOpen(true) : openVoteModal())}
        >
          {keyRotationProposal ? "VOTE" : "PROPOSE"} KEY ROTATION
        </label>

        {voteModalOpen && keyRotationProposal && (
          <Modal id={`vote-modal-${keyRotationProposal?.id}`}>
            <ProposalDetails
              multisigAddress={proxyWalletInfo?.multisig_address!}
              proposal={keyRotationProposal!}
              onVote={() => {
                fetchVoteList();
                onKeyRotationVote?.();
              }}
              onExecute={() => {
                setVoteModalOpen(false);
                onKeyRotationVote?.();
              }}
            />
          </Modal>
        )}

        {rotateKeyModalOpen && (
          <RotateKeyModal
            proxyWalletInfo={proxyWalletInfo}
            proxyWalletAddress={proxyWalletAddress}
            onKeyRotation={onKeyRotation}
            onKeyRotationProposal={onKeyRotationProposal}
          />
        )}
      </>
    );
  }

  return (
    <>
      <label
        htmlFor="rotate-key-modal"
        className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
        onClick={() => setRotateKeyModalOpen(true)}
      >
        ROTATE KEY
      </label>

      {rotateKeyModalOpen && (
        <RotateKeyModal
          proxyWalletInfo={proxyWalletInfo}
          proxyWalletAddress={proxyWalletAddress}
          onKeyRotation={onKeyRotation}
          onKeyRotationProposal={onKeyRotationProposal}
        />
      )}
    </>
  );
}
