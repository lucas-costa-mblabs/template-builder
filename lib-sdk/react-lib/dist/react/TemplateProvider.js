import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useEffect, useState } from "react";
import { TemplateContext } from "./context.js";
import { DefaultDirectoAiTracker } from "../core/tracker.js";
import { ReportDialog } from "./ReportDialog.js";
export function TemplateProvider({ theme, templates = [], config, tracker: providedTracker, onReportSubmit, children, }) {
    const tracker = useMemo(() => {
        return providedTracker || new DefaultDirectoAiTracker(config);
    }, [providedTracker, config]);
    const [reportDialog, setReportDialog] = useState(null);
    // Warning para ajudar no debug do projeto real
    useEffect(() => {
        if (!templates || templates.length === 0) {
            console.warn("@directo/template-builder: Nenhum template fornecido ao TemplateProvider. Verifique se os dados da API foram carregados e mapeados corretamente.");
        }
        if (!theme || !theme.colors) {
            console.warn("@directo/template-builder: Nenhum tema (theme) fornecido ao TemplateProvider. Usando estilos default.");
        }
    }, [templates, theme]);
    useEffect(() => {
        const handleUiAction = (event) => {
            const customEvent = event;
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
        window.addEventListener("directo:ui-action", handleUiAction);
        return () => window.removeEventListener("directo:ui-action", handleUiAction);
    }, []);
    return (_jsxs(TemplateContext.Provider, { value: { theme, templates, config, tracker }, children: [children, reportDialog && (_jsx(ReportDialog, { action: reportDialog.action, tracker: tracker, dataContext: reportDialog.dataContext, onClose: () => setReportDialog(null), onSubmit: onReportSubmit }))] }));
}
//# sourceMappingURL=TemplateProvider.js.map