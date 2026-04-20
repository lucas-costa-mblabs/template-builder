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

const DEFAULT_ACCOUNT_NAME = 'Directo Feed';
const DEFAULT_PREVIEW_TITLE = 'Titulo do post aparece aqui';
const DEFAULT_PREVIEW_LEGEND =
    'Adicione uma legenda para visualizar como seu conteudo vai aparecer no feed.';
const DEFAULT_PREVIEW_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="100%" stop-color="#f0f0f0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect x="280" y="165" width="640" height="390" rx="34" fill="#ffffff" stroke="#d9d9d9" stroke-width="12"/>
  <circle cx="470" cy="330" r="58" fill="#e5e7eb"/>
  <path d="M380 500l155-155 120 120 85-85 110 120H380z" fill="#d1d5db"/>
  <text x="600" y="680" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" fill="#9ca3af">Sua imagem aparecera aqui</text>
</svg>
`)}`;

export const defaultTemplatePreviewData = {
    post: {
        title: DEFAULT_PREVIEW_TITLE,
        description: DEFAULT_PREVIEW_LEGEND,
        legend: DEFAULT_PREVIEW_LEGEND,
        originalPrice: 'R$ 89,90',
        price: 'R$ 39,90',
        discount: '26',
        destinationUrl: 'https://directo.ai',
        contentType: 'image',
        url: DEFAULT_PREVIEW_IMAGE,
        profile: {
            accountName: DEFAULT_ACCOUNT_NAME,
            iconUrl: '',
            description: 'Perfil exemplo para preview de templates.',
        },
        customVariables: {},
    },
};

export const buildTemplatePreviewDataContext = (
    content?: IContentResponse
): Record<string, unknown> => {
    if (!content) {
        return defaultTemplatePreviewData;
    }

    const profile = content.customVariables?.profile;

    return {
        post: {
            title:
                content.contentTitle ||
                content.qualifiers?.title ||
                content.qualifiers?.name ||
                DEFAULT_PREVIEW_TITLE,
            description: content.caption || DEFAULT_PREVIEW_LEGEND,
            legend: content.caption || DEFAULT_PREVIEW_LEGEND,
            originalPrice:
                content.customVariables?.originalPrice ||
                content.customVariables?.price?.price_suggested ||
                '',
            price:
                content.customVariables?.price?.price ||
                content.customVariables?.discountPrice ||
                '',
            discount:
                content.customVariables?.discountPrice ||
                content.customVariables?.price?.discount_percentage?.toString() ||
                '',
            destinationUrl:
                content.destinationUrl || defaultTemplatePreviewData.post.destinationUrl,
            contentType: content.contentType || 'image',
            url: content.imageUrl || DEFAULT_PREVIEW_IMAGE,
            templateId: content.templateId || '',
            contentId: content.contentId || '',
            category: content.qualifiers?.category?.join(' / ') || '',
            brand: content.qualifiers?.brand || '',
            profile: {
                accountName:
                    profile?.accountName ||
                    content.accountName ||
                    DEFAULT_ACCOUNT_NAME,
                iconUrl: profile?.iconUrl || '',
                description: profile?.description || '',
            },
            customVariables: {
                ...(content.customVariables || {}),
            },
        },
    };
};
