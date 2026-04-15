import type { ReactNode } from "react";
import type { DirectoAiTracker } from "../core/tracker.js";
import type { DirectoAiConfig, DirectoAiTemplate, ReportSubmission, Theme } from "../core/types.js";
type ErrorFallback = ReactNode | ((error: Error, retry: () => void) => ReactNode);
export interface RemoteTemplateProviderProps {
    config: DirectoAiConfig;
    tracker?: DirectoAiTracker;
    onReportSubmit?: (submission: ReportSubmission, dataContext?: Record<string, unknown>) => void | Promise<void>;
    children: ReactNode;
    loadingFallback?: ReactNode;
    errorFallback?: ErrorFallback;
    initialTheme?: Theme;
    initialTemplates?: DirectoAiTemplate[];
}
export declare function RemoteTemplateProvider({ config, tracker, onReportSubmit, children, loadingFallback, errorFallback, initialTheme, initialTemplates, }: RemoteTemplateProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RemoteTemplateProvider.d.ts.map