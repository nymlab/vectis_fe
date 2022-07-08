import { Vote } from "@dao-dao/types/contracts/cw-proposal-single";
import { useCosm } from "contexts/cosmwasm";
import { Proposal, VoteInfo } from "contexts/vectis";
import { useEffect, useMemo, useState } from "react";
import { executeProposal, queryProposalVoteList } from "services/vectis";
import { AlertError, AlertSuccess } from "./Alert";
import { voteProposal } from "services/vectis";
import Loader from "./Loader";
import ProposalVotes from "./ProposalVotes";

type ProposalDetailsProps = {
  proposal: Proposal;
  multisigAddress: string;
  onVote?: (vote: Vote) => void;
  onExecute?: () => void;
};

export default function ProposalDetails({ proposal, multisigAddress, onVote, onExecute }: ProposalDetailsProps) {
  const { signingClient, address: userAddress } = useCosm();

  const [voteList, setVoteList] = useState<VoteInfo[]>([]);
  const [fetchingVotes, setFetchingVotes] = useState(false);
  const [fetchingVotesError, setFetchingVotesError] = useState<Error | null>(null);

  const [voting, setVoting] = useState(false);
  const [voteCastSuccess, setVoteCastSuccess] = useState("");
  const [voteCastError, setVoteCastError] = useState<Error | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executeSuccess, setExecuteSuccess] = useState("");
  const [executeError, setExecuteError] = useState<Error | null>(null);

  useEffect(() => {
    if (!proposal) {
      return;
    }

    fetchVotes();
  }, [proposal, multisigAddress]);

  const userAlreadyVoted = useMemo(() => !!voteList.find((v) => v.voter === userAddress), [voteList]);

  function fetchVotes() {
    setFetchingVotes(true);
    queryProposalVoteList(signingClient!, multisigAddress, proposal.id)
      .then((votes) => setVoteList(votes))
      .catch((err) => setFetchingVotesError(err))
      .finally(() => setFetchingVotes(false));
  }

  function castVote(vote: Vote) {
    setVoteCastError(null);
    setVoting(true);
    voteProposal(signingClient!, userAddress, multisigAddress, proposal.id, vote)
      .then(() => {
        setVoteCastSuccess("Vote casted successfully!");
        fetchVotes();
        onVote?.(vote);
      })
      .catch((err) => setVoteCastError(err))
      .finally(() => setVoting(false));
  }

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
      <div className="flex flex-col items-center text-xl text-center">
        <p className="font-bold">{proposal.title}</p>
        <p>
          <span className="text-lg">{proposal.description}</span>
        </p>
        {/* <p>Expires: {proposal.expires.at_time}</p> */}
        <p className="mt-2">
          Approval Threshold: {proposal.threshold.absolute_count.weight} positive vote
          {proposal.threshold.absolute_count.weight === 1 ? "" : "s"}
        </p>
        <p>Status: {proposal.status}</p>

        {fetchingVotes && <Loader>Fetching proposal votes...</Loader>}
        {!fetchingVotes && fetchingVotesError && (
          <div className="my-5">
            <AlertError>{fetchingVotesError.message}</AlertError>
          </div>
        )}
        {!fetchingVotes && !fetchingVotesError && (
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

        {userAlreadyVoted ? (
          <div className="mt-5 mb-2">
            <AlertSuccess>You already voted for this proposal!</AlertSuccess>
          </div>
        ) : (
          <>
            {voting && <Loader>Casting your vote...</Loader>}
            {!voting && !voteCastSuccess && (
              <>
                <h3 className="text-2xl font-bold my-2">Cast your vote</h3>
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

                {voteCastError && (
                  <div className="my-5">
                    <AlertError>Error: {voteCastError.message}</AlertError>
                  </div>
                )}
              </>
            )}
            {voteCastSuccess && (
              <div className="my-5">
                <AlertSuccess>{voteCastSuccess}</AlertSuccess>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
