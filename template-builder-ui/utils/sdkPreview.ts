import type {
    DirectoAiTemplate,
    PostType,
} from '@directo/template-builder/react';
import type { TemplateBuilderTemplate } from '../types';

const DEFAULT_ACCOUNT_NAME = 'Directo Feed';

type PreviewPostSource = Record<string, unknown>;

const asRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const toStringValue = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number') {
        return String(value);
    }

    return fallback;
};

const toNullableStringValue = (value: unknown): string | null => {
    const resolved = toStringValue(value);
    return resolved ? resolved : null;
};

const toBooleanValue = (value: unknown): boolean | undefined => {
    if (typeof value === 'boolean') {
        return value;
    }

    return undefined;
};

const toNumberValue = (value: unknown): number | undefined => {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
};

const normalizeMediaType = (
    value: unknown
): PostType['mediaType'] | undefined => {
    const normalized = toStringValue(value).toLowerCase();

    if (normalized.includes('video')) {
        return 'video';
    }

    if (normalized.includes('image')) {
        return 'image';
    }

    return undefined;
};

export const defaultSdkPreviewPost: PostType = {
    contentId: 'template-preview',
    id: 'template-preview',
    title: 'Chaleira Elétrica Cadence 1,8L Inox Control 127V CEL850',
    legend: 'Oferta especial disponível por tempo limitado.',
    url: 'https://cdn.luxuryloyalty.com/media/product/detail/9c3adfe3-00d6-4e1a-9e4f-be925067f2d6-1.jpg',
    mediaType: 'image',
    originalPrice: 'R$ 89,90',
    price: 'R$ 39,90',
    discount: '26',
    destinationUrl: 'https://directo.ai',
    templateId: '',
    profile: {
        accountName: DEFAULT_ACCOUNT_NAME,
        iconUrl: '',
        description: 'Perfil exemplo para preview de templates.',
    },
    shop: {
        name: DEFAULT_ACCOUNT_NAME,
        avatar: '',
    },
    customVariables: {},
};

export const mapTemplateBuilderTemplateToSdkTemplate = (
    template: TemplateBuilderTemplate
): DirectoAiTemplate => ({
    templateId: template.id,
    name: template.title,
    active: template.active !== false,
    slug: template.slug,
    data: template.template as unknown as DirectoAiTemplate['data'],
});

export const mapPreviewPostToSdkPost = (
    source?: PreviewPostSource,
    fallbackTemplateId = '',
    fallbackId = 'template-preview'
): PostType => {
    if (!source) {
        return {
            ...defaultSdkPreviewPost,
            templateId: fallbackTemplateId,
            contentId: fallbackId,
            id: fallbackId,
        };
    }

    const customVariables = asRecord(source.customVariables);
    const price = asRecord(customVariables.price);
    const profile = asRecord(source.profile);
    const customProfile = asRecord(customVariables.profile);
    const shop = asRecord(source.shop);
    const contentId =
        toStringValue(source.contentId) ||
        toStringValue(source.id) ||
        fallbackId;
    const accountName =
        toStringValue(profile.accountName) ||
        toStringValue(customProfile.accountName) ||
        toStringValue(customVariables.storeName) ||
        DEFAULT_ACCOUNT_NAME;
    const accountAvatar =
        toStringValue(profile.iconUrl) || toStringValue(customProfile.iconUrl);
    const title =
        toStringValue(source.title) ||
        toStringValue(source.contentTitle) ||
        defaultSdkPreviewPost.title;
    const legend =
        toStringValue(source.legend) ||
        toStringValue(source.caption) ||
        toStringValue(source.description) ||
        defaultSdkPreviewPost.legend ||
        '';

    return {
        ...defaultSdkPreviewPost,
        ...source,
        id: toStringValue(source.id) || contentId,
        contentId,
        accountId: toStringValue(source.accountId),
        title,
        legend,
        url:
            toStringValue(source.url) ||
            toStringValue(source.imageUrl) ||
            defaultSdkPreviewPost.url,
        mediaType:
            normalizeMediaType(source.mediaType) ||
            normalizeMediaType(source.contentType) ||
            defaultSdkPreviewPost.mediaType,
        posterUrl: toStringValue(source.posterUrl),
        price:
            toNullableStringValue(source.price) ||
            toNullableStringValue(customVariables.discountPrice) ||
            toNullableStringValue(price.price),
        originalPrice:
            toNullableStringValue(source.originalPrice) ||
            toNullableStringValue(customVariables.originalPrice) ||
            toNullableStringValue(price.price_suggested) ||
            toNullableStringValue(price.original_price),
        discount:
            toNullableStringValue(source.discount) ||
            toNullableStringValue(price.discount_percentage),
        destinationUrl:
            toStringValue(source.destinationUrl) ||
            defaultSdkPreviewPost.destinationUrl,
        templateId:
            toStringValue(source.templateId) ||
            fallbackTemplateId ||
            defaultSdkPreviewPost.templateId,
        template: toStringValue(source.template),
        sponsored: toBooleanValue(source.sponsored),
        liked: toBooleanValue(source.liked),
        likeCount: toNumberValue(source.likeCount),
        favorite: toBooleanValue(source.favorite),
        following:
            toBooleanValue(source.following) ??
            toBooleanValue(source.isFollowing),
        isFollowing:
            toBooleanValue(source.isFollowing) ??
            toBooleanValue(source.following),
        category: Array.isArray(source.category)
            ? source.category.join(' / ')
            : toStringValue(source.category),
        brand: toStringValue(source.brand),
        profile: {
            accountName,
            iconUrl: accountAvatar,
            accountId:
                toStringValue(profile.accountId) ||
                toStringValue(source.accountId),
            description:
                toStringValue(profile.description) ||
                toStringValue(customProfile.description),
            following:
                toBooleanValue(profile.following) ??
                toBooleanValue(profile.isFollowing),
            isFollowing:
                toBooleanValue(profile.isFollowing) ??
                toBooleanValue(profile.following),
        },
        shop: {
            name: toStringValue(shop.name) || accountName,
            avatar: toStringValue(shop.avatar) || accountAvatar,
        },
        customVariables,
    };
};
