export type TokenType = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type ActionType = "OPEN_URL" | "DEEPLINK" | "UI_ACTION" | "NAVIGATE";
export interface ComponentAction {
    type: ActionType;
    payload: {
        url?: string;
        deeplink?: string;
        actionName?: "like" | "save" | "share" | "follow" | "report" | "open_profile";
        target?: "profile" | string;
        [key: string]: unknown;
    };
}
export type ColorToken = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "info" | "white" | "black" | "gray-50" | "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" | "gray-800" | "gray-900" | "gray-950" | "primary-hover" | "primary-active" | "secondary-hover" | "secondary-active";
export interface Theme {
    colors: Record<ColorToken, string>;
    spacing: Record<TokenType, string>;
    borderRadius: Record<"sm" | "md" | "lg" | "full", string>;
    typography: Record<TokenType, string>;
}
export interface ComponentStyle {
    padding?: TokenType;
    gap?: TokenType;
    margin?: TokenType;
    color?: ColorToken;
    backgroundColor?: ColorToken;
    borderColor?: ColorToken;
    borderRadius?: "sm" | "md" | "lg" | "full";
    fontSize?: TokenType;
    fontWeight?: "bold" | "semiBold" | "normal";
}
export interface BaseComponentNode {
    id: string;
    type: string;
    flex?: number;
}
export interface TextComponentNode extends BaseComponentNode {
    type: "text";
    action?: ComponentAction;
    value: string;
    typography?: "body" | "caption" | "heading1" | "heading2" | "heading3" | "heading4" | "heading5";
    color?: ColorToken;
    fontWeight?: "bold" | "semiBold" | "normal";
    textAlign?: "left" | "center" | "right";
}
export interface ContainerComponentNode extends BaseComponentNode {
    type: "container";
    direction?: "row" | "column";
    justifyContent?: "space-between" | "space-evenly" | "space-around" | "center" | "flex-start" | "flex-end";
    alignItems?: "center" | "flex-start" | "flex-end";
    backgroundColor?: ColorToken;
    borderRadius?: "sm" | "md" | "lg" | "full";
    borderWidth?: string;
    borderColor?: ColorToken;
    borderStyle?: "solid" | "dashed" | "dotted";
    paddingX?: TokenType;
    paddingY?: TokenType;
    marginX?: TokenType;
    marginY?: TokenType;
    gap?: TokenType;
    width?: string;
    height?: string;
    blocks: ComponentNode[];
}
export interface DividerComponentNode extends BaseComponentNode {
    type: "divider";
    thickness?: "thin" | "medium" | "thick";
}
export interface MediaComponentNode extends BaseComponentNode {
    type: "media";
    action?: ComponentAction;
    url: string;
    alt: string;
    aspectRatio?: string;
    width?: string;
    height?: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}
export interface AvatarComponentNode extends BaseComponentNode {
    type: "avatar";
    action?: ComponentAction;
    url?: string;
    icon: string;
    size?: number | string;
    backgroundColor?: ColorToken;
    borderRadius?: "sm" | "md" | "lg" | "full";
}
export interface ButtonComponentNode extends BaseComponentNode {
    type: "button";
    action?: ComponentAction;
    label: string;
    radius?: "sm" | "md" | "lg" | "full";
    background?: ColorToken;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    url?: string;
    fullWidth?: boolean;
    size?: TokenType;
}
export interface IconButtonComponentNode extends BaseComponentNode {
    type: "icon_button";
    action?: ComponentAction;
    icon: string;
}
export interface IconComponentNode extends BaseComponentNode {
    type: "icon";
    action?: ComponentAction;
    icon: string;
    backgroundColor?: ColorToken;
    padding?: TokenType;
    size?: number | string;
    borderRadius?: "sm" | "md" | "lg" | "full";
}
export interface PostInteractionsComponentNode extends BaseComponentNode {
    type: "post_interactions";
    showLike?: boolean;
    showSave?: boolean;
    showShare?: boolean;
    onLike?: ComponentAction;
    onSave?: ComponentAction;
    onShare?: ComponentAction;
    paddingX?: TokenType;
    paddingY?: TokenType;
    gap?: TokenType;
}
export interface HtmlComponentNode extends BaseComponentNode {
    type: "html";
    action?: ComponentAction;
    html: string;
    paddingX?: TokenType;
    paddingY?: TokenType;
    width?: string;
    height?: string;
}
export interface HeaderMenuItem {
    icon: string;
    text: string;
    action?: ComponentAction;
}
export interface HeaderComponentNode extends BaseComponentNode {
    type: "header";
    imageUrl?: string;
    title: string;
    menuItems: HeaderMenuItem[];
    onProfilePress?: ComponentAction;
}
export interface PriceComponentNode extends BaseComponentNode {
    type: "price";
    action?: ComponentAction;
    price: string;
    originalPrice?: string;
    discountPercent?: string;
    showOriginalPrice?: boolean;
    showDiscountPercent?: boolean;
    paddingX?: TokenType;
    paddingY?: TokenType;
}
export type ComponentNode = ContainerComponentNode | DividerComponentNode | MediaComponentNode | TextComponentNode | ButtonComponentNode | IconComponentNode | AvatarComponentNode | PostInteractionsComponentNode | PriceComponentNode | HtmlComponentNode | HeaderComponentNode;
export declare const generateId: () => string;
export interface TemplatePost {
    title: string;
    legend: string;
    url: string;
    destinationUrl: string;
    contentType: string;
    campaignId: string;
    contentId: string;
    templateId: string;
    category: string;
    brand: string;
    sponsored: boolean;
    originalPrice: string;
    proportion: number | null;
    price: string;
    discount: number;
    liked: boolean;
    favorite: boolean;
    isFollower: boolean;
    template: string;
    likeCount: number;
    customVariables?: {
        html: string;
        [key: string]: Record<string, unknown> | unknown;
    };
    config?: {
        components: ComponentNode[];
        updatedAt: string;
        enabled?: boolean;
        slug?: string;
    };
    templateBuilderTemplate?: TemplateBuilderTemplate;
}
export interface TemplateBuilderTemplate {
    id: string;
    title: string;
    active: boolean;
    slug: string;
    template: ComponentNode[];
}
