import type { DirectoAiConfig, DirectoAiTemplate, Theme } from "../core/types.js";
export interface RemoteBootstrapData {
    theme: Theme;
    templates: DirectoAiTemplate[];
}
type FetchLike = typeof fetch;
export declare function fetchCvdTemplates(config: DirectoAiConfig, fetchImpl?: FetchLike): Promise<DirectoAiTemplate[]>;
export declare function fetchCvdTheme(config: DirectoAiConfig, fetchImpl?: FetchLike): Promise<Theme>;
export declare function clearRemoteBootstrapCache(config?: DirectoAiConfig): void;
export declare function loadRemoteBootstrapData(config: DirectoAiConfig, fetchImpl?: FetchLike): Promise<RemoteBootstrapData>;
export {};
//# sourceMappingURL=bootstrap.d.ts.map