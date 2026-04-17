const remoteFeedCache = new Map();
const getRootBaseUrl = (config) => (config.baseUrl || "https://api.directoai.com.br").replace(/\/$/, "");
const getCampaignBaseUrl = (config) => (config.endpoints?.campaignBaseUrl || `${getRootBaseUrl(config)}/campaign`).replace(/\/$/, "");
const getRemoteFeedCacheKey = (config) => JSON.stringify({
    accountId: config.accountId,
    apiKey: config.apiKey,
    customerId: config.customerId,
    deviceId: config.deviceId,
    campaignBaseUrl: getCampaignBaseUrl(config),
});
function getRemoteFeedUrl(config) {
    if (!config.accountId || !config.apiKey || !config.customerId) {
        throw new Error("Missing required data for remote feed request");
    }
    const url = new URL(`${getCampaignBaseUrl(config)}/api/v1/feed`);
    url.searchParams.set("customer", config.customerId);
    url.searchParams.set("accountId", config.accountId);
    url.searchParams.set("apiKey", config.apiKey);
    if (config.deviceId) {
        url.searchParams.set("deviceId", config.deviceId);
    }
    return url.toString();
}
function parseRemoteFeedPayload(payload) {
    const parsed = payload;
    const data = parsed.data;
    const nestedFeeds = data?.feeds;
    const feeds = Array.isArray(nestedFeeds)
        ? nestedFeeds
        : Array.isArray(data)
            ? data
            : Array.isArray(parsed.feeds)
                ? parsed.feeds
                : Array.isArray(payload)
                    ? payload
                    : [];
    return feeds.filter(Boolean);
}
export async function fetchRemoteFeed(config, fetchImpl = fetch) {
    const response = await fetchImpl(getRemoteFeedUrl(config), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch remote feed: ${response.status}`);
    }
    const payload = await response.json();
    return parseRemoteFeedPayload(payload);
}
export function clearRemoteFeedCache(config) {
    if (!config) {
        remoteFeedCache.clear();
        return;
    }
    remoteFeedCache.delete(getRemoteFeedCacheKey(config));
}
export function loadRemoteFeed(config, fetchImpl = fetch) {
    const cacheKey = getRemoteFeedCacheKey(config);
    const existingPromise = remoteFeedCache.get(cacheKey);
    if (existingPromise) {
        return existingPromise;
    }
    const request = fetchRemoteFeed(config, fetchImpl).catch((error) => {
        remoteFeedCache.delete(cacheKey);
        throw error;
    });
    remoteFeedCache.set(cacheKey, request);
    return request;
}
//# sourceMappingURL=remoteFeed.js.map