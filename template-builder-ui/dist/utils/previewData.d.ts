interface IContentResponse {
    contentTitle?: string;
    caption?: string;
    destinationUrl?: string;
    contentType?: string;
    imageUrl?: string;
    templateId?: string;
    contentId?: string;
    accountName?: string;
    qualifiers?: {
        title?: string;
        name?: string;
        category?: string[];
        brand?: string;
    };
    customVariables?: {
        profile?: {
            accountName?: string;
            iconUrl?: string;
            description?: string;
        };
        originalPrice?: string;
        discountPrice?: string;
        price?: {
            price?: string;
            price_suggested?: string;
            discount_percentage?: number;
        };
        [key: string]: unknown;
    };
}
export declare const defaultTemplatePreviewData: {
    post: {
        title: string;
        description: string;
        legend: string;
        originalPrice: string;
        price: string;
        discount: string;
        destinationUrl: string;
        contentType: string;
        url: string;
        profile: {
            accountName: string;
            iconUrl: string;
            description: string;
        };
        customVariables: {};
    };
};
export declare const buildTemplatePreviewDataContext: (content?: IContentResponse) => Record<string, unknown>;
export {};
