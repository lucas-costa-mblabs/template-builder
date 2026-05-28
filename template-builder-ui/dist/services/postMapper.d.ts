/**
 * Maps a raw post entity from the API to a standardized view model
 * used by the template builder's placeholder resolution.
 */
interface RawPost {
    contentId?: string;
    title?: string;
    url?: string;
    destinationUrl?: string;
    price?: string;
    originalPrice?: string;
    discount?: number;
    category?: string;
    brand?: string;
    sponsored?: boolean;
    liked?: boolean;
    favorite?: boolean;
    likeCount?: number;
    following?: boolean;
    isFollowing?: boolean;
    isFollower?: boolean;
    accountId?: string;
    customVariables?: {
        discountPrice?: string;
        originalPrice?: string;
        price?: {
            price?: string;
            original_price?: string;
            discount_percentage?: number;
        };
        storeName?: string;
        profile?: {
            accountName?: string;
            iconUrl?: string;
            accountId?: string;
            description?: string;
        };
        validUntil?: string;
    };
}
export declare function mapPostToViewModel(rawPost: RawPost): {
    post: {
        id: string;
        contentId: string;
        title: string;
        url: string;
        destinationUrl: string;
        price: string;
        originalPrice: string;
        discount: number;
        category: string;
        brand: string;
        validUntil: string;
        sponsored: boolean;
        liked: boolean;
        favorite: boolean;
        likeCount: number;
        following: boolean;
        isFollowing: boolean;
        isFollower: boolean;
        accountId: string;
        profile: {
            accountName: string;
            iconUrl: string;
            accountId: string;
            description: string;
        };
    };
} | null;
export {};
