import { FileImageOutlined } from '@ant-design/icons';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import {
    Post,
    ScrollableContainer,
    TemplateProvider,
} from '@directo/template-builder/react';
import type { CVDTemplate, Theme } from '../types';
import { theme as defaultTheme } from '../theme';
import { defaultTemplatePreviewData } from '../utils/previewData';
import {
    mapCvdTemplateToSdkTemplate,
    mapPreviewPostToSdkPost,
} from '../utils/sdkPreview';

interface TemplateBuilderPreviewProps {
    template?: CVDTemplate | null;
    templates?: CVDTemplate[];
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

export default function TemplateBuilderPreview({
    template,
    templates = [],
    theme,
    dataContext,
    posts,
    scale = 1,
    width = '358px',
    height,
    wrapperStyle,
    canvasStyle,
    emptyState,
    scrollable = false,
    orientation = 'vertical',
    scrollableStyle,
}: TemplateBuilderPreviewProps) {
    const previewTemplates =
        templates.length > 0 ? templates : template ? [template] : [];
    const sdkTemplates = previewTemplates.map(mapCvdTemplateToSdkTemplate);
    const selectedTemplate = template
        ? mapCvdTemplateToSdkTemplate(template)
        : sdkTemplates[0];
    const postSources =
        posts && posts.length > 0
            ? posts
            : Array.isArray(dataContext?.posts)
              ? (dataContext.posts as Record<string, unknown>[])
              : [
                    (dataContext?.post as Record<string, unknown>) ||
                        defaultTemplatePreviewData.post,
                ];
    const sdkPosts = postSources.map((postSource, index) =>
        mapPreviewPostToSdkPost(
            postSource,
            selectedTemplate?.templateId || '',
            `template-preview-${index}`
        )
    );
    const shouldUseScrollableContainer = scrollable || sdkPosts.length > 1;
    const containerStyle = {
        width: '100%',
        height: '100%',
        gap: '16px',
        padding: '8px',
        boxSizing: 'border-box',
        ...scrollableStyle,
    } as unknown as ComponentProps<typeof ScrollableContainer>['style'];

    if (!sdkTemplates.length) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8fafc',
                    color: '#cbd5e1',
                    ...wrapperStyle,
                }}
            >
                {emptyState || (
                    <FileImageOutlined
                        style={{ fontSize: 40, color: '#cbd5e1' }}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                height: wrapperStyle?.height || 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
                ...wrapperStyle,
            }}
        >
            <div
                style={{
                    width,
                    height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    ...canvasStyle,
                }}
            >
                <TemplateProvider
                    theme={theme || defaultTheme}
                    templates={sdkTemplates}
                >
                    {shouldUseScrollableContainer ? (
                        <ScrollableContainer
                            orientation={orientation}
                            style={containerStyle}
                        >
                            {sdkPosts.map((post) => (
                                <Post
                                    key={post.contentId}
                                    post={post}
                                    template={selectedTemplate}
                                />
                            ))}
                        </ScrollableContainer>
                    ) : (
                        <Post
                            post={sdkPosts[0]}
                            template={selectedTemplate}
                        />
                    )}
                </TemplateProvider>
            </div>
        </div>
    );
}
