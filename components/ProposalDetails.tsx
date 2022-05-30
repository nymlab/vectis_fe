import { useSigningClient } from "contexts/cosmwasm";
import { Proposal, VoteInfo } from "contexts/vectis";
import { useEffect, useState } from "react";
import { executeProposal, queryProposalVoteList } from "services/vectis";
import { groupVoteListByVote } from "util/misc";
import { AlertError } from "./Alert";
import Loader from "./Loader";

type ProposalDetailsProps = {
  proposal: Proposal;
  multisigAddress: string;
  onExecute?: () => void;
};

export default function ProposalDetails({ proposal, multisigAddress, onExecute }: ProposalDetailsProps) {
  const { signingClient, walletAddress: userAddress } = useSigningClient();

  const [voteList, setVoteList] = useState<VoteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executeSuccess, setExecuteSuccess] = useState("");
  const [executeError, setExecuteError] = useState<Error | null>(null);

  const voteColors = {
    yes: "text-green-600",
    no: "text-red-600",
    abstain: "text-gray-600",
  };

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
            {voteList?.length > 0 && (
              <>
                <div className="flex items-center w-full justify-around mb-2">
                  <p className="text-green-600">YES: {groupVoteListByVote(proposal, voteList, "yes").weight}</p>
                  <p className="text-red-600">NO: {groupVoteListByVote(proposal, voteList, "no").weight}</p>
                  <p className="text-gray-600">ABSTAIN: {groupVoteListByVote(proposal, voteList, "abstain").weight}</p>
                </div>
                {voteList.map((v, i) => (
                  <div
                    key={i}
                    className={`flex w-full my-3 border-2 rounded-lg p-5 items-center justify-between ${
                      voteColors[v.vote]
                    }`}
                  >
                    <p className="link link-hover text-sm transition-colors tooltip" data-tip="Copy address">
                      {v.voter}
                    </p>
                    <p className="font-bold">{v.vote.toUpperCase()}</p>
                  </div>
                ))}
              </>
            )}
            {!voteList?.length && <p>No one voted for this proposal yet.</p>}
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
