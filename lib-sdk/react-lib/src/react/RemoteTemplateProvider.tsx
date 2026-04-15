import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { DirectoAiTracker } from "../core/tracker.js";
import type {
  DirectoAiConfig,
  DirectoAiTemplate,
  ReportSubmission,
  Theme,
} from "../core/types.js";
import {
  loadRemoteBootstrapData,
  type RemoteBootstrapData,
} from "./bootstrap.js";
import { TemplateProvider } from "./TemplateProvider.js";

type ErrorFallback =
  | ReactNode
  | ((error: Error, retry: () => void) => ReactNode);

export interface RemoteTemplateProviderProps {
  config: DirectoAiConfig;
  tracker?: DirectoAiTracker;
  onReportSubmit?: (
    submission: ReportSubmission,
    dataContext?: Record<string, unknown>,
  ) => void | Promise<void>;
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ErrorFallback;
  initialTheme?: Theme;
  initialTemplates?: DirectoAiTemplate[];
}

export function RemoteTemplateProvider({
  config,
  tracker,
  onReportSubmit,
  children,
  loadingFallback = null,
  errorFallback,
  initialTheme,
  initialTemplates,
}: RemoteTemplateProviderProps) {
  const initialData = useMemo<RemoteBootstrapData | null>(() => {
    if (!initialTheme || !initialTemplates) {
      return null;
    }

    return {
      theme: initialTheme,
      templates: initialTemplates,
    };
  }, [initialTheme, initialTemplates]);

  const [bootstrapData, setBootstrapData] = useState<RemoteBootstrapData | null>(
    initialData,
  );
  const [error, setError] = useState<Error | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (initialData) {
      setBootstrapData(initialData);
      return;
    }

    let cancelled = false;
    setError(null);

    loadRemoteBootstrapData(config)
      .then((data) => {
        if (!cancelled) {
          setBootstrapData(data);
        }
      })
      .catch((caughtError) => {
        if (!cancelled) {
          setBootstrapData(null);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error(String(caughtError)),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config, initialData, requestVersion]);

  const retry = () => {
    setError(null);
    setRequestVersion((current) => current + 1);
  };

  if (error) {
    if (typeof errorFallback === "function") {
      return <>{errorFallback(error, retry)}</>;
    }

    return <>{errorFallback ?? null}</>;
  }

  if (!bootstrapData) {
    return <>{loadingFallback}</>;
  }

  return (
    <TemplateProvider
      theme={bootstrapData.theme}
      templates={bootstrapData.templates}
      config={config}
      tracker={tracker}
      onReportSubmit={onReportSubmit}
    >
      {children}
    </TemplateProvider>
  );
}
