/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { useSigningClient } from "contexts/cosmwasm";
import Loader from "./Loader";
import { AlertError } from "./Alert";

type WalletLoaderProps = {
  children: ReactNode;
  loading?: boolean;
};

export default function WalletLoader({
  children,
  loading = false,
}: WalletLoaderProps) {
  const {
    walletAddress,
    loading: clientLoading,
    error,
    connectWallet,
  } = useSigningClient();

  useEffect(() => {
    if (!!localStorage.getItem("walletAddress")) {
      connectToWallet();
    }

    window.addEventListener("keplr_keystorechange", () => connectToWallet());

    return () =>
      window.removeEventListener("keplr_keystorechange", () =>
        connectToWallet()
      );
  }, []);

  function connectToWallet() {
    connectWallet();
  }

  if (loading || clientLoading) {
    return (
      <Loader>
        Connecting to your <b>Keplr Wallet</b>...
      </Loader>
    );
  }

  if (walletAddress === "") {
    return (
      <div className="max-w-full">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a
            className="link link-primary link-hover"
            href="https://github.com/nymlab/vectis"
          >
            Vectis
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by installing{" "}
          <a
            className="pl-1 link link-primary link-hover"
            href="https://keplr.app/"
          >
            Keplr wallet
          </a>
        </p>

        <div className="flex flex-wrap items-center justify-around md:max-w-4xl mt-6 sm:w-full">
          <button
            className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus"
            onClick={connectToWallet}
          >
            <h3 className="text-2xl font-bold">Connect your wallet &rarr;</h3>
            <p className="mt-4 text-xl">
              Get your Keplr wallet connected now and start using it with
              Vectis.
            </p>
          </button>
        </div>

        {error && (
          <div className="my-5">
            <AlertError>Error! {error.message}</AlertError>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5">
        <AlertError>Error! {error.message}</AlertError>
      </div>
    );
  }

  return <>{children}</>;
}
