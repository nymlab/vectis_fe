import { Vote } from "@dao-dao/types/contracts/cw-proposal-single";
import { AlertError, AlertSuccess } from "components/Alert";
import Loader from "components/Loader";
import Modal from "components/Modal";
import { useCosm } from "contexts/cosmwasm";
import { Proposal } from "contexts/vectis";
import { useState } from "react";
import { voteProposal } from "services/vectis";

type VoteModalProps = {
  proposal: Proposal;
  multisigAddress: string;
  onVote?: (vote: Vote) => void;
  onClose?: () => void;
};

export default function VoteModal({ proposal, multisigAddress, onVote, onClose }: VoteModalProps) {
  const { signingClient, address: userAddress } = useCosm();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<Error | null>(null);

  function castVote(vote: Vote) {
    setError(null);
    setLoading(true);
    voteProposal(signingClient!, userAddress, multisigAddress, proposal.id, vote)
      .then(() => {
        setSuccess("Vote casted successfully!");
        onVote?.(vote);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function handleCloseModal() {
    onClose?.();
  }

  return (
    <Modal id={`vote-modal-${proposal.id}`} onClose={handleCloseModal}>
      <h3 className="text-2xl font-bold mb-5">Vote Proposal</h3>
      <div className="flex flex-col items-center text-xl">
        {/* <p>Title: {proposal.title}</p> */}
        {/* <p>Description: {proposal.description}</p> */}
        {/* <p>Expires: {proposal.expires.at_time}</p> */}
        <p>Approval Threshold: {proposal.threshold.absolute_count.weight} positive votes</p>
      </div>
      {loading && <Loader>Casting your vote...</Loader>}
      {!loading && !success && (
        <>
          <div className="flex items-center space-x-5 justify-center my-5">
            <button className="btn btn-success" onClick={() => castVote("yes")}>
              YES
            </button>
            <button className="btn btn-error" onClick={() => castVote("no")}>
              NO
            </button>
            <button className="btn" onClick={() => castVote("abstain")}>
              ABSTAIN
            </button>
          </div>

          {error && (
            <div className="my-5">
              <AlertError>Error: {error.message}</AlertError>
            </div>
          )}
        </>
      )}
      {success && (
        <div className="my-5">
          <AlertSuccess>{success}</AlertSuccess>
        </div>
      )}
    </Modal>
  );
}
