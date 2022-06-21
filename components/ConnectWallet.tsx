import { useCosm } from "contexts/cosmwasm";
import { ReactNode } from "react";
import { AlertError } from "./Alert";
import Loader from "./Loader";

type Props = {
  children: ReactNode;
};

const ConnectWallet: React.FC<Props> = ({ children }) => {
  const { isReady, isLoading, connectWallet, error } = useCosm();

  if (isLoading) {
    return (
      <Loader>
        Connecting to your <b>Keplr Wallet</b>...
      </Loader>
    );
  }

  if (!isReady) {
    return (
      <div className="max-w-full">
        <p className="mt-3 text-2xl text-center">
          You need to connect your
          <a className="pl-1 link link-primary link-hover" href="https://keplr.app/">
            Keplr wallet
          </a>
        </p>

        <div className="flex flex-wrap items-center justify-around md:max-w-4xl mt-6 sm:w-full">
          <button
            className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus"
            onClick={connectWallet}
          >
            <h3 className="text-2xl font-bold">Connect your wallet &rarr;</h3>
            <p className="mt-4 text-xl">Get your Keplr wallet connected now and start using it with Vectis.</p>
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

  return <>{children}</>;
};

export default ConnectWallet;
