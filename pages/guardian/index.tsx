import GuardianView from "components/GuardianView";
import WalletLoader from "components/WalletLoader";
import type { NextPage } from "next";
import Head from "next/head";

const Guardian: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vectis | Guardian</title>
      </Head>
      <WalletLoader>
        <GuardianView />
      </WalletLoader>
    </>
  );
};

export default Guardian;
