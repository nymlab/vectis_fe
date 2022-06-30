import "styles/globals.css";
import type { AppProps } from "next/app";
import { SigningCosmWasmProvider } from "contexts/cosmwasm";
import { VectisProvider } from "contexts/vectis";
import { Toaster } from "react-hot-toast";
import RootModal from "components/modals/RootModal";
import TranslationsProvider from "contexts/TranslationsContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextComponentType, NextPageContext } from "next";
import Layouts from "components/layouts";
import DefaultLayout from "components/layouts/DefaultLayout";

interface AppPropsExtended extends AppProps {
  Component: NextComponentType<NextPageContext, any, {}> & { layout?: string };
}

function VectisApp({ Component, pageProps }: AppPropsExtended) {
  const [debug, setDebug] = useState(false);
  const { push: goToPage } = useRouter();

  useEffect(() => {
    window.setDebug = setDebug;
    if (location.hostname === "vectis.nymlab.it") {
      goToPage("/coming-soon");
    }
  }, []);

  const Layout = Layouts[Component.layout as keyof typeof Layouts] || DefaultLayout;

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
