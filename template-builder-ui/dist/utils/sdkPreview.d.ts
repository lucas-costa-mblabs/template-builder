import { DirectoAiTemplate, PostType } from '@directo/template-builder/react';
import { TemplateBuilderTemplate } from '../types';
type PreviewPostSource = Record<string, unknown>;
export declare const defaultSdkPreviewPost: PostType;
export declare const mapTemplateBuilderTemplateToSdkTemplate: (template: TemplateBuilderTemplate) => DirectoAiTemplate;
export declare const mapPreviewPostToSdkPost: (source?: PreviewPostSource, fallbackTemplateId?: string, fallbackId?: string) => PostType;
export {};
