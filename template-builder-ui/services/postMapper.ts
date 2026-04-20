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

export function mapPostToViewModel(rawPost: RawPost) {
  if (!rawPost) return null;

  const customVars = rawPost.customVariables || {};
  
  return {
    post: {
      id: rawPost.contentId || "",
      title: rawPost.title || "",
      url: rawPost.url || "",
      destinationUrl: rawPost.destinationUrl || "",
      price: rawPost.price || customVars.discountPrice || (customVars.price?.price) || "",
      originalPrice: rawPost.originalPrice || customVars.originalPrice || (customVars.price?.original_price) || "",
      discount: rawPost.discount || customVars.price?.discount_percentage || 0,
      // Add other relevant fields as needed
      category: rawPost.category || "",
      brand: rawPost.brand || "",
      validUntil: customVars.validUntil || "",
      profile: {
        accountName: customVars.profile?.accountName || customVars.storeName || "Store",
        iconUrl: customVars.profile?.iconUrl || "",
        description: "", // No payload field for this in RawPost yet, but structure is there
      }
    },
  };
}
