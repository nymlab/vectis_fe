import create from "zustand";
import { DelegationResponse, Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { QueryClientWithExtentions } from "services/stargate";

interface StakingState {
  scwalletAddr: string;
  validators: Validator[];
  validator: Validator | null;
  delegations: DelegationResponse[];
  delegation: DelegationResponse | null;
  updateValidators: (validators: Validator[]) => void;
  updateValidator: (validator: Validator | null) => void;
  updateDelegations: (delegations: DelegationResponse[]) => void;
  updateDelegation: (delegation: DelegationResponse | null) => void;
  updateScwalletAddr: (scwalletAddr: string) => void;
  refreshDelegations: (queryClient: QueryClientWithExtentions) => Promise<void>;
}

export const useStaking = create<StakingState>((set, get) => ({
  scwalletAddr: "NO_WALLET",
  validators: [],
  validator: null,
  delegations: [],
  delegation: null,
  updateValidators: (validators) => set({ validators }),
  updateValidator: (validator) => set({ validator }),
  updateDelegations: (delegations) => set({ delegations }),
  updateDelegation: (delegation) => set({ delegation }),
  updateScwalletAddr: (scwalletAddr) => set({ scwalletAddr }),
  refreshDelegations: async (queryClient: QueryClientWithExtentions) => {
    const { scwalletAddr } = get();
    const { delegationResponses } = await queryClient.staking.delegatorDelegations(scwalletAddr);
    set({ delegations: delegationResponses });
  },
}));
