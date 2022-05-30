import { Vote } from "@dao-dao/types/contracts/cw-proposal-single";
import { Proposal, VoteInfo } from "./../contexts/vectis";

type AggregatedVoteInfo = {
  proposal_id: number;
  voters: string[];
  vote: Vote;
  weight: number;
};

export function groupVoteListByVote(proposal: Proposal, voteList: VoteInfo[], vote: Vote) {
  return voteList
    .filter((v) => v.vote === vote)
    .reduce<AggregatedVoteInfo>(
      (acc, cur) => ({
        ...acc,
        voters: [...acc.voters, cur.voter],
        weight: acc.weight + cur.weight,
      }),
      {
        proposal_id: proposal.id,
        voters: [],
        vote: vote,
        weight: 0,
      } as AggregatedVoteInfo
    );
}
