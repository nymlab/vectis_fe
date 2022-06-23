import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useCosm } from "contexts/cosmwasm";
import { useArrayState } from "hooks/useArrayState";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useEffect, useState } from "react";
import {
  addRelayerToProxyWallet,
  queryProxyWalletInfo,
  removeRelayerFromProxyWallet,
  updateProxyWalletGuardians,
  updateProxyWalletLabel,
} from "services/vectis";
import { AlertError, AlertSuccess } from "./Alert";
import { IconCheckmark, IconInfo, IconTrash } from "./Icon";
import { Input } from "./Input";
import Loader from "./Loader";

type SCWManageFormProps = {
  proxyWalletAddress: string;
  onRefresh?: () => void;
};

export default function SCWManageForm({ proxyWalletAddress, onRefresh }: SCWManageFormProps) {
  const { address: userAddress, signingClient } = useCosm();

  // Form state hooks
  const {
    array: guardians,
    setItem: setGuardian,
    pushItem: pushGuardian,
    removeItem: removeGuardian,
    setArray: setGuardians,
  } = useArrayState("");
  const { array: relayers, setItem: setRelayer, pushItem: pushRelayer, removeItem: removeRelayer, setArray: setRelayers } = useArrayState("");
  const [enableMultisig, setEnableMultisig] = useState(false);
  const [multisigThreshold, setMultisigThreshold] = useState(1);
  const [label, setLabel] = useState("");

  const { getValueValidationError, checkValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "label",
        value: label,
        message: "This field is mandatory",
        validate: () => !!label,
      },
      {
        key: "label",
        value: label,
        message: "New label must be different from old label",
        validate: () => label !== originalLabel,
      },
    ],
  });

  const { getArrayValidationError: getGuardianArrayValidationError, checkValidationErrors: checkGuardianValidationErrors } =
    useValidationErrors({
      validators: [
        {
          key: "guardians",
          value: guardians,
          message: "This field is mandatory",
          validate: (g) => !!g,
        },
        {
          key: "guardians",
          value: guardians,
          message: "You can't become your own guardian",
          validate: (g) => g !== userAddress,
        },
        {
          key: "guardians",
          value: guardians,
          message: "Guardian addresses must be unique",
          validate: (g1, i) => !guardians.some((g2, j) => i !== j && g1 === g2),
        },
      ],
    });
  const { getArrayValidationError: getRelayerArrayValidationError, checkValidationErrors: checkRelayerValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "relayers",
        value: relayers,
        message: "This field is mandatory",
        validate: (r) => !!r,
      },
      {
        key: "relayers",
        value: relayers,
        message: "You can't become your own relayer",
        validate: (r) => r !== userAddress,
      },
      {
        key: "relayers",
        value: relayers,
        message: "Relayer addresses must be unique",
        validate: (r1, i) => !relayers.some((r2, j) => i !== j && r1 === r2),
      },
    ],
  });

  // Generic state hooks
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateGuardiansError, setUpdateGuardiansError] = useState<Error | null>(null);
  const [updateGuardiansSuccess, setUpdateGuardiansSuccess] = useState("");

  const [originalRelayers, setOriginalRelayers] = useState<string[]>([]);
  const [updateRelayersError, setUpdateRelayersError] = useState<Error | null>(null);
  const [updateRelayersSuccess, setUpdateRelayersSuccess] = useState("");

  const [originalLabel, setOriginalLabel] = useState("");
  const [updateLabelError, setUpdateLabelError] = useState<Error | null>(null);
  const [updateLabelSuccess, setUpdateLabelSuccess] = useState("");

  useEffect(() => {
    if (!signingClient) return;
    fetchSCW();
  }, [signingClient]);

  async function fetchSCW() {
    setLoading(true);
    return queryProxyWalletInfo(signingClient!, userAddress, proxyWalletAddress)
      .then((info) => {
        setGuardians(info.guardians);
        setRelayers(info.relayers);
        setOriginalRelayers(info.relayers);
        setLabel(info.label);
        setOriginalLabel(info.label);
        if (info.multisig_address) {
          setEnableMultisig(true);
          signingClient
            ?.queryContractSmart(info.multisig_address!, { threshold: {} })
            .then(({ absolute_count }) => setMultisigThreshold(absolute_count.weight ?? 1))
            .catch((err) => {
              console.error(err);
              setLoadingError(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadingError(err);
      })
      .finally(() => setLoading(false));
  }

  function updateGuardians() {
    setUpdateGuardiansError(null);
    setUpdateGuardiansSuccess("");

    if (!checkGuardianValidationErrors()) {
      // There are some validation errors, don't proceed
      return;
    }

    if (!signingClient) {
      console.warn("signingClient is null, can't update SCW.");
      return;
    }

    setIsUpdating(true);
    updateProxyWalletGuardians(signingClient!, userAddress, proxyWalletAddress, guardians, enableMultisig ? multisigThreshold : 0)
      .then(() => {
        setUpdateGuardiansSuccess("Smart Contract Wallet guardians have been updated successfully");
        onRefresh?.();
      })
      .catch((err) => {
        console.error(err);
        setUpdateGuardiansError(err);
      })
      .finally(() => setIsUpdating(false));
  }

  function handleRemoveGuardian(i: number) {
    removeGuardian(i);
    if (multisigThreshold > i) {
      setMultisigThreshold(i);
    }
  }

  function updateRelayers(
    idx: number,
    operation: (signingClient: SigningCosmWasmClient, userAddress: string, proxyWalletAddress: string, relayer: string) => Promise<void>
  ) {
    setUpdateRelayersError(null);
    setUpdateRelayersSuccess("");

    if (!checkRelayerValidationErrors()) {
      return;
    }

    if (!signingClient) {
      console.warn("signingClient is null, can't update SCW.");
      return;
    }

    setIsUpdating(true);
    operation(signingClient!, userAddress, proxyWalletAddress, relayers[idx])
      .then(() => {
        setUpdateRelayersSuccess("Smart Contract Wallet relayers have been updated successfully");
        fetchSCW();
        onRefresh?.();
      })
      .catch((err) => {
        console.error(err);
        setUpdateRelayersError(err);
      })
      .finally(() => setIsUpdating(false));
  }

  function updateLabel() {
    setUpdateLabelError(null);
    setUpdateLabelSuccess("");

    if (!checkValidationErrors()) {
      return;
    }

    if (!signingClient) {
      console.warn("signingClient is null, can't update SCW.");
      return;
    }

    setIsUpdating(true);
    updateProxyWalletLabel(signingClient!, userAddress, proxyWalletAddress, label)
      .then(() => {
        setUpdateLabelSuccess("Smart Contract Wallet label has been updated successfully");
        fetchSCW();
        onRefresh?.();
      })
      .catch((err) => {
        console.error(err);
        setUpdateLabelError(err);
      })
      .finally(() => setIsUpdating(false));
  }

  function handleAddRelayer(i: number) {
    updateRelayers(i, addRelayerToProxyWallet);
  }

  function handleRemoveRelayer(i: number) {
    if (!isOriginalRelayer(relayers[i])) {
      removeRelayer(i);
      return;
    }

    updateRelayers(i, removeRelayerFromProxyWallet);
  }

  function isOriginalRelayer(relayer: string, idx?: number) {
    if (idx) {
      return originalRelayers.indexOf(relayer) === idx;
    }

    return originalRelayers.includes(relayer);
  }

  if (loading) {
    return (
      <Loader>
        Fetching <b>Smart Contract Wallet</b> info...
      </Loader>
    );
  }

  if (loadingError) {
    return (
      <div className="mt-4 flex flex-col w-full max-w-xl">
        <AlertError>{loadingError.message}</AlertError>
      </div>
    );
  }

  if (isUpdating) {
    return (
      <Loader>
        We are updating your <b>Smart Contract Wallet</b>.<br />
        Please sign the transaction to proceed.
      </Loader>
    );
  }

  return (
    <>
      <h1 className="text-5xl font-bold mt-8">Manage your Smart Contract Wallet</h1>

      <h2 className="text-3xl font-bold my-5">Update your label</h2>
      <div className="flex w-full max-w-xl align-middle items-center mb-5">
        <Input
          placeholder={`Label (e.g. Personal Wallet, Business Wallet...)`}
          onChange={(event) => setLabel(event.target.value)}
          error={getValueValidationError("label")}
          value={label}
        />
      </div>

      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full mb-5"
        onClick={updateLabel}
        type="button"
      >
        UPDATE LABEL
      </button>

      {updateLabelError && (
        <div className="mt-4 mb-8 flex flex-col w-full max-w-xl">
          <AlertError>{updateLabelError.message}</AlertError>
        </div>
      )}
      {updateLabelSuccess && (
        <div className="mt-4 mb-8 flex flex-col w-full max-w-xl">
          <AlertSuccess>{updateLabelSuccess}</AlertSuccess>
        </div>
      )}

      <h2 className="text-3xl font-bold my-5">Update your guardians</h2>
      <h2 className="text-xl mb-5">
        Here you can modify the appointed guardians and relayers.
        <br />
        Optionally, you can also enable or disable multisig for this wallet.
      </h2>
      {guardians.map((address, i) => (
        <div className="flex w-full max-w-xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Guardian #${i + 1} address`}
            onChange={(event) => setGuardian(i, event.target.value)}
            error={getGuardianArrayValidationError("guardians", i)}
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
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-lg rounded-full"
        onClick={() => pushGuardian()}
        type="button"
      >
        ADD GUARDIAN
      </button>

      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={enableMultisig}
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

      <button
        className="mt-2 btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        type="submit"
        onClick={updateGuardians}
      >
        UPDATE GUARDIANS
      </button>

      {updateGuardiansError && (
        <div className="mt-4 flex flex-col w-full max-w-xl">
          <AlertError>{updateGuardiansError.message}</AlertError>
        </div>
      )}
      {updateGuardiansSuccess && (
        <div className="mt-4 flex flex-col w-full max-w-xl">
          <AlertSuccess>{updateGuardiansSuccess}</AlertSuccess>
        </div>
      )}

      <h2 className="text-3xl font-bold my-5">Update your relayers</h2>

      {relayers.map((address, i) => (
        <div className="flex w-full max-w-xl align-middle items-center space-x-3 mb-2" key={i}>
          <Input
            placeholder={`Relayer #${i + 1} address`}
            onChange={(event) => setRelayer(i, event.target.value)}
            error={getRelayerArrayValidationError("relayers", i)}
            value={address}
            disabled={isOriginalRelayer(relayers[i], i)}
          />
          {!isOriginalRelayer(relayers[i], i) && (
            <button
              className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
              type="button"
              onClick={() => handleAddRelayer(i)}
            >
              <IconCheckmark />
            </button>
          )}
          <button
            className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
            type="button"
            onClick={() => handleRemoveRelayer(i)}
          >
            <IconTrash />
          </button>
        </div>
      ))}
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full mb-5"
        onClick={() => pushRelayer()}
        type="button"
      >
        ADD RELAYER
      </button>

      {updateRelayersError && (
        <div className="mt-4 mb-8 flex flex-col w-full max-w-xl">
          <AlertError>{updateRelayersError.message}</AlertError>
        </div>
      )}
      {updateRelayersSuccess && (
        <div className="mt-4 mb-8 flex flex-col w-full max-w-xl">
          <AlertSuccess>{updateRelayersSuccess}</AlertSuccess>
        </div>
      )}
    </>
  );
}
