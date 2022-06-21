import ConnectWallet from "components/ConnectWallet";
import GuardianView from "components/GuardianView";
import type { NextPage } from "next";
import Head from "next/head";

const Guardian: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vectis | Guardian</title>
      </Head>

      <ConnectWallet>
        <GuardianView />
      </ConnectWallet>
    </>
  );
};

export default Guardian;
