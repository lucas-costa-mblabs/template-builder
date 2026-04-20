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
        };
        validUntil?: string;
    };
}
export declare function mapPostToViewModel(rawPost: RawPost): {
    post: {
        id: string;
        title: string;
        url: string;
        destinationUrl: string;
        price: string;
        originalPrice: string;
        discount: number;
        category: string;
        brand: string;
        validUntil: string;
        profile: {
            accountName: string;
            iconUrl: string;
            description: string;
        };
    };
} | null;
export {};
