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
    return (json.data || json);
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