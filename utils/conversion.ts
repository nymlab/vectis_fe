import network from "configs/networks";
import { MICRO_DENOM, REWARDS_RATE, VALIDATOR_RATE } from "./constants";

export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / MICRO_DENOM;
  return isNaN(amount) ? 0 : amount;
}

export function convertDenomToMicroDenom(amount: number | string): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = Math.ceil(amount * MICRO_DENOM);
  return isNaN(amount) ? "0" : String(amount);
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase();
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  if (amount > 0.01) {
    return amount.toFixed(2);
  } else return String(amount);
}

export const zeroVotingCoin = {
  amount: "0",
  denom: "ucredits",
};

export const zeroStakingCoin = {
  amount: "0",
  denom: network.stakingToken,
};

export function coin(amount: number) {
  return {
    amount: convertDenomToMicroDenom(amount),
    denom: network.stakingToken,
  };
}

export function fromValidationRate(comissionRate: string | number) {
  return (Number(comissionRate) / VALIDATOR_RATE).toFixed(2);
}

export const fromRewardsRate = (rewardsRate: string | number) => {
  return (Number(rewardsRate) / REWARDS_RATE).toFixed(2);
};
