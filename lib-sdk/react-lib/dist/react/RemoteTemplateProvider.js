import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { loadRemoteBootstrapData, } from "./bootstrap.js";
import { TemplateProvider } from "./TemplateProvider.js";
export function RemoteTemplateProvider({ config, tracker, onReportSubmit, children, loadingFallback = null, errorFallback, initialTheme, initialTemplates, }) {
    const initialData = useMemo(() => {
        if (!initialTheme || !initialTemplates) {
            return null;
        }
        return {
            theme: initialTheme,
            templates: initialTemplates,
        };
    }, [initialTheme, initialTemplates]);
    const [bootstrapData, setBootstrapData] = useState(initialData);
    const [error, setError] = useState(null);
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
                setError(caughtError instanceof Error
                    ? caughtError
                    : new Error(String(caughtError)));
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
            return _jsx(_Fragment, { children: errorFallback(error, retry) });
        }
        return _jsx(_Fragment, { children: errorFallback ?? null });
    }
    if (!bootstrapData) {
        return _jsx(_Fragment, { children: loadingFallback });
    }
    return (_jsx(TemplateProvider, { theme: bootstrapData.theme, templates: bootstrapData.templates, config: config, tracker: tracker, onReportSubmit: onReportSubmit, children: children }));
}
//# sourceMappingURL=RemoteTemplateProvider.js.map