import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vectis | Page not found</title>
      </Head>
      <h1 className="text-2xl">404 | Page not found</h1>
      <span className="my-10 text-xl hover:text-primary">
        <Link href="/" passHref>&larr; Go back to home</Link>
      </span>
    </>
  )
}

export default NotFound;
