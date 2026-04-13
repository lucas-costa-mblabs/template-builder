import type { DirectoAiConfig, Post } from "./types.js";
export interface DirectoAiTracker {
    trackEvent(name: string, data: Record<string, any>): Promise<void>;
    trackImpression(contentId: string, data: Record<string, any>): Promise<void>;
    trackViewTime(contentId: string, seconds: number, data: Record<string, any>): Promise<void>;
    toggleLike(contentId: string, campaignId?: string): Promise<void>;
    fetchProfileFeed(profileAccountId: string): Promise<Post[]>;
    followAccount(profileAccountId: string): Promise<void>;
    unfollowAccount(profileAccountId: string): Promise<void>;
    toggleFollowAccount(profileAccountId: string, isFollowing: boolean): Promise<void>;
    addFavorite(contentId: string, campaignId?: string): Promise<void>;
    removeFavorite(contentId: string): Promise<void>;
    toggleFavorite(contentId: string, campaignId: string | undefined, isFavorited: boolean): Promise<void>;
    reportContent(contentId: string, reportType: string, description?: string): Promise<void>;
    shareContent(contentData: any): Promise<void>;
}
export declare class DefaultDirectoAiTracker implements DirectoAiTracker {
    private config;
    constructor(config: DirectoAiConfig);
    private get baseUrl();
    private stringToUTF16LE;
    private computeSHA256;
    private sendToGA;
    private sendMessageQueue;
    trackEvent(name: string, data: Record<string, any>): Promise<void>;
    trackImpression(contentId: string, data: Record<string, any>): Promise<void>;
    trackViewTime(contentId: string, seconds: number, data: Record<string, any>): Promise<void>;
    toggleLike(contentId: string, campaignId?: string): Promise<void>;
    fetchProfileFeed(profileAccountId: string): Promise<Post[]>;
    followAccount(profileAccountId: string): Promise<void>;
    unfollowAccount(profileAccountId: string): Promise<void>;
    toggleFollowAccount(profileAccountId: string, isFollowing: boolean): Promise<void>;
    addFavorite(contentId: string, campaignId?: string): Promise<void>;
    removeFavorite(contentId: string): Promise<void>;
    toggleFavorite(contentId: string, campaignId: string | undefined, isFavorited: boolean): Promise<void>;
    reportContent(contentId: string, reportType: string, description?: string): Promise<void>;
    shareContent(contentData: any): Promise<void>;
}
/**
 * Standalone utility to create a share link, matching the pattern provided by the user.
 */
export declare function createShareLink(config: DirectoAiConfig, content: any, campaignId?: string | null): Promise<string | null>;
//# sourceMappingURL=tracker.d.ts.map