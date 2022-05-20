import { ReactNode } from "react";
import Head from "next/head";
import Nav from "./Nav";
import { env } from "env";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <Head>
        <title>{env.siteTitle}</title>
        <meta name="description" content="Vectis - Smart Contract Wallet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <main className="flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center">
        {children}
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        Vectis ©{" "}
        <a className="pl-1 link link-primary link-hover" href="https://www.nymlab.it" target="_blank">
          Nymlab
        </a>
        <span className="pl-1">{new Date().getFullYear()} | Powered by </span>
        <a className="pl-1 link link-primary link-hover" href="https://cosmos.network" target="_blank">
          Cosmos
        </a>
        <span className="pl-1"> and</span>
        <a className="pl-1 link link-primary link-hover" href="https://www.keplr.app" target="_blank">
          Keplr
        </a>
      </footer>
    </div>
  );
}
