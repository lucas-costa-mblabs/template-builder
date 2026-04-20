import { DirectoAiTemplate, PostType } from '@directo/template-builder/react';
import { CVDTemplate } from '../types';
type PreviewPostSource = Record<string, unknown>;
export declare const defaultSdkPreviewPost: PostType;
export declare const mapCvdTemplateToSdkTemplate: (template: CVDTemplate) => DirectoAiTemplate;
export declare const mapPreviewPostToSdkPost: (source?: PreviewPostSource, fallbackTemplateId?: string, fallbackId?: string) => PostType;
export {};
