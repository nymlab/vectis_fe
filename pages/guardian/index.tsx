import GuardianView from "components/GuardianView";
import type { NextPage } from "next";
import Head from "next/head";

const Guardian: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vectis | Guardian</title>
      </Head>
      <GuardianView />
    </>
  );
};

export default Guardian;
