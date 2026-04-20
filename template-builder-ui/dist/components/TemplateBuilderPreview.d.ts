import { CSSProperties, ReactNode } from 'react';
import { TemplateBuilderTemplate, Theme } from '../types';
interface TemplateBuilderPreviewProps {
    template?: TemplateBuilderTemplate | null;
    templates?: TemplateBuilderTemplate[];
    theme?: Theme;
    dataContext?: Record<string, unknown>;
    posts?: Record<string, unknown>[];
    scale?: number;
    width?: string;
    height?: string;
    wrapperStyle?: CSSProperties;
    canvasStyle?: CSSProperties;
    emptyState?: ReactNode;
    scrollable?: boolean;
    orientation?: 'vertical' | 'horizontal';
    scrollableStyle?: CSSProperties;
}
export default function TemplateBuilderPreview({ template, templates, theme, dataContext, posts, scale, width, height, wrapperStyle, canvasStyle, emptyState, scrollable, orientation, scrollableStyle, }: TemplateBuilderPreviewProps): import("react/jsx-runtime").JSX.Element;
export {};
