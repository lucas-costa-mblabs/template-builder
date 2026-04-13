import type { ReactNode } from "react";
import { useMemo, useEffect, useState } from "react";
import { TemplateContext } from "./context.js";
import { DefaultDirectoAiTracker } from "../core/tracker.js";
import type { DirectoAiTracker } from "../core/tracker.js";
import type {
  Theme,
  DirectoAiTemplate,
  DirectoAiConfig,
  ComponentAction,
  ReportSubmission,
} from "../core/types.js";
import { ReportDialog } from "./ReportDialog.js";

interface ReportDialogState {
  action: ComponentAction;
  dataContext?: Record<string, unknown>;
}

export interface TemplateProviderProps {
  theme: Theme;
  templates?: DirectoAiTemplate[];
  config: DirectoAiConfig;
  tracker?: DirectoAiTracker;
  onReportSubmit?: (
    submission: ReportSubmission,
    dataContext?: Record<string, unknown>,
  ) => void | Promise<void>;
  children: ReactNode;
}

export function TemplateProvider({
  theme,
  templates = [],
  config,
  tracker: providedTracker,
  onReportSubmit,
  children,
}: TemplateProviderProps) {
  const tracker = useMemo(() => {
    return providedTracker || new DefaultDirectoAiTracker(config);
  }, [providedTracker, config]);
  const [reportDialog, setReportDialog] = useState<ReportDialogState | null>(
    null,
  );

  // Warning para ajudar no debug do projeto real
  useEffect(() => {
    if (!templates || templates.length === 0) {
      console.warn(
        "@directo/template-builder: Nenhum template fornecido ao TemplateProvider. Verifique se os dados da API foram carregados e mapeados corretamente.",
      );
    }
    if (!theme || !theme.colors) {
      console.warn(
        "@directo/template-builder: Nenhum tema (theme) fornecido ao TemplateProvider. Usando estilos default.",
      );
    }
  }, [templates, theme]);

  useEffect(() => {
    const handleUiAction = (event: Event) => {
      const customEvent = event as CustomEvent<{
        actionName?: string;
        dataContext?: Record<string, unknown>;
        action?: ComponentAction;
      }>;
      const actionName = customEvent.detail?.actionName?.trim().toLowerCase();

      if (actionName !== "report" && actionName !== "denunciar") {
        return;
      }

      setReportDialog({
        action: customEvent.detail?.action || {
          type: "UI_ACTION",
          payload: {
            actionName: customEvent.detail?.actionName || "report",
          },
        },
        dataContext: customEvent.detail?.dataContext,
      });
    };

    window.addEventListener("directo:ui-action", handleUiAction as EventListener);
    return () =>
      window.removeEventListener(
        "directo:ui-action",
        handleUiAction as EventListener,
      );
  }, []);

  return (
    <TemplateContext.Provider value={{ theme, templates, config, tracker }}>
      {children}
      {reportDialog && (
        <ReportDialog
          action={reportDialog.action}
          tracker={tracker}
          dataContext={reportDialog.dataContext}
          onClose={() => setReportDialog(null)}
          onSubmit={onReportSubmit}
        />
      )}
    </TemplateContext.Provider>
  );
}
