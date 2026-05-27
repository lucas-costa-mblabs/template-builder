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

export function mapPostToViewModel(rawPost: RawPost) {
  if (!rawPost) return null;

  const customVars = rawPost.customVariables || {};
  
  return {
    post: {
      id: rawPost.contentId || "",
      contentId: rawPost.contentId || "",
      title: rawPost.title || "",
      url: rawPost.url || "",
      destinationUrl: rawPost.destinationUrl || "",
      price: rawPost.price || customVars.discountPrice || (customVars.price?.price) || "",
      originalPrice: rawPost.originalPrice || customVars.originalPrice || (customVars.price?.original_price) || "",
      discount: rawPost.discount || customVars.price?.discount_percentage || 0,
      category: rawPost.category || "",
      brand: rawPost.brand || "",
      validUntil: customVars.validUntil || "",
      sponsored: rawPost.sponsored ?? false,
      liked: rawPost.liked ?? false,
      favorite: rawPost.favorite ?? false,
      likeCount: rawPost.likeCount ?? 0,
      following: rawPost.following ?? false,
      isFollowing: rawPost.isFollowing ?? false,
      isFollower: rawPost.isFollower ?? false,
      accountId: rawPost.accountId || customVars.profile?.accountId || "",
      profile: {
        accountName: customVars.profile?.accountName || customVars.storeName || "Store",
        iconUrl: customVars.profile?.iconUrl || "",
        accountId: customVars.profile?.accountId || rawPost.accountId || "",
        description: customVars.profile?.description || "",
      },
    },
  };
}
