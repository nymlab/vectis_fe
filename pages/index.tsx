import type { NextPage } from "next";
import Link from "next/link";
import { AlertError } from "components/Alert";
import { useVectis } from "contexts/vectis";
import { useCosm } from "contexts/cosmwasm";
import Head from "next/head";
import { Anchor } from "components/Anchor";

const Home: NextPage = () => {
  const { proxyWallets, error } = useVectis();
  const { isReady } = useCosm();

  return (
    <>
      <Head>
        <title>Vectis</title>
      </Head>
      <div className="flex flex-col justify-center items-center max-w-[80%]">
        <h1 className="text-6xl font-bold">Welcome to Vectis!</h1>
        <h2 className="text-xl my-5 text-center">
          A smart contract wallet project to help user manage their funds by allowing for social recovery and guardianship, whilst preserving
          user control. <br /> For more information, please see our{" "}
          <Anchor className="hover:text-primary" href="https://github.com/nymlab/vectis/#overview">
            documentation
          </Anchor>
          .
        </h2>
        {!isReady && <div className="mt-3 text-2xl">It's necessary to connect your wallet in order to interact with Vectis dApp</div>}
        {isReady && (
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
        )}

        {error && (
          <div className="my-5">
            <AlertError>
              Failed to retrieve your Smart Contract Wallets.
              <br />
              {error.message}
            </AlertError>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
