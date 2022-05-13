import type { NextPage } from "next";
import Link from "next/link";
import WalletLoader from "components/WalletLoader";
import { useSigningClient } from "contexts/cosmwasm";
import { env } from "env";
import { AlertError } from "components/Alert";
import { useVectis } from "contexts/vectis";

const Home: NextPage = () => {
  const { walletAddress } = useSigningClient();
  const { proxyWallets, error } = useVectis();

  return (
    <WalletLoader>
      <h1 className="text-6xl font-bold">Welcome to Vectis on {env.chainName}!</h1>

      <div className="mt-3 text-2xl">
        Your personal wallet address is: <pre className="font-mono break-all whitespace-pre-wrap">{walletAddress}</pre>
      </div>

      <div className="flex flex-col md:flex-row space-x-10">
        {proxyWallets.length > 0 ? (
          <div className="flex flex-wrap items-center justify-around mt-6 max-w-full sm:w-full">
            <Link href="/wallets" passHref>
              <a className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus">
                <h3 className="text-2xl font-bold">Manage your SCWs &rarr;</h3>
                <p className="mt-4 text-xl">View your Smart Contract Wallets and perform operations on them.</p>
              </a>
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-around mt-6 max-w-full sm:w-full">
            <Link href="/wallets/create" passHref>
              <a className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus">
                <h3 className="text-2xl font-bold">Create your SCW &rarr;</h3>
                <p className="mt-4 text-xl">Create your first Smart Contract Wallet to secure your funds.</p>
              </a>
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-around mt-6 max-w-full sm:w-full">
          <Link href="/guardian" passHref>
            <a className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus">
              <h3 className="text-2xl font-bold">Are you a guardian? &rarr;</h3>
              <p className="mt-4 text-xl">Provide the SCW address and perform guardian operations.</p>
            </a>
          </Link>
        </div>
      </div>

      {error && (
        <div className="my-5">
          <AlertError>
            Failed to retrieve your Smart Contract Wallets.
            <br />
            {error.message}
          </AlertError>
        </div>
      )}
    </WalletLoader>
  );
};

export default Home;
