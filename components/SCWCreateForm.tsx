import { useCosm } from "contexts/cosmwasm";
import { useArrayState } from "hooks/useArrayState";
import { useBalance } from "hooks/useBalance";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { createProxyWallet } from "services/vectis";
import { convertFromMicroDenom } from "utils/conversion";
import { AlertError, AlertSuccess } from "./Alert";
import { IconAdd, IconInfo, IconTrash } from "./Icon";
import { Input } from "./Input";
import Loader from "./Loader";
import network from "configs/networks";
import { Anchor } from "./Anchor";
import TitleWithToolTip from "./TitleWithToolTip";

type SCWCreateFormProps = {
  onRefresh?: () => void;
};

export default function SCWCreateForm({ onRefresh }: SCWCreateFormProps) {
  const { address, pubkey, signingClient } = useCosm();
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
      // {
      //   key: "proxyInitialFunds",
      //   value: proxyInitialFunds,
      //   message: "This field is mandatory",
      //   validate: () => !!proxyInitialFunds,
      // },
      {
        key: "proxyInitialFunds",
        value: proxyInitialFunds,
        message: "This field must be >= 0",
        validate: () => !proxyInitialFunds || parseFloat(proxyInitialFunds) >= 0,
      },
      {
        key: "proxyInitialFunds",
        message: `You don't have enough ${convertFromMicroDenom(network.stakingToken)}`,
        value: proxyInitialFunds,
        validate: () => !proxyInitialFunds || parseFloat(proxyInitialFunds) < parseFloat(balance),
      },
      {
        key: "guardians",
        value: guardians,
        message: "This field is mandatory",
        validate: (g) => !!g,
      },
      // {
      //   key: "relayers",
      //   value: relayers,
      //   message: "This field is mandatory",
      //   validate: (r) => !!r,
      // },
      {
        key: "guardians",
        value: guardians,
        message: "You can't become your own guardian",
        validate: (g) => g !== address,
      },
      // {
      //   key: "relayers",
      //   value: relayers,
      //   message: "You can't become your own relayer",
      //   validate: (r) => r !== address,
      // },
      {
        key: "guardians",
        value: guardians,
        message: "Guardian addresses must be unique",
        validate: (g1, i) => !guardians.some((g2, j) => i !== j && g1 === g2),
      },
      // {
      //   key: "relayers",
      //   value: relayers,
      //   message: "Relayer addresses must be unique",
      //   validate: (r1, i) => !relayers.some((r2, j) => i !== j && r1 === r2),
      // },
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
      pubkey,
      label,
      guardians.filter((g) => !!g),
      relayers.filter((r) => !!r),
      !proxyInitialFunds ? 0 : parseFloat(proxyInitialFunds),
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
      <div className="mt-4 flex flex-col w-full max-w-xl items-center">
        <AlertSuccess>{success}</AlertSuccess>
        <span className="my-5 text-primary hover:underline">
          <Anchor href="/wallets">Go to your Smart Contract Wallets &rarr;</Anchor>
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

      <TitleWithToolTip
        title="1. Choose your guardian(s)"
        textTip="Guardians are trusted by you, they can help you freeze your wallet in the case of device theft and rotate the controlling key to this wallet. These can be updated anytime by you."
      />
      {guardians.map((address, i) => (
        <div className="flex w-full max-w-2xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Guardian #${i + 1} address`}
            name="guardian-#1"
            onChange={(event) => setGuardian(i, event.target.value)}
            error={getArrayValidationError("guardians", i)}
            value={address}
          />
          {i === guardians.length - 1 && (
            <button className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full" onClick={() => pushGuardian()}>
              <IconAdd />
            </button>
          )}
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
              data-tip="If enabled, amount of guardians signature must be at least equal to the threshold to execute actions. Otherwise any one of the Guardians can execute actions."
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

      <TitleWithToolTip
        title="2. Choose a label"
        textTip="A descriptive label to help you identify the purpose of this wallet, this information is public"
      />
      <div className="w-full max-w-2xl mb-2">
        <Input
          placeholder={`Label (e.g. My staking wallet...)`}
          name="wallet-label"
          onChange={(event) => setLabel(event.target.value)}
          error={getValueValidationError("label")}
          value={label}
        />
      </div>

      <TitleWithToolTip
        title="3. Coming soon - Set relayer(s)"
        textTip="This feature is coming soon to Vectis. Relayers will be able to relay transactions signed offline by the wallet's controller key."
      />
      {relayers.map((address, i) => (
        <div className="flex w-full max-w-2xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Relayer #${i + 1} address`}
            name="relayer-#1"
            onChange={(event) => setRelayer(i, event.target.value)}
            error={getArrayValidationError("relayers", i)}
            value={address}
            disabled
          />
          {i === guardians.length - 1 && (
            <button className="btn btn-disabled btn-md font-semibold hover:text-base-100 text-xl rounded-full" onClick={() => pushGuardian()}>
              <IconAdd />
            </button>
          )}
          {relayers.length > 0 && (
            <button
              className="btn btn-disabled btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
              type="button"
              onClick={() => removeRelayer(i)}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ))}

      <TitleWithToolTip title="4. Fund your wallet (optional)" textTip="You can set the wallet's initial funds here (optional)." />

      <div className="flex flex-col md:flex-row w-full max-w-2xl justify-between mb-8">
        <div className="flex flex-col items-center">
          <div className="relative rounded-full shadow-sm md:mr-2">
            <input
              type="number"
              className={`input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg ${
                getValueValidationError("proxyInitialFunds") ? "input-error" : ""
              }`}
              name="wallet-funds"
              placeholder="Initial funds"
              step="0.1"
              min="0"
              onChange={(event) => setProxyInitialFunds(event.target.value)}
              value={proxyInitialFunds}
            />

            <span className="absolute top-0 right-0 bottom-0 px-4 py-5 rounded-r-full bg-secondary text-base-100 text-sm">
              {convertFromMicroDenom(network.stakingToken)}
            </span>
          </div>
          <p className="text">Your personal wallet has {balance}</p>
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
