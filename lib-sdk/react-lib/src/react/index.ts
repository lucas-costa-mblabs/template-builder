// Components
export { TemplateProvider } from "./TemplateProvider.js";
export { RemoteTemplateProvider } from "./RemoteTemplateProvider.js";
export { ScrollableContainer } from "./ScrollableContainer.js";
export { Post } from "./Post.js";
export { JSONRenderer } from "./JSONRenderer.js";
export { useRemoteFeed } from "./hooks/useRemoteFeed.js";
export {
  clearRemoteBootstrapCache,
  fetchCvdTemplates,
  fetchCvdTheme,
  loadRemoteBootstrapData,
} from "./bootstrap.js";
export {
  clearRemoteFeedCache,
  fetchRemoteFeed,
  loadRemoteFeed,
} from "./remoteFeed.js";

// Context hook (for advanced usage)
export { useTemplateContext } from "./context.js";

// Theme utilities
export { DEFAULT_THEME, mergeWithDefaultTheme } from "./defaultTheme.js";

// Types re-export
export type {
  Post as PostType,
  PostShop,
  DirectoAiTemplate,
  DirectoAiConfig,
  DirectoAiEndpoints,
  ComponentNode,
  ComponentType,
  Theme,
  SpacingToken,
  BorderRadiusToken,
  TypographyToken,
  ReportSubmission,
} from "../core/types.js";

export type { TemplateProviderProps } from "./TemplateProvider.js";
export type { RemoteTemplateProviderProps } from "./RemoteTemplateProvider.js";
export type { ScrollableContainerProps } from "./ScrollableContainer.js";
export type { PostProps } from "./Post.js";
export type {
  UseRemoteFeedOptions,
  UseRemoteFeedResult,
} from "./hooks/useRemoteFeed.js";
