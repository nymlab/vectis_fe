import { useCallback } from "react";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "contexts/TranslationsContext";

const useErrorModal = () => {
  const { push: goToPage } = useRouter();
  const { language } = useTranslations();

  const onLoad = useCallback(() => {
    const closeButton = window.document.querySelector(".sentry-error-embed .close");
    if (!closeButton) return;
    const handlerOnClose = () => {
      goToPage("/");
      closeButton.removeEventListener("click", handlerOnClose);
    };
    closeButton.addEventListener("click", handlerOnClose);
  }, []);

  const useSentryModal = useCallback((err: unknown) => {
    Sentry.captureException(err);
    Sentry.showReportDialog({
      onLoad,
      lang: language,
    });
  }, []);

  return { showError: useSentryModal };
};

export default useErrorModal;
