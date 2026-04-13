import type { Theme, DirectoAiTemplate, DirectoAiConfig } from "../core/types.js";
import type { DirectoAiTracker } from "../core/tracker.js";
export interface TemplateContextValue {
    theme: Theme;
    templates: DirectoAiTemplate[];
    config?: DirectoAiConfig;
    tracker: DirectoAiTracker;
    getIsFollowing?: (profileAccountId: string) => boolean;
    setIsFollowing?: (profileAccountId: string, isFollowing: boolean) => void;
}
export declare const TemplateContext: import("react").Context<TemplateContextValue | null>;
export declare function useTemplateContext(): TemplateContextValue;
//# sourceMappingURL=context.d.ts.map