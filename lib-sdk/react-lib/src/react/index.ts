// Components
export { TemplateProvider } from "./TemplateProvider.js";
export { RemoteTemplateProvider } from "./RemoteTemplateProvider.js";
export { Post } from "./Post.js";
export { JSONRenderer } from "./JSONRenderer.js";
export {
  clearRemoteBootstrapCache,
  fetchCvdTemplates,
  fetchCvdTheme,
  loadRemoteBootstrapData,
} from "./bootstrap.js";

// Context hook (for advanced usage)
export { useTemplateContext } from "./context.js";

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
export type { PostProps } from "./Post.js";
