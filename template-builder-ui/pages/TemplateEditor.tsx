import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Button, Input, message, Typography, Switch, Spin } from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    BgColorsOutlined,
} from '@ant-design/icons';
import type { ComponentNode, Theme, CVDTemplate } from '../types';
import { generateId } from '../types';
import '../assets/style.css';

import Sidebar from '../components/builder/Sidebar';
import CanvasArea from '../components/builder/CanvasArea';
import PropertiesPopup from '../components/builder/PropertiesPopup';
import ThemeDrawer from '../components/builder/ThemeDrawer';
import {
    createTemplate,
    updateTemplate,
    getTemplates,
    getTemplateData,
    getGlobalTheme,
} from '../services/templateService';
import { theme as defaultTheme } from '../theme';
import { useTemplateBuilderStore } from '../store';

const { Content, Sider } = Layout;

export default function TemplateEditor() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const upsertTemplate = useTemplateBuilderStore(
        (state) => state.upsertTemplate
    );
    const persistGlobalTheme = useTemplateBuilderStore(
        (state) => state.persistGlobalTheme
    );

    // If id is "new", generate a unique id and redirect so each new template is independent
    useEffect(() => {
        if (id === 'new') {
            const newId = `template-${Date.now()}`;
            navigate(`/template-builder/editor/${newId}`, { replace: true });
        }
    }, [id, navigate]);

    const [templateName, setTemplateName] = useState<string>('');

    useEffect(() => {
        async function init() {
            if (!id || id === 'new') {
                setTemplateName('');
                return;
            }
            const templates = await getTemplates();
            const existing = templates.find((e) => e.id === id);
            setTemplateName(
                existing?.title ??
                    (id === 'dermage'
                        ? 'Template Dermage'
                        : `Template ${id.replace('template-', '#')}`)
            );
        }
        init();
    }, [id]);

    const handleRenameTemplate = (newName: string) => {
        setTemplateName(newName);
    };

    const [showGuides, setShowGuides] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);
    const [components, setComponents] = useState<ComponentNode[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [slug, setSlug] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExisting, setIsExisting] = useState(false);

    // Reset canvas when navigating to a different template
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            // Clear current state immediately to avoid showing previous template data
            setComponents([]);
            setTemplateName('');
            setSlug('');
            setSelectedNodeId(null);

            if (!id || id === 'new') {
                setComponents([]);
                setSlug('');
                setEnabled(true);
                setIsExisting(false);
                const globalTheme = await getGlobalTheme();
                setTheme(globalTheme);
                setIsLoading(false);
                return;
            }

            try {
                const data = await getTemplateData(id);
                setComponents(data.components || []);
                setTemplateName(
                    data.title ||
                        (id === 'dermage'
                            ? 'Template Dermage'
                            : `Template ${id.replace('template-', '#')}`)
                );
                setSlug(data.slug || '');
                setEnabled(data.enabled !== false);
                setTheme(data.theme || defaultTheme);
                setIsExisting(data.found);
            } catch (error) {
                console.error('Error loading template data:', error);
                message.error('Erro ao carregar o template.');
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [id]);

    // Drag visual feedback state
    const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
    const [dragPosition, setDragPosition] = useState<
        'top' | 'bottom' | 'inside' | null
    >(null);

    // Wrapper for setComponents (keeping the same signature for child components if needed)
    const handleSetComponents = useCallback(
        (action: React.SetStateAction<ComponentNode[]>) => {
            setComponents((prev) => {
                const newState =
                    typeof action === 'function' ? action(prev) : action;
                return newState;
            });
        },
        [setComponents]
    );

    const updateNodeInTree = useCallback(
        (
            nodes: ComponentNode[],
            id: string,
            updates: Partial<ComponentNode>
        ): ComponentNode[] => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, ...updates } as ComponentNode;
                }
                if ('blocks' in node && node.blocks) {
                    return {
                        ...node,
                        blocks: updateNodeInTree(node.blocks, id, updates),
                    } as ComponentNode;
                }
                return node;
            });
        },
        []
    );

    const handleUpdateNode = (id: string, updates: Partial<ComponentNode>) => {
        handleSetComponents((prev) => updateNodeInTree(prev, id, updates));
    };

    const deleteNodeFromTree = useCallback(
        (nodes: ComponentNode[], id: string): ComponentNode[] => {
            return nodes
                .filter((node) => node.id !== id)
                .map((node) => {
                    if ('blocks' in node && node.blocks) {
                        return {
                            ...node,
                            blocks: deleteNodeFromTree(node.blocks, id),
                        } as ComponentNode;
                    }
                    return node;
                });
        },
        []
    );

    const handleSelectNode = (id: string | null) => {
        setSelectedNodeId(id);
    };

    const getSelectedNode = (
        nodes: ComponentNode[],
        id: string
    ): ComponentNode | null => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if ('blocks' in node && node.blocks) {
                const found = getSelectedNode(node.blocks, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedNode = selectedNodeId
        ? getSelectedNode(components, selectedNodeId)
        : null;

    // Handle keyboard events (delete node)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedNodeId) return;

            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                handleSetComponents((prev) =>
                    deleteNodeFromTree(prev, selectedNodeId)
                );
                handleSelectNode(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, deleteNodeFromTree, handleSetComponents]);

    const handleSave = async () => {
        if (!id) return;

        const cvdTemplate: CVDTemplate = {
            id: id,
            title: templateName,
            active: enabled,
            slug: slug,
            template: components,
        };

        try {
            if (isExisting) {
                await updateTemplate(cvdTemplate);
            } else {
                await createTemplate(cvdTemplate);
                setIsExisting(true);
            }
            upsertTemplate(cvdTemplate);
            message.success('Layout salvo com sucesso! ✅');
        } catch (error) {
            console.error('Error saving template:', error);
            message.error('Erro ao salvar o layout. ❌');
        }
    };

    const handleImportJson = (jsonText: string) => {
        try {
            // Basic cleanup: remove markdown code blocks if present
            let cleaned = jsonText.trim();
            if (cleaned.startsWith('```')) {
                cleaned = cleaned
                    .replace(/^```[a-z]*\n/i, '')
                    .replace(/\n```$/m, '');
            }

            const data = JSON.parse(cleaned);
            let newComponents: ComponentNode[] = [];

            // Support various structures
            if (Array.isArray(data)) {
                newComponents = data;
            } else if (data.template && Array.isArray(data.template)) {
                newComponents = data.template;
                if (data.title) setTemplateName(data.title);
                if (data.slug) setSlug(data.slug);
                if (data.active !== undefined) setEnabled(data.active);
            } else if (data.components && Array.isArray(data.components)) {
                newComponents = data.components;
            } else if (
                data.config?.components &&
                Array.isArray(data.config.components)
            ) {
                newComponents = data.config.components;
            }

            if (newComponents && newComponents.length > 0) {
                setComponents(newComponents);
                message.success('JSON importado com sucesso! 🚀');
                return true;
            } else {
                message.error(
                    'Não encontramos uma lista de componentes válida no JSON.'
                );
                return false;
            }
        } catch (err: unknown) {
            console.error('Import error:', err);
            const msg =
                err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(`Erro na sintaxe do JSON: ${msg}`);
            return false;
        }
    };

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('componentType', type);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDragStartNode = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        e.dataTransfer.setData('draggedNodeId', id);
    };

    const handleDragOverNode = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const y = e.clientY - rect.top;

        const node = getSelectedNode(components, id);
        const isContainer = node && node.type === 'container';

        let position: 'top' | 'bottom' | 'inside' = 'inside';

        if (isContainer) {
            const threshold = rect.height * 0.25;
            if (y < threshold) {
                position = 'top';
            } else if (y > rect.height - threshold) {
                position = 'bottom';
            } else {
                position = 'inside';
            }
        } else {
            if (y < rect.height / 2) {
                position = 'top';
            } else {
                position = 'bottom';
            }
        }

        setDragOverNodeId(id);
        setDragPosition(position);
    };

    const handleDragLeaveNode = (e: React.DragEvent) => {
        e.stopPropagation();
        setDragOverNodeId(null);
        setDragPosition(null);
    };

    const isDescendant = (parentId: string, targetId: string): boolean => {
        const parentNode = getSelectedNode(components, parentId);
        if (!parentNode) return false;
        if (parentId === targetId) return true;
        if ('blocks' in parentNode && parentNode.blocks) {
            return !!getSelectedNode(parentNode.blocks, targetId);
        }
        return false;
    };

    const moveNode = (sourceId: string, targetId: string) => {
        if (sourceId === targetId || isDescendant(sourceId, targetId)) return;

        const sourceNode = getSelectedNode(components, sourceId);
        if (!sourceNode) return;

        const newComponents = deleteNodeFromTree(components, sourceId);

        if (targetId === 'canvas') {
            handleSetComponents([...newComponents, sourceNode]);
            return;
        }

        const insertNode = (nodes: ComponentNode[]): ComponentNode[] => {
            const result: ComponentNode[] = [];
            for (const node of nodes) {
                if (node.id === targetId) {
                    if (
                        dragPosition === 'inside' &&
                        node.type === 'container'
                    ) {
                        result.push({
                            ...node,
                            blocks: [...(node.blocks || []), sourceNode],
                        } as ComponentNode);
                    } else if (dragPosition === 'top') {
                        result.push(sourceNode);
                        result.push(node);
                    } else {
                        result.push(node);
                        result.push(sourceNode);
                    }
                } else if ('blocks' in node && node.blocks) {
                    result.push({
                        ...node,
                        blocks: insertNode(node.blocks),
                    } as ComponentNode);
                } else {
                    result.push(node);
                }
            }
            return result;
        };

        handleSetComponents(insertNode(newComponents));
    };

    const handleDropNode = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        setDragOverNodeId(null);
        setDragPosition(null);

        const draggedNodeId = e.dataTransfer.getData('draggedNodeId');
        const componentType = e.dataTransfer.getData('componentType');

        if (draggedNodeId) {
            moveNode(draggedNodeId, id);
        } else if (componentType) {
            const newNode = createDefaultNode(componentType);

            const insertNewNode = (nodes: ComponentNode[]): ComponentNode[] => {
                const result: ComponentNode[] = [];
                for (const node of nodes) {
                    if (node.id === id) {
                        if (
                            dragPosition === 'inside' &&
                            node.type === 'container'
                        ) {
                            result.push({
                                ...node,
                                blocks: [...(node.blocks || []), newNode],
                            } as ComponentNode);
                        } else if (dragPosition === 'top') {
                            result.push(newNode);
                            result.push(node);
                        } else {
                            result.push(node);
                            result.push(newNode);
                        }
                    } else if ('blocks' in node && node.blocks) {
                        result.push({
                            ...node,
                            blocks: insertNewNode(node.blocks),
                        } as ComponentNode);
                    } else {
                        result.push(node);
                    }
                }
                return result;
            };

            handleSetComponents(insertNewNode(components));
            setSelectedNodeId(newNode.id);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const draggedNodeId = e.dataTransfer.getData('draggedNodeId');
        const type = e.dataTransfer.getData('componentType');

        if (draggedNodeId) {
            moveNode(draggedNodeId, 'canvas');
        } else if (type) {
            const newNode = createDefaultNode(type);
            handleSetComponents([...components, newNode]);
        }
    };

    const createDefaultNode = (type: string): ComponentNode => {
        const base = { id: generateId(), type };
        switch (type) {
            case 'container':
                return {
                    ...base,
                    blocks: [],
                    direction: 'column',
                    paddingX: 'md',
                    paddingY: 'md',
                } as ComponentNode;

            case 'price':
                return {
                    ...base,
                    price: 'R$ 99,90',
                    originalPrice: 'R$ 149,90',
                    discountPercent: '33',
                    showOriginalPrice: true,
                    showDiscountPercent: true,
                } as ComponentNode;
            case 'text':
                return {
                    ...base,
                    value: 'Novo Texto',
                    typography: 'body',
                    color: 'gray-900',
                } as ComponentNode;
            case 'media':
                return {
                    ...base,
                    url: '',
                    alt: 'Mídia',
                    width: '100%',
                    height: '200px',
                } as ComponentNode;
            case 'icon':
                return {
                    ...base,
                    icon: 'star',
                    size: 24,
                    padding: 'xs',
                    backgroundColor: undefined,
                    borderRadius: 'full',
                } as ComponentNode;
            case 'button':
                return {
                    ...base,
                    label: 'Clique Aqui',
                    variant: 'primary',
                    radius: 'md',
                } as ComponentNode;
            case 'post_interactions':
                return {
                    ...base,
                    showLike: true,
                    showSave: true,
                    showShare: true,
                    onLike: {
                        type: 'UI_ACTION',
                        payload: { actionName: 'like' },
                    },
                    onSave: {
                        type: 'UI_ACTION',
                        payload: { actionName: 'save' },
                    },
                    onShare: {
                        type: 'UI_ACTION',
                        payload: { actionName: 'share' },
                    },
                } as ComponentNode;
            case 'avatar':
                return {
                    ...base,
                    url: '{{post.profile.iconUrl}}',
                    icon: 'user',
                    size: 40,
                    backgroundColor: 'gray-100',
                    borderRadius: 'full',
                } as ComponentNode;
            case 'header':
                return {
                    ...base,
                    imageUrl: '{{post.profile.iconUrl}}',
                    title: '{{post.profile.accountName}}',
                    menuItems: [
                        { icon: 'info', text: 'Sobre esta conta', link: '' },
                        { icon: 'user', text: 'Seguir', link: '' },
                    ],
                } as ComponentNode;
            default:
                return base as ComponentNode;
        }
    };

    return (
        <Content className="tb-root cockpit-content-align flex flex-col h-full bg-[#f8fafc]">
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4">
                {/* LEFT: Back + Name */}
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/template-builder/list')}
                    type="text"
                    size="small"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-700"
                />

                <Input
                    addonBefore={
                        <span className="text-xs text-gray-400">Nome</span>
                    }
                    value={templateName}
                    onChange={(e) => handleRenameTemplate(e.target.value)}
                    placeholder="Nome do template..."
                    disabled={isLoading}
                    className="w-[260px] flex-shrink-0 text-sm [&_.ant-input-group-addon]:bg-gray-50 [&_.ant-input-group-addon]:border-gray-200 [&_.ant-input]:border-gray-200 [&_.ant-input-group-wrapper]:shadow-none"
                />

                <div className="h-5 w-px bg-gray-200 flex-shrink-0" />

                <Input
                    addonBefore={
                        <span className="text-xs text-gray-400">Slug</span>
                    }
                    prefix={
                        <span className="text-gray-300 text-xs font-mono">
                            /
                        </span>
                    }
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="meu-template"
                    disabled={isLoading}
                    className="w-[210px] flex-shrink-0 text-xs font-mono [&_.ant-input-group-addon]:bg-gray-50 [&_.ant-input-group-addon]:border-gray-200 [&_.ant-input]:border-gray-200 [&_.ant-input-group-wrapper]:shadow-none"
                />

                {/* SPACER */}
                <div className="flex-1" />

                {/* RIGHT: Status + Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
                        <Switch
                            size="small"
                            checked={enabled}
                            onChange={setEnabled}
                            disabled={isLoading}
                        />
                        <Typography.Text className="text-[11px] font-medium text-gray-500 select-none">
                            {enabled ? 'Ativo' : 'Inativo'}
                        </Typography.Text>
                    </div>

                    <Button
                        icon={<BgColorsOutlined />}
                        onClick={() => setIsThemeDrawerOpen(true)}
                        className="text-gray-600"
                        disabled={isLoading}
                    >
                        Editar Tema Global
                    </Button>

                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        className="bg-primary shadow-sm"
                        disabled={isLoading}
                    >
                        Salvar
                    </Button>
                </div>
            </div>

            <Layout className="flex-1 min-h-0 bg-transparent relative">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                        <Spin size="large" />
                    </div>
                )}
                <Sider
                    width={280}
                    theme="light"
                    className="border-r border-gray-200 overflow-y-auto"
                    style={{ background: '#fff' }}
                >
                    <Sidebar
                        onDragStart={handleDragStart}
                        activeTab={isDragOver ? 'elements' : undefined}
                        onImportJson={handleImportJson}
                    />
                </Sider>

                <Content
                    className="relative flex flex-col items-center justify-start p-8"
                    onClick={() => handleSelectNode(null)}
                >
                    <CanvasArea
                        showGuides={showGuides}
                        setShowGuides={setShowGuides}
                        components={components}
                        theme={theme}
                        selectedNodeId={selectedNodeId}
                        isDragOver={isDragOver}
                        dragOverNodeId={dragOverNodeId}
                        dragPosition={dragPosition}
                        onSelectNode={handleSelectNode}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragStartNode={handleDragStartNode}
                        onDragOverNode={handleDragOverNode}
                        onDragLeaveNode={handleDragLeaveNode}
                        onDropNode={handleDropNode}
                        onSave={handleSave}
                        templateName={templateName}
                        onRenameTemplate={handleRenameTemplate}
                    >
                        {selectedNode && (
                            <PropertiesPopup
                                selectedNode={selectedNode}
                                onUpdateNode={handleUpdateNode}
                                onClose={() => handleSelectNode(null)}
                            />
                        )}
                    </CanvasArea>
                </Content>
            </Layout>

            <ThemeDrawer
                open={isThemeDrawerOpen}
                onClose={() => setIsThemeDrawerOpen(false)}
                theme={theme}
                onThemeChange={async (newTheme) => {
                    setTheme(newTheme);
                    await persistGlobalTheme(newTheme);
                }}
            />
        </Content>
    );
}
