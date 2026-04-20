import type { TemplateBuilderTemplate } from '../types';

export const templateBuilderEmptyStateTemplate: TemplateBuilderTemplate = {
    id: 'template-builder-empty-state',
    title: 'Post Empty State',
    slug: 'post-empty-state',
    active: true,
    template: [
        {
            id: 'empty-root',
            type: 'container',
            direction: 'column',
            backgroundColor: 'white',
            blocks: [
                {
                    id: 'empty-header',
                    type: 'header',
                    imageUrl: '{{post.profile.iconUrl}}',
                    title: '{{post.profile.accountName}}',
                    menuItems: [
                        {
                            icon: 'more',
                            text: 'Mais',
                        },
                    ],
                },
                {
                    id: 'empty-media',
                    type: 'media',
                    url: '{{post.url}}',
                    alt: '{{post.title}}',
                    aspectRatio: '4:3',
                    objectFit: 'cover',
                },
                {
                    id: 'empty-actions',
                    type: 'post_interactions',
                    showLike: true,
                    showSave: true,
                    showShare: true,
                    paddingX: 'md',
                    paddingY: 'sm',
                },
                {
                    id: 'empty-content',
                    type: 'container',
                    direction: 'column',
                    paddingX: 'md',
                    paddingY: 'md',
                    gap: 'sm',
                    blocks: [
                        {
                            id: 'empty-title',
                            type: 'text',
                            value: '{{post.title}}',
                            typography: 'heading4',
                            fontWeight: 'bold',
                            color: 'gray-900',
                        },
                        {
                            id: 'empty-caption',
                            type: 'text',
                            value: '{{post.legend}}',
                            typography: 'body',
                            color: 'gray-700',
                        },
                        {
                            id: 'empty-button',
                            type: 'button',
                            label: 'Clique aqui',
                            variant: 'primary',
                            size: 'md',
                            radius: 'lg',
                            fullWidth: true,
                            action: {
                                type: 'OPEN_URL',
                                payload: {
                                    url: '{{post.destinationUrl}}',
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
