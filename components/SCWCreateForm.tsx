import { useSigningClient } from "contexts/cosmwasm";
import { env } from "env";
import { useArrayState } from "hooks/useArrayState";
import { useBalance } from "hooks/useBalance";
import { useEffect, useState } from "react";
import { createVectisWallet, getVectisWalletAddress } from "services/vectis";
import { convertFromMicroDenom } from "util/conversion";
import { AlertError, AlertSuccess } from "./Alert";
import { Input } from "./Input";
import Loader from "./Loader";

export default function SCWCreateForm() {
  const { walletAddress, signingClient } = useSigningClient();
  const { balance } = useBalance();

  // Form state hooks
  const {
    array: guardians,
    setItem: setGuardian,
    pushItem: pushGuardian,
    removeItem: removeGuardian,
  } = useArrayState("");
  const {
    array: relayers,
    setItem: setRelayer,
    pushItem: pushRelayer,
    removeItem: removeRelayer,
  } = useArrayState("");
  const [proxyInitialFunds, setProxyInitialFunds] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Generic state hooks
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Update validation errors
    const ve = { ...validationErrors };

    // Errors related to initial funds
    if (proxyInitialFunds && parseFloat(proxyInitialFunds) > 0 && parseFloat(proxyInitialFunds) < parseFloat(balance)) {
      delete ve["proxyInitialFunds"];
    }

    // Errors related to guardians/relayers
    Object.keys(validationErrors).filter(k => k !== "proxyInitialFunds").forEach(key => {
      const [ k, i ] = key.split(".");
      ((k === "guardians" && guardians[i]) || (k === "relayers" && relayers[i])) && delete ve[key];
    });

    setValidationErrors(ve);
  }, [proxyInitialFunds, guardians, relayers]);

  function createSCW() {
    console.log({ guardians, relayers, proxyInitialFunds });
    const ve = {};

    // Check validation errors
    !proxyInitialFunds && (ve["proxyInitialFunds"] = "This field is mandatory.");
    parseFloat(proxyInitialFunds) < 0 && (ve["proxyInitialFunds"] = "This field must be >= 0.");
    parseFloat(proxyInitialFunds) > parseFloat(balance) && (ve["proxyInitialFunds"] = `You don't have enough ${convertFromMicroDenom(env.stakingDenom)}.`);

    // Guardians/Relayers addresses are mandatory
    guardians.forEach((g, i) => !g && (ve[`guardians.${i}`] = "This field is mandatory."));
    relayers.forEach((r, i) => !r && (ve[`relayers.${i}`] = "This field is mandatory."));

    // Guardians/Relayers addresses must not be equal to your own address
    guardians.forEach((g, i) => g === walletAddress && (ve[`guardians.${i}`] = "You can't become your own guardian."));
    relayers.forEach((r, i) => r === walletAddress && (ve[`relayers.${i}`] = "You can't become your own relayer."));

    // End of validation error checking
    console.log("Validation errors: ", ve);
    setValidationErrors(ve);
    if (Object.keys(ve).length > 0) {
      // There are some validation errors, don't proceed
      return;
    }

    if (!signingClient) {
      console.warn("signingClient is null, can't create SCW.");
      return;
    }

    // Create Smart Contract Wallet
    setIsCreating(true);
    createVectisWallet(signingClient!, walletAddress, guardians, relayers, parseFloat(proxyInitialFunds))
      .then(() => getVectisWalletAddress())
      .then(address => {
        console.log("Wallet address: ", address);
        setSuccess("Your Smart Contract Wallet has been created successfully.");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to create the proxy wallet. Check the console for details.");
      })
      .finally(() => setIsCreating(false));
  }

  function getValueValidationError(key: string): string | undefined {
    return validationErrors[key];
  }

  function getArrayValidationError(key: string, idx: number): string {
    const k = Object.keys(validationErrors).filter(ve => ve.includes(`${key}.`)).find(ve => parseInt(ve.split(".")[1]) === idx);
    if (!k) {
      return "";
    }

    return validationErrors[k];
  }

  if (success) {
    return (
      <div className="mt-4 flex flex-col w-full max-w-xl">
        <AlertSuccess>
          {success}
        </AlertSuccess>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="flex flex-col justify-center items-center my-5">
        <p className="mb-5 text-2xl">We are creating your new <b>Smart Contract Wallet</b>.<br/>Please sign the transaction to proceed.</p>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-col w-full max-w-xl">
        {error && (
          <AlertError>
            {error}
          </AlertError>
        )}
      </div>

      <h1 className="text-5xl font-bold my-8">
        Create your Smart Contract Wallet
      </h1>

      <h2 className="text-3xl font-bold">1. Choose your guardians</h2>
      {guardians.map((address, i) => (
        <div
          className="flex w-full max-w-xl align-middle items-center space-x-3"
          key={i}
        >
          <Input placeholder={`Guardian #${i + 1} address`} onChange={(event) => setGuardian(i, event.target.value)} error={getArrayValidationError("guardians", i)} value={address}/>
          {
            guardians.length > 1 && (
              <button
                className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
                type="submit"
                onClick={() => removeGuardian(i)}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0" fill="none" width="24" height="24" />
                  <g>
                    <path fill="#FFF" d="M6.187 8h11.625l-.695 11.125C17.05 20.18 16.177 21 15.12 21H8.88c-1.057 0-1.93-.82-1.997-1.875L6.187 8zM19 5v2H5V5h3V4c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v1h3zm-9 0h4V4h-4v1z" />
                  </g>
                </svg>
              </button>
            )
          }
        </div>
      ))}
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        onClick={() => pushGuardian()}
      >
        ADD GUARDIAN
      </button>

      <h2 className="text-3xl font-bold my-5">2. Choose your relayers</h2>
      {relayers.map((address, i) => (
        <div className="flex w-full max-w-xl align-middle items-center space-x-3" key={i}>
          <Input placeholder={`Relayer #${i + 1} address`} onChange={(event) => setRelayer(i, event.target.value)} error={getArrayValidationError("relayers", i)} value={address}/>
          {
            relayers.length > 1 && (
              <button
                className="btn btn-primary btn-circle btn-xl font-semibold hover:text-base-100 text-xl"
                type="submit"
                onClick={() => removeRelayer(i)}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0" fill="none" width="24" height="24" />
                  <g>
                    <path fill="#FFF" d="M6.187 8h11.625l-.695 11.125C17.05 20.18 16.177 21 15.12 21H8.88c-1.057 0-1.93-.82-1.997-1.875L6.187 8zM19 5v2H5V5h3V4c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v1h3zm-9 0h4V4h-4v1z" />
                  </g>
                </svg>
              </button>
            )
          }
        </div>
      ))}
      <button
        className="btn btn-primary btn-md font-semibold hover:text-base-100 text-xl rounded-full"
        type="submit"
        onClick={() => pushRelayer()}
      >
        ADD RELAYER
      </button>

      <h2 className="text-3xl font-bold my-5">3. Create your wallet</h2>
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
          {
            getValueValidationError("proxyInitialFunds") &&
              <span className="pl-6 text-error font-bold">
                {getValueValidationError("proxyInitialFunds")}
              </span>
          }
        </div>
        <button
          className="mt-4 md:mt-0 btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl rounded-full flex-grow"
          type="submit"
          onClick={createSCW}
        >
          CREATE
        </button>
      </div>
    </>
  );
}
