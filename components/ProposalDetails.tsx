import { useCosm } from "contexts/cosmwasm";
import { Proposal, VoteInfo } from "contexts/vectis";
import { useEffect, useState } from "react";
import { executeProposal, queryProposalVoteList } from "services/vectis";
import { groupVoteListByVote } from "utils/misc";
import { AlertError } from "./Alert";
import Loader from "./Loader";
import ProposalVotes from "./ProposalVotes";

type ProposalDetailsProps = {
  proposal: Proposal;
  multisigAddress: string;
  onExecute?: () => void;
};

export default function ProposalDetails({ proposal, multisigAddress, onExecute }: ProposalDetailsProps) {
  const { signingClient, address: userAddress } = useCosm();

  const [voteList, setVoteList] = useState<VoteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executeSuccess, setExecuteSuccess] = useState("");
  const [executeError, setExecuteError] = useState<Error | null>(null);

  useEffect(() => {
    if (!proposal) {
      return;
    }

    setLoading(true);
    queryProposalVoteList(signingClient!, multisigAddress, proposal.id)
      .then((votes) => setVoteList(votes))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [proposal.id, multisigAddress]);

  function execute() {
    if (!proposal) {
      return;
    }

    setIsExecuting(true);
    executeProposal(signingClient!, userAddress, multisigAddress, proposal.id)
      .then(() => {
        setExecuteSuccess("Proposal was executed successfully!");
        onExecute?.();
      })
      .catch((err) => {
        console.error(err);
        setExecuteError(err);
      })
      .finally(() => setIsExecuting(false));
  }

  return (
    <>
      <h3 className="text-2xl font-bold mb-5">Proposal Details</h3>
      <div className="flex flex-col items-center text-xl">
        <p>Title: {proposal.title}</p>
        <p>Description: {proposal.description}</p>
        {/* <p>Expires: {proposal.expires.at_time}</p> */}
        <p>
          Approval Threshold: {proposal.threshold.absolute_count.weight} positive vote
          {proposal.threshold.absolute_count.weight === 1 ? "" : "s"}
        </p>
        <p>Status: {proposal.status}</p>
        {loading && <Loader>Fetching proposal votes...</Loader>}
        {!loading && error && (
          <div className="my-5">
            <AlertError>{error.message}</AlertError>
          </div>
        )}
        {!loading && !error && (
          <>
            <h3 className="text-2xl font-bold my-5">Votes</h3>
            <ProposalVotes proposal={proposal} voteList={voteList} />

            {isExecuting && <Loader>Executing proposal...</Loader>}

            {proposal.status === "passed" && !isExecuting && !executeSuccess && (
              <button className="btn btn-primary text-lg mt-5" onClick={execute}>
                EXECUTE PROPOSAL
              </button>
            )}

            {!isExecuting && executeError && (
              <div className="my-5 text-sm">
                <AlertError>{executeError.message}</AlertError>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
