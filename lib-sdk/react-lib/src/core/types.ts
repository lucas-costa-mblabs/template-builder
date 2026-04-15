// ─── Tokens ───
export type SpacingToken = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type BorderRadiusToken = "sm" | "md" | "lg" | "full";
export type TypographyToken = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// ─── Actions ───
export type ActionType = "OPEN_URL" | "DEEPLINK" | "UI_ACTION" | "NAVIGATE";

export interface ActionPayload {
  url?: string;
  deeplink?: string;
  actionName?: string;
  target?: string;
}

export interface ComponentAction {
  type: ActionType;
  payload: ActionPayload;
}

export interface ReportSubmission {
  reasonId: string;
  reasonLabel: string;
  details: string;
  contentId?: string;
  campaignId?: string;
  title?: string;
  createdAt: string;
}

// ─── Theme ───
export interface Theme {
  colors: Record<string, string>;
  spacing: Record<SpacingToken, string>;
  borderRadius: Record<BorderRadiusToken, string>;
  typography: Record<TypographyToken, string>;
}

// ─── Post ───
export interface PostProfile {
  accountName: string;
  iconUrl: string;
  accountId?: string;
  description?: string;
  following?: boolean;
  isFollowing?: boolean;
}

export interface PostShop {
  avatar: string;
  name: string;
}

export interface DirectoAiEndpoints {
  templateBaseUrl?: string;
  accountBaseUrl?: string;
  campaignBaseUrl?: string;
  contentBaseUrl?: string;
}

export interface DirectoAiConfig {
  accountId: string;
  apiKey: string;
  customerId?: string;
  deviceId?: string;
  baseUrl?: string;
  endpoints?: DirectoAiEndpoints;
  googleAnalyticsHandler?: (eventName: string, eventParams: Record<string, any>) => void;
}

export interface Post {
  id?: string;
  contentId: string; // Mapeamento principal da API
  accountId?: string;
  title: string;
  legend?: string; // Mapeamento da API
  url: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  price?: string | null;
  originalPrice?: string | null;
  discount?: string | null;
  shop?: PostShop;
  profile?: PostProfile;
  sponsored?: boolean;
  liked?: boolean;
  likeCount?: number;
  favorite?: boolean;
  following?: boolean;
  isFollowing?: boolean;
  templateId: string;
  template?: string; // HTML legado se houver
  [key: string]: unknown;
}

// ─── Template / ComponentNode ───
export type ComponentType =
  | "container"
  | "text"
  | "media"
  | "divider"
  | "button"
  | "price"
  | "icon"
  | "post_interactions"
  | "html"
  | "avatar"
  | "header";

export interface ComponentNode {
  id: string;
  type: ComponentType;
  flex?: number;

  // Container
  blocks?: ComponentNode[];
  direction?: "row" | "column";
  justifyContent?:
    | "space-between"
    | "space-evenly"
    | "space-around"
    | "center"
    | "flex-start"
    | "flex-end";
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch";
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  paddingX?: string;
  paddingY?: string;
  marginX?: string;
  marginY?: string;
  gap?: string;
  width?: string;
  height?: string;

  // Text
  value?: string;
  typography?:
    | "caption"
    | "body"
    | "heading5"
    | "heading4"
    | "heading3"
    | "heading2"
    | "heading1"
    | string;
  color?: string;
  fontWeight?: "bold" | "semiBold" | "normal" | string;
  textAlign?: "left" | "center" | "right";

  // Media
  url?: string;
  alt?: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;

  // Button
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | string;
  background?: string;
  radius?: string;
  deeplink?: string;
  fullWidth?: boolean;
  size?: string | number;

  // Price
  price?: string;
  originalPrice?: string;
  discountPercent?: string;
  showOriginalPrice?: boolean;
  showDiscountPercent?: boolean;

  // Post Interactions
  showLike?: boolean;
  showSave?: boolean;
  showShare?: boolean;
  onLike?: ComponentAction;
  onSave?: ComponentAction;
  onShare?: ComponentAction;

  // Icon
  icon?: string;
  padding?: string;

  // Divider
  thickness?: "thin" | "medium" | "thick" | string;

  // Action (genérica para qualquer nó interativo)
  action?: ComponentAction;

  // Header
  imageUrl?: string;
  title?: string;
  onProfilePress?: ComponentAction;
  menuItems?: Array<{
    icon: string;
    text: string;
    action: ComponentAction;
  }>;

  // HTML
  html?: string;

  // Extensível
  [key: string]: unknown;
}

export interface DirectoAiTemplate {
  templateId: string; // Mapeamento da API
  name: string; // Mapeamento da API
  active: boolean;
  slug: string;
  data: ComponentNode[]; // Mapeamento da API
}
