import type {
  DirectoAiConfig,
  DirectoAiTemplate,
  Theme,
} from "../core/types.js";

export interface RemoteBootstrapData {
  theme: Theme;
  templates: DirectoAiTemplate[];
}

type FetchLike = typeof fetch;

const bootstrapCache = new Map<string, Promise<RemoteBootstrapData>>();

const getRootBaseUrl = (config: DirectoAiConfig) =>
  (config.baseUrl || "https://api.directoai.com.br").replace(/\/$/, "");

const getTemplateBaseUrl = (config: DirectoAiConfig) =>
  (
    config.endpoints?.templateBaseUrl || `${getRootBaseUrl(config)}/template`
  ).replace(/\/$/, "");

const getAccountBaseUrl = (config: DirectoAiConfig) =>
  (
    config.endpoints?.accountBaseUrl || `${getRootBaseUrl(config)}/account`
  ).replace(/\/$/, "");

const getBootstrapCacheKey = (config: DirectoAiConfig) =>
  JSON.stringify({
    accountId: config.accountId,
    templateBaseUrl: getTemplateBaseUrl(config),
    accountBaseUrl: getAccountBaseUrl(config),
  });

export async function fetchCvdTemplates(
  config: DirectoAiConfig,
  fetchImpl: FetchLike = fetch,
): Promise<DirectoAiTemplate[]> {
  const url = `${getTemplateBaseUrl(config)}/api/v1/templates/account/${encodeURIComponent(config.accountId)}`;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch templates: ${response.statusText}`);
  }

  const json = await response.json();
  return (json.data || json) as DirectoAiTemplate[];
}

export async function fetchCvdTheme(
  config: DirectoAiConfig,
  fetchImpl: FetchLike = fetch,
): Promise<Theme> {
  const url = `${getAccountBaseUrl(config)}/api/v1/theme/account/${encodeURIComponent(config.accountId)}`;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch theme: ${response.statusText}`);
  }

  const json = await response.json();
  return (json.data || json) as Theme;
}

export function clearRemoteBootstrapCache(config?: DirectoAiConfig) {
  if (!config) {
    bootstrapCache.clear();
    return;
  }

  bootstrapCache.delete(getBootstrapCacheKey(config));
}

export function loadRemoteBootstrapData(
  config: DirectoAiConfig,
  fetchImpl: FetchLike = fetch,
): Promise<RemoteBootstrapData> {
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
