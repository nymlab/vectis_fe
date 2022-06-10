import { Proposal, VoteInfo } from "./../contexts/vectis";
import { WalletInfoWithBalance } from "contexts/vectis";
import { ProxyClient, CosmosMsg_for_Empty as CosmosMsg } from "@vectis/types/contracts/ProxyContract";
import { Coin, CreateWalletMsg, FactoryClient } from "@vectis/types/contracts/FactoryContract";
import { coin, convertMicroDenomToDenom } from "utils/conversion";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { ExecuteMsg, QueryMsg, Vote } from "@dao-dao/types/contracts/cw-proposal-single";
import network from "configs/networks";

const factoryContractAddress = process.env.NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS;

export enum SCWOperation {
  ToggleFreeze = "TOGGLE_FREEZE",
  RotateKey = "ROTATE_KEY",
}

export const SCWProposals = {
  [SCWOperation.ToggleFreeze]: () => ({
    title: "Revert freeze status",
    description: "Need to revert freeze status",
    message: {
      revert_freeze_status: {},
    },
  }),
  [SCWOperation.RotateKey]: (newUserAddress: string) => ({
    title: "Rotate key",
    description: "Need to rotate owner key",
    message: {
      rotate_user_key: {
        new_user_address: newUserAddress,
      },
    },
  }),
};

/**
 * Creates a new SCW.
 *
 * @param signingClient
 * @param userAddress
 * @param guardians
 * @param relayers
 * @param proxyInitialFunds
 * @param multisigThreshold
 */
