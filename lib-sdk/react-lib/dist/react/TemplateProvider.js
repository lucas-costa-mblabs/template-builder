import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useEffect, useState } from "react";
import { TemplateContext } from "./context.js";
import { DefaultDirectoAiTracker, NoopDirectoAiTracker } from "../core/tracker.js";
import { ReportDialog } from "./ReportDialog.js";
import { ProfileViewModal } from "./ProfileViewModal.js";
const EMPTY_CONFIG = {
    accountId: "",
    apiKey: "",
};
export function TemplateProvider({ theme, templates = [], config: providedConfig, tracker: providedTracker, onReportSubmit, children, }) {
    const config = useMemo(() => providedConfig || EMPTY_CONFIG, [providedConfig]);
    const tracker = useMemo(() => {
        if (providedTracker) {
            return providedTracker;
        }
        if (providedConfig) {
            return new DefaultDirectoAiTracker(providedConfig);
        }
        return new NoopDirectoAiTracker();
    }, [providedTracker, providedConfig]);
    const [reportDialog, setReportDialog] = useState(null);
    const [profileView, setProfileView] = useState(null);
    const [followedAccounts, setFollowedAccounts] = useState(() => new Set());
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
            if (actionName === "open_profile") {
                const post = customEvent.detail?.dataContext?.post;
                if (post) {
                    setProfileView({ post });
                }
                return;
            }
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
    const getIsFollowing = (profileAccountId) => followedAccounts.has(profileAccountId);
    const setIsFollowing = (profileAccountId, isFollowing) => {
        setFollowedAccounts((prev) => {
            const next = new Set(prev);
            if (isFollowing) {
                next.add(profileAccountId);
            }
            else {
                next.delete(profileAccountId);
            }
            return next;
        });
    };
    return (_jsxs(TemplateContext.Provider, { value: {
            theme,
            templates,
            config,
            tracker,
            getIsFollowing,
            setIsFollowing,
        }, children: [children, reportDialog && (_jsx(ReportDialog, { action: reportDialog.action, tracker: tracker, dataContext: reportDialog.dataContext, onClose: () => setReportDialog(null), onSubmit: onReportSubmit })), profileView && (_jsx(ProfileViewModal, { initialPost: profileView.post, onClose: () => setProfileView(null) }))] }));
}
//# sourceMappingURL=TemplateProvider.js.map