import "styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "components/Layout";
import { SigningCosmWasmProvider } from "contexts/cosmwasm";
import { VectisProvider } from "contexts/vectis";
import { Toaster } from "react-hot-toast";
import RootModal from "components/modals/RootModal";
import TranslationsProvider from "contexts/TranslationsContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function VectisApp({ Component, pageProps }: AppProps) {
  const [debug, setDebug] = useState(false);
  const { push: goToPage } = useRouter();

  useEffect(() => {
    window.setDebug = setDebug;
    if (location.hostname === "vectis.nymlab.it") {
      goToPage("/coming-soon");
    }
  }, []);

  return (
    <TranslationsProvider debug={debug}>
      <SigningCosmWasmProvider>
        <VectisProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="top-center" reverseOrder={false} />
          </Layout>
          <RootModal />
        </VectisProvider>
      </SigningCosmWasmProvider>
    </TranslationsProvider>
  );
}
export default VectisApp;
