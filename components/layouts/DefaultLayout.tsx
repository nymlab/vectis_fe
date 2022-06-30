import React, { PropsWithChildren } from "react";
import Head from "next/head";
import { FaDesktop } from "react-icons/fa";

import Sidebar from "../Sidebar";

const DefaultLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="overflow-x-hidden min-h-screen min-w-full">
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <div className="hidden sm:flex sm:min-h-screen">
        <Sidebar />
        <main className="mx-auto flex flex-col flex-grow justify-center items-center">{children}</main>
      </div>

      <div className="flex flex-col justify-center items-center p-8 space-y-4 h-screen text-center bg-black/50 sm:hidden">
        <FaDesktop size={48} />
        <h1 className="text-2xl font-bold">Unsupported Viewport</h1>
        <p>
          Vectis is best viewed on the big screen.
          <br />
          Please open Vectis on your tablet or desktop browser.
        </p>
      </div>
    </div>
  );
};

export default DefaultLayout;
