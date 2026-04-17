import type { DirectoAiConfig, Post as PostType } from "../../core/types.js";
export interface UseRemoteFeedOptions {
    config?: DirectoAiConfig;
    initialPosts?: PostType[];
    enabled?: boolean;
}
export interface UseRemoteFeedResult {
    posts: PostType[];
    isLoading: boolean;
    error: Error | null;
    reload: () => void;
}
export declare function useRemoteFeed({ config: providedConfig, initialPosts, enabled, }?: UseRemoteFeedOptions): UseRemoteFeedResult;
//# sourceMappingURL=useRemoteFeed.d.ts.map