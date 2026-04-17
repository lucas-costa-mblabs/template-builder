import type { DirectoAiConfig, Post as PostType } from "../core/types.js";
type FetchLike = typeof fetch;
export declare function fetchRemoteFeed(config: DirectoAiConfig, fetchImpl?: FetchLike): Promise<PostType[]>;
export declare function clearRemoteFeedCache(config?: DirectoAiConfig): void;
export declare function loadRemoteFeed(config: DirectoAiConfig, fetchImpl?: FetchLike): Promise<PostType[]>;
export {};
//# sourceMappingURL=remoteFeed.d.ts.map