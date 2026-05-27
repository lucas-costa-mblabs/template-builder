const DEFAULT_THEME = {
    colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#f59e0b",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
        info: "#3b82f6",
        white: "#ffffff",
        black: "#000000",
        "gray-50": "#f9fafb",
        "gray-100": "#f3f4f6",
        "gray-200": "#e5e7eb",
        "gray-300": "#d1d5db",
        "gray-400": "#9ca3af",
        "gray-500": "#6b7280",
        "gray-600": "#4b5563",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "gray-900": "#111827",
        "gray-950": "#030712",
        "primary-hover": "#4f46e5",
        "primary-active": "#4338ca",
        "secondary-hover": "#db2777",
        "secondary-active": "#be185d",
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
    },
    borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
    },
    typography: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "24px",
        xxl: "32px",
    },
};
function apiThemeToTheme(apiTheme) {
    if (!apiTheme)
        return DEFAULT_THEME;
    return {
        ...DEFAULT_THEME,
        colors: {
            ...DEFAULT_THEME.colors,
            ...(apiTheme.primaryColor && { primary: apiTheme.primaryColor }),
            ...(apiTheme.secondaryColor && { secondary: apiTheme.secondaryColor }),
        },
    };
}
const bootstrapCache = new Map();
const getRootBaseUrl = (config) => (config.baseUrl || "https://api.directoai.com.br").replace(/\/$/, "");
const getTemplateBaseUrl = (config) => (config.endpoints?.templateBaseUrl || `${getRootBaseUrl(config)}/template`).replace(/\/$/, "");
const getAccountBaseUrl = (config) => (config.endpoints?.accountBaseUrl || `${getRootBaseUrl(config)}/account`).replace(/\/$/, "");
const getBootstrapCacheKey = (config) => JSON.stringify({
    accountId: config.accountId,
    templateBaseUrl: getTemplateBaseUrl(config),
    accountBaseUrl: getAccountBaseUrl(config),
});
export async function fetchCvdTemplates(config, fetchImpl = fetch) {
    const url = `${getTemplateBaseUrl(config)}/api/v1/templates/account/${encodeURIComponent(config.accountId)}`;
    const response = await fetchImpl(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }
    const json = await response.json();
    return (json.data || json);
}
export async function fetchCvdTheme(config, fetchImpl = fetch) {
    const url = `${getAccountBaseUrl(config)}/api/v1/theme/account/${encodeURIComponent(config.accountId)}`;
    const response = await fetchImpl(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch theme: ${response.statusText}`);
    }
    const json = await response.json();
    return apiThemeToTheme(json.data || json);
}
export function clearRemoteBootstrapCache(config) {
    if (!config) {
        bootstrapCache.clear();
        return;
    }
    bootstrapCache.delete(getBootstrapCacheKey(config));
}
export function loadRemoteBootstrapData(config, fetchImpl = fetch) {
    const cacheKey = getBootstrapCacheKey(config);
    const existingPromise = bootstrapCache.get(cacheKey);
    if (existingPromise) {
        return existingPromise;
    }
    const request = Promise.all([
        fetchCvdTheme(config, fetchImpl),
        fetchCvdTemplates(config, fetchImpl),
    ])
        .then(([theme, templates]) => ({
        theme,
        templates,
    }))
        .catch((error) => {
        bootstrapCache.delete(cacheKey);
        throw error;
    });
    bootstrapCache.set(cacheKey, request);
    return request;
}
//# sourceMappingURL=bootstrap.js.map