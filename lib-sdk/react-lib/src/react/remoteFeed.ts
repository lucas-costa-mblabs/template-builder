import type { DirectoAiConfig, Post as PostType } from "../core/types.js";

type FetchLike = typeof fetch;

const remoteFeedCache = new Map<string, Promise<PostType[]>>();

const getRootBaseUrl = (config: DirectoAiConfig) =>
  (config.baseUrl || "https://api.directoai.com.br").replace(/\/$/, "");

const getCampaignBaseUrl = (config: DirectoAiConfig) =>
  (
    config.endpoints?.campaignBaseUrl || `${getRootBaseUrl(config)}/campaign`
  ).replace(/\/$/, "");

const getRemoteFeedCacheKey = (config: DirectoAiConfig) =>
  JSON.stringify({
    accountId: config.accountId,
    apiKey: config.apiKey,
    customerId: config.customerId,
    deviceId: config.deviceId,
    campaignBaseUrl: getCampaignBaseUrl(config),
  });

function getRemoteFeedUrl(config: DirectoAiConfig) {
  if (!config.accountId || !config.apiKey || !config.customerId) {
    throw new Error("Missing required data for remote feed request");
  }

  const url = new URL(`${getCampaignBaseUrl(config)}/api/v2/feed`);
  url.searchParams.set("customer", config.customerId);
  url.searchParams.set("accountId", config.accountId);
  url.searchParams.set("apiKey", config.apiKey);

  if (config.deviceId) {
    url.searchParams.set("deviceId", config.deviceId);
  }

  return url.toString();
}

function parseRemoteFeedPayload(payload: unknown): PostType[] {
  const parsed = payload as {
    data?: { feeds?: unknown } | unknown;
    feeds?: unknown;
  };
  const data = parsed.data as { feeds?: unknown } | unknown;
  const nestedFeeds = (data as { feeds?: unknown } | undefined)?.feeds;
  const feeds: unknown[] = Array.isArray(nestedFeeds)
    ? nestedFeeds
    : Array.isArray(data)
      ? data
      : Array.isArray(parsed.feeds)
        ? parsed.feeds
        : Array.isArray(payload)
          ? payload
          : [];

  return feeds.filter(Boolean) as PostType[];
}

export async function fetchRemoteFeed(
  config: DirectoAiConfig,
  fetchImpl: FetchLike = fetch,
): Promise<PostType[]> {
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

export function clearRemoteFeedCache(config?: DirectoAiConfig) {
  if (!config) {
    remoteFeedCache.clear();
    return;
  }

  remoteFeedCache.delete(getRemoteFeedCacheKey(config));
}

export function loadRemoteFeed(
  config: DirectoAiConfig,
  fetchImpl: FetchLike = fetch,
): Promise<PostType[]> {
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
