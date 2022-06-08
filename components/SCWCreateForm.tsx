import { useCosmWasmClient } from "contexts/cosmwasm";
import { env } from "env";
import { useArrayState } from "hooks/useArrayState";
import { useBalance } from "hooks/useBalance";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { createProxyWallet } from "services/vectis";
import { convertFromMicroDenom } from "utils/conversion";
import { AlertError, AlertSuccess } from "./Alert";
import { IconInfo, IconTrash } from "./Icon";
import { Input } from "./Input";
import Loader from "./Loader";

type SCWCreateFormProps = {
  onRefresh?: () => void;
};

export default function SCWCreateForm({ onRefresh }: SCWCreateFormProps) {
  const { address, signingClient } = useCosmWasmClient();
  const { balance, refreshBalance } = useBalance();

  // Form state hooks
  const { array: guardians, setItem: setGuardian, pushItem: pushGuardian, removeItem: removeGuardian } = useArrayState("");
  const { array: relayers, setItem: setRelayer, pushItem: pushRelayer, removeItem: removeRelayer } = useArrayState("");
  const [proxyInitialFunds, setProxyInitialFunds] = useState("");
  const [enableMultisig, setEnableMultisig] = useState(false);
  const [multisigThreshold, setMultisigThreshold] = useState(1);
  const [label, setLabel] = useState("");

  const { getValueValidationError, getArrayValidationError, checkValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "proxyInitialFunds",
        value: proxyInitialFunds,
        message: "This field is mandatory",
        validate: () => !!proxyInitialFunds,
      },
      {
        key: "proxyInitialFunds",
        value: proxyInitialFunds,
        message: "This field must be >= 0",
        validate: () => parseFloat(proxyInitialFunds) > 0,
      },
      {
        key: "proxyInitialFunds",
        message: `You don't have enough ${convertFromMicroDenom(env.stakingDenom)}`,
        value: proxyInitialFunds,
        validate: () => parseFloat(proxyInitialFunds) < parseFloat(balance),
      },
      {
        key: "guardians",
        value: guardians,
        message: "This field is mandatory",
        validate: (g) => !!g,
      },
      {
        key: "relayers",
        value: relayers,
        message: "This field is mandatory",
        validate: (r) => !!r,
      },
      {
        key: "guardians",
        value: guardians,
        message: "You can't become your own guardian",
        validate: (g) => g !== address,
      },
      {
        key: "relayers",
        value: relayers,
        message: "You can't become your own relayer",
        validate: (r) => r !== address,
      },
      {
        key: "guardians",
        value: guardians,
        message: "Guardian addresses must be unique",
        validate: (g1, i) => !guardians.some((g2, j) => i !== j && g1 === g2),
      },
      {
        key: "relayers",
        value: relayers,
        message: "Relayer addresses must be unique",
        validate: (r1, i) => !relayers.some((r2, j) => i !== j && r1 === r2),
      },
      {
        key: "label",
        value: label,
        message: "This field is mandatory",
        validate: () => !!label,
      },
    ],
  });

  // Generic state hooks
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  function createSCW() {
    console.log({ guardians, relayers, proxyInitialFunds });

    if (!checkValidationErrors()) {
      // There are some validation errors, don't proceed
      return;
    }

    if (!signingClient) {
      console.warn("signingClient is null, can't create SCW.");
      return;
    }

    // Create Smart Contract Wallet
    setIsCreating(true);
    createProxyWallet(
      signingClient!,
      address,
      label,
      guardians,
      relayers,
      parseFloat(proxyInitialFunds),
      enableMultisig ? multisigThreshold : 0
    )
      .then(() => {
        setSuccess("Your Smart Contract Wallet has been created successfully.");
        refreshBalance();
        onRefresh?.();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to create the proxy wallet. Check the console for details.");
      })
      .finally(() => setIsCreating(false));
  }

  function handleRemoveGuardian(i: number) {
    removeGuardian(i);
    if (multisigThreshold > i) {
      setMultisigThreshold(i);
    }
  }

  if (success) {
    return (
      <div className="mt-4 flex flex-col w-full max-w-xl">
        <AlertSuccess>{success}</AlertSuccess>
        <span className="my-5 text-primary hover:underline">
          <a href="/wallets">Go to your Smart Contract Wallets &rarr;</a>
        </span>
      </div>
    );
  }

  if (isCreating) {
    return (
      <Loader>
        We are creating your new <b>Smart Contract Wallet</b>.<br />
        Please sign the transaction to proceed.
      </Loader>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-col w-full max-w-xl">{error && <AlertError>{error}</AlertError>}</div>

      <h1 className="text-5xl font-bold my-8">Create your Smart Contract Wallet</h1>

      <h2 className="text-3xl font-bold mb-5">1. Choose your guardians</h2>
      {guardians.map((address, i) => (
        <div className="flex w-full max-w-xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Guardian #${i + 1} address`}
            onChange={(event) => setGuardian(i, event.target.value)}
            error={getArrayValidationError("guardians", i)}
            value={address}
          />
          {guardians.length > 1 && (
            <button
              className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
              type="button"
              onClick={() => handleRemoveGuardian(i)}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ))}
      <button className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full" onClick={() => pushGuardian()}>
        ADD GUARDIAN
      </button>

      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            onChange={(event) => {
              setEnableMultisig(event.target.checked);
              setMultisigThreshold(Math.ceil(guardians.length / 2));
            }}
          />
          <span className="label-text ml-2">Enable multisig</span>
          <span className="ml-2">
            <div
              className="tooltip"
              data-tip="If enabled, allows for a threshold of required guardian signatures to be defined for wallet operations (following CW3)"
            >
              <IconInfo />
            </div>
          </span>
        </label>
      </div>

      {enableMultisig && (
        <div className="w-96">
          <span className="label-text">Multisig threshold:</span>
          <input
            type="range"
            min={1}
            max={guardians.length}
            value={multisigThreshold}
            className="range range-primary mt-2"
            step={1}
            onChange={(event) => setMultisigThreshold(parseInt(event.target.value))}
          />
          <div className="w-full flex justify-between text-sm px-2">
            {guardians.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold my-5">2. Choose your relayers</h2>
      {relayers.map((address, i) => (
        <div className="flex w-full max-w-xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Relayer #${i + 1} address`}
            onChange={(event) => setRelayer(i, event.target.value)}
            error={getArrayValidationError("relayers", i)}
            value={address}
          />
          {relayers.length > 1 && (
            <button
              className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
              type="button"
              onClick={() => removeRelayer(i)}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ))}
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        type="button"
        onClick={() => pushRelayer()}
      >
        ADD RELAYER
      </button>

      <h2 className="text-3xl font-bold my-5">3. Create your wallet</h2>
      <div className="w-full max-w-xl mb-2">
        <Input
          placeholder={`Label (e.g. Personal Wallet, Business Wallet...)`}
          onChange={(event) => setLabel(event.target.value)}
          error={getValueValidationError("label")}
          value={label}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-xl justify-between mb-8">
        <div className="flex flex-col items-start">
          <div className="relative rounded-full shadow-sm md:mr-2">
            <input
              type="number"
              className={`input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg ${
                getValueValidationError("proxyInitialFunds") ? "input-error" : ""
              }`}
              placeholder="Initial funds"
              step="0.1"
              min="0"
              onChange={(event) => setProxyInitialFunds(event.target.value)}
              value={proxyInitialFunds}
            />
            <span className="absolute top-0 right-0 bottom-0 px-4 py-5 rounded-r-full bg-secondary text-base-100 text-sm">
              {convertFromMicroDenom(env.stakingDenom)}
            </span>
          </div>
          {getValueValidationError("proxyInitialFunds") && (
            <span className="pl-6 text-error font-bold">{getValueValidationError("proxyInitialFunds")}</span>
          )}
        </div>
        <button
          className="mt-4 md:mt-0 btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl rounded-full flex-grow"
          type="button"
          onClick={createSCW}
        >
          CREATE
        </button>
      </div>
    </>
  );
}
