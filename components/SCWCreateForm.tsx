import { useSigningClient } from "contexts/cosmwasm";
import { useArrayState } from "hooks/useArrayState";
import { useState } from "react";
import { convertFromMicroDenom } from "util/conversion";
import Alert, { IconError, IconSuccess } from "./Alert";

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'ujuno'

export default function SCWCreateForm() {
  const { walletAddress, signingClient } = useSigningClient();

  const { array: guardians, setItem: setGuardian, pushItem: pushGuardian, removeItem: removeGuardian } = useArrayState("");
  const { array: relayers, setItem: setRelayer, pushItem: pushRelayer, removeItem: removeRelayer } = useArrayState("");
  const [proxyInitialFunds, setProxyInitialFunds] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function createSCW() {
    console.log({ guardians, relayers });
  }

  return (
    <>
      <h1 className="text-5xl font-bold my-8">
        Create your Smart Contract Wallet
      </h1>

      <h2 className="text-3xl font-bold">
        1. Choose your guardians
      </h2>
      {
        guardians.map((address, i) => (
          <div className="flex w-full max-w-xl" key={i}>
            <input
              type="text"
              className="input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center text-lg my-2"
              placeholder={`Guardian #${i + 1} wallet address`}
              onChange={(event) => setGuardian(i, event.target.value)}
              value={address}
            />
          </div>
        ))
      }
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        onClick={() => pushGuardian()}
      >
        ADD GUARDIAN
      </button>

      <h2 className="text-3xl font-bold my-5">
        2. Choose your relayers
      </h2>
      {
        relayers.map((address, i) => (
          <div className="flex w-full max-w-xl" key={i}>
            <input
              type="text"
              className="input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center text-lg my-2"
              placeholder={`Relayer #${i + 1} wallet address`}
              onChange={(event) => setRelayer(i, event.target.value)}
              value={address}
            />
          </div>
        ))
      }
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        type="submit"
        onClick={() => pushRelayer()}
      >
        ADD RELAYER
      </button>

      <h2 className="text-3xl font-bold my-5">
        3. Create your wallet
      </h2>
      <div className="flex flex-col md:flex-row text-2xl w-full max-w-xl justify-between">
        <div className="relative rounded-full shadow-sm md:mr-2">
          <input
            type="number"
            id="send-amount"
            className="input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg "
            placeholder="Initial funds"
            step="0.1"
            onChange={(event) => setProxyInitialFunds(event.target.value)}
            value={proxyInitialFunds}
          />
          <span className="absolute top-0 right-0 bottom-0 px-4 py-5 rounded-r-full bg-secondary text-base-100 text-sm">
            {convertFromMicroDenom(PUBLIC_STAKING_DENOM)}
          </span>
        </div>
        <button
          className="mt-4 md:mt-0 btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl rounded-full flex-grow"
          type="submit"
          onClick={createSCW}
        >
          CREATE
        </button>
      </div>

      <div className="mt-4 flex flex-col w-full max-w-xl">
        {success && (
          <Alert type="success" icon={<IconSuccess/>}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert type="error" icon={<IconError/>}>
            {error}
          </Alert>
        )}
      </div>
    </>
  )

}
