import "styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "components/Layout";
import { SigningCosmWasmProvider } from "contexts/cosmwasm";
import { VectisProvider } from "contexts/vectis";
import { Toaster } from "react-hot-toast";
import RootModal from "components/modals/RootModal";
import TranslationsProvider from "contexts/TranslationsContext";
import { useEffect, useState } from "react";

function VectisApp({ Component, pageProps }: AppProps) {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    window.setDebug = setDebug;
  }, []);

  return (
    <SigningCosmWasmProvider>
      <VectisProvider>
        <TranslationsProvider debug={debug}>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="top-center" reverseOrder={false} />
          </Layout>
          <RootModal />
        </TranslationsProvider>
      </VectisProvider>
    </SigningCosmWasmProvider>
  );
}
export default VectisApp;