export async function createProxyWallet(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  label: string,
  guardians: string[],
  relayers: string[],
  proxyInitialFunds: number,
  multisigThreshold?: number
) {
  if (!factoryContractAddress) {
    throw new Error("Factory address is missing in environment");
  }

  const account = await signingClient.getAccount(userAddress);
  if (!account) {
    throw new Error(`Signer account was not found by user address ${userAddress}`);
  }

  const factoryClient = new FactoryClient(signingClient, userAddress, factoryContractAddress);

  const defaultWalletCreationFee = await factoryClient.fee();
  const walletFee = convertMicroDenomToDenom(100);

  // Create wallet message
  const createWalletMsg: CreateWalletMsg = {
    user_pubkey: account.pubkey?.value,
    label: label,
    guardians: {
      addresses: guardians,
      ...(multisigThreshold && {
        guardians_multisig: {
          threshold_absolute_count: multisigThreshold,
          multisig_initial_funds: [],
        },
      }),
    },
    relayers: relayers,
    proxy_initial_funds: [coin(proxyInitialFunds)],
  };

  // Execute wallet creation
  const res = await factoryClient.createWallet({ createWalletMsg }, Number(defaultWalletCreationFee.amount), undefined, [
    coin(proxyInitialFunds + walletFee),
  ]);

  console.log(`Executed wallet creation transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Gets the list of owned SCW addresses for a particular user.
 *
 * @param signingClient
 * @param userAddress
 */
export async function queryProxyWalletsOfUser(signingClient: SigningCosmWasmClient, userAddress: string): Promise<string[]> {
  const factoryClient = new FactoryClient(signingClient, userAddress, factoryContractAddress);
  const { wallets } = await factoryClient.walletsOf({ user: userAddress });

  return wallets;
}

/**
 * Gets detailed info about the SCW.
 *
 * @param signingClient
 * @param userAddress
 * @param proxyWalletAddress
 */
export async function queryProxyWalletInfo(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string
): Promise<WalletInfoWithBalance> {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const info = await proxyClient.info();
  const balance = await signingClient.getBalance(proxyWalletAddress, network.stakingToken);

  return {
    ...info,
    balance: balance as Coin,
  };
}

/**
 * Transfer funds from a SCW to an address. Only the owner may call this.
 *
 * @param signingClient
 * @param fromAddress
 * @param proxyWalletAddress
 * @param toAddress
 * @param amount
 */
export async function transferFundsFromProxyWallet(
  signingClient: SigningCosmWasmClient,
  fromAddress: string,
  proxyWalletAddress: string,
  toAddress: string,
  amount: number
) {
  const proxyClient = new ProxyClient(signingClient, fromAddress, proxyWalletAddress);

  const res = await proxyClient.execute({
    msgs: [
      {
        bank: {
          send: {
            to_address: toAddress,
            amount: [coin(amount)],
          },
        },
      },
    ],
  });

  console.log(`Executed send funds transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Reverts freeze status for a wallet. Only a guardian may call this.
 * IMPORTANT: This function will fail on multisig wallets!
 *
 * @param signingClient
 * @param guardianAddress
 * @param proxyWalletAddress
 */
export async function toggleProxyWalletFreezeStatus(signingClient: SigningCosmWasmClient, guardianAddress: string, proxyWalletAddress: string) {
  const proxyClient = new ProxyClient(signingClient, guardianAddress, proxyWalletAddress);
  const res = await proxyClient.revertFreezeStatus();
  console.log(`Executed revert freeze status transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Starts a proposal for a revert freeze status proxy wallet operation.
 * Obviously, it only works for multisig wallets.
 *
 * @param signingClient
 * @param guardianAddress
 * @param proxyWalletAddress
 * @param multisigAddress
 * @param operation
 * @param newUserAddress Optional - Provide if operation is ROTATE_KEY
 */
export async function proposeProxyWalletOperation(
  signingClient: SigningCosmWasmClient,
  guardianAddress: string,
  proxyWalletAddress: string,
  multisigAddress: string,
  operation: SCWOperation,
  newUserAddress?: string
) {
  const { title, description, message } = SCWProposals[operation](newUserAddress!);
  const msg: CosmosMsg = {
    wasm: {
      execute: {
        contract_addr: proxyWalletAddress,
        msg: toBase64(toUtf8(JSON.stringify(message))),
        funds: [],
      },
    },
  };
  const proposal: ExecuteMsg = {
    propose: {
      title,
      description,
      msgs: [msg],
      latest: null,
    },
  };
  await signingClient.execute(guardianAddress, multisigAddress, proposal, "auto");
}

/**
 * Returns the list of proposals currently active in a CW3 contract.
 *
 * @param signingClient
 * @param multisigAddress
 */
export async function queryProposals(signingClient: SigningCosmWasmClient, multisigAddress: string): Promise<Proposal[]> {
  const queryProps: QueryMsg = { list_proposals: {} };
  const { proposals } = await signingClient.queryContractSmart(multisigAddress, queryProps);
  return proposals;
}

/**
 * Returns the list of votes for a CW3 proposal.
 *
 * @param signingClient
 * @param multisigAddress
 * @param proposalId
 */
export async function queryProposalVoteList(
  signingClient: SigningCosmWasmClient,
  multisigAddress: string,
  proposalId: number
): Promise<VoteInfo[]> {
  const queryProps = { list_votes: { proposal_id: proposalId } };
  const { votes } = await signingClient.queryContractSmart(multisigAddress, queryProps);
  return votes;
}

/**
 * Votes on a multisig proposal.
 *
 * @param signingClient
 * @param senderAddress
 * @param multisigAddress
 * @param proposalId
 * @param vote
 */
export async function voteProposal(
  signingClient: SigningCosmWasmClient,
  senderAddress: string,
  multisigAddress: string,
  proposalId: number,
  vote: Vote
) {
  const executeVote: ExecuteMsg = {
    vote: {
      proposal_id: proposalId,
      vote,
    },
  };
  await signingClient.execute(senderAddress, multisigAddress, executeVote, "auto");
}

/**
 * Executes a multisig proposal, given that it has passed.
 *
 * @param signingClient
 * @param senderAddress
 * @param multisigAddress
 * @param proposalId
 */
export async function executeProposal(
  signingClient: SigningCosmWasmClient,
  senderAddress: string,
  multisigAddress: string,
  proposalId: number
) {
  const execute: ExecuteMsg = {
    execute: {
      proposal_id: proposalId,
    },
  };
  await signingClient.execute(senderAddress, multisigAddress, execute, "auto");
}

/**
 * Assigns a new owner to a SCW. Only a guardian may call this.
 * IMPORTANT: This function will fail on multisig wallets!
 *
 * @param signingClient
 * @param guardianAddress
 * @param proxyWalletAddress
 * @param newUserAddress
 */
export async function rotateUserKey(
  signingClient: SigningCosmWasmClient,
  guardianAddress: string,
  proxyWalletAddress: string,
  newUserAddress: string
) {
  const proxyClient = new ProxyClient(signingClient, guardianAddress, proxyWalletAddress);
  const res = await proxyClient.rotateUserKey({ newUserAddress });
  console.log(`Executed key rotation transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Updates proxy wallet guardians list.
 * Only the owner may execute this.
 *
 * @param signingClient
 * @param userAddress
 * @param proxyWalletAddress
 * @param guardianAddresses
 * @param multisigThreshold
 */
export async function updateProxyWalletGuardians(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string,
  guardianAddresses: string[],
  multisigThreshold?: number
) {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const res = await proxyClient.updateGuardians({
    guardians: {
      addresses: guardianAddresses,
      ...(multisigThreshold && {
        guardians_multisig: {
          threshold_absolute_count: multisigThreshold,
          multisig_initial_funds: [],
        },
      }),
    },
  });
  console.log(`Executed update guardians transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Adds a new relayer to a proxy wallet.
 *
 * @param signingClient
 * @param userAddress
 * @param proxyWalletAddress
 * @param newRelayerAddress
 */
export async function addRelayerToProxyWallet(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string,
  newRelayerAddress: string
) {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const res = await proxyClient.addRelayer({ newRelayerAddress });
  console.log(`Executed add relayer transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Removes a relayer from a proxy wallet.
 *
 * @param signingClient
 * @param userAddress
 * @param proxyWalletAddress
 * @param relayerAddress
 */
export async function removeRelayerFromProxyWallet(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string,
  relayerAddress: string
) {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const res = await proxyClient.removeRelayer({ relayerAddress });
  console.log(`Executed remove relayer transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

/**
 * Updates a proxy wallet's label.
 *
 * @param signingClient
 * @param userAddress
 * @param proxyWalletAddress
 * @param newLabel
 */
export async function updateProxyWalletLabel(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string,
  newLabel: string
) {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const res = await proxyClient.updateLabel({ newLabel });
  console.log(`Executed update label transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}
