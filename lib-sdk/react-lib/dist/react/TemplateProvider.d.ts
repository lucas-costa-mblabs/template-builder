import type { ReactNode } from "react";
import type { DirectoAiTracker } from "../core/tracker.js";
import type { Theme, DirectoAiTemplate, DirectoAiConfig, ReportSubmission } from "../core/types.js";
export interface TemplateProviderProps {
    theme: Theme;
    templates?: DirectoAiTemplate[];
    config?: DirectoAiConfig;
    tracker?: DirectoAiTracker;
    onReportSubmit?: (submission: ReportSubmission, dataContext?: Record<string, unknown>) => void | Promise<void>;
    children: ReactNode;
}
export declare function TemplateProvider({ theme, templates, config: providedConfig, tracker: providedTracker, onReportSubmit, children, }: TemplateProviderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TemplateProvider.d.ts.map