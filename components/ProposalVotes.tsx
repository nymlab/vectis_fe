import { Proposal, VoteInfo } from "contexts/vectis";
import { groupVoteListByVote } from "utils/misc";

type ProposalVotesProps = {
  proposal: Proposal;
  voteList: VoteInfo[];
};

export default function ProposalVotes({ proposal, voteList }: ProposalVotesProps) {
  const voteColors = {
    yes: "text-green-600",
    no: "text-red-600",
    abstain: "text-gray-600",
  };

  if (!voteList.length) {
    return <p>No one voted for this proposal yet.</p>;
  }

  return (
    <>
      <div className="flex items-center w-full justify-around mb-2">
        <p className="text-green-600">YES: {groupVoteListByVote(proposal, voteList, "yes").weight}</p>
        <p className="text-red-600">NO: {groupVoteListByVote(proposal, voteList, "no").weight}</p>
        <p className="text-gray-600">ABSTAIN: {groupVoteListByVote(proposal, voteList, "abstain").weight}</p>
      </div>
      {voteList.map((v, i) => (
        <div key={i} className={`flex w-full my-3 border-2 rounded-lg p-5 items-center justify-between ${voteColors[v.vote]}`}>
          <p className="link link-hover text-sm transition-colors tooltip" data-tip="Copy address">
            {v.voter}
          </p>
          <p className="font-bold">{v.vote.toUpperCase()}</p>
        </div>
      ))}
    </>
  );
}
