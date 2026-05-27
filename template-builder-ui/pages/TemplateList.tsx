import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusOutlined,
    EditOutlined,
    BgColorsOutlined,
    MoreOutlined,
    CopyOutlined,
    PoweroffOutlined,
    CodeOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Dropdown,
    Tag,
    Skeleton,
    message,
    Empty,
    Alert,
    Modal,
} from 'antd';
import TemplateBuilderPreview from '../components/TemplateBuilderPreview';
import ThemeDrawer from '../components/builder/ThemeDrawer';
import {
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from '../services/templateService';
import type { Theme, TemplateBuilderTemplate } from '../types';
import { useTemplateBuilderStore } from '../store';
import '../assets/style.css';

const { Content } = Layout;
const { Text } = Typography;

function TemplateCard({
    t,
    onOpen,
    onDuplicate,
    onCopyJson,
    onToggleEnabled,
    onDelete,
    theme,
}: {
    t: TemplateBuilderTemplate;
    onOpen: () => void;
    onDuplicate: (id: string) => void;
    onCopyJson: (id: string) => void;
    onToggleEnabled: (id: string, enabled: boolean) => void;
    onDelete: (id: string) => void;
    theme?: Theme;
}) {
    const isActive = t.active !== false;
    const components = t.template || [];

    const menuItems = [
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditOutlined />,
        },
        {
            key: 'duplicate',
            label: 'Duplicar',
            icon: <CopyOutlined />,
        },
        {
            key: 'copyJson',
            label: 'Copiar JSON',
            icon: <CodeOutlined />,
        },
        {
            key: 'toggle',
            label: isActive ? 'Desativar' : 'Ativar',
            icon: <PoweroffOutlined />,
        },
        {
            key: 'delete',
            label: 'Excluir',
            icon: <DeleteOutlined />,
            danger: true,
        },
    ];

    return (
        <Card
            hoverable
            className="h-full flex flex-col overflow-hidden cursor-pointer"
            onClick={onOpen}
            cover={
                <div className="h-80 bg-gray-50 flex items-center justify-center relative overflow-hidden border-b">
                    <TemplateBuilderPreview
                        template={components.length > 0 ? t : null}
                        theme={theme}
                        scale={0.5}
                        width="420px"
                        height="550px"
                        wrapperStyle={{
                            position: 'absolute',
                            inset: 0,
                        }}
                    />

<div
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown
                            menu={{
                                items: menuItems,
                                onClick: ({ key, domEvent }) => {
                                    domEvent.stopPropagation();
                                    if (key === 'edit') onOpen();
                                    if (key === 'duplicate') onDuplicate(t.id);
                                    if (key === 'copyJson') onCopyJson(t.id);
                                    if (key === 'toggle')
                                        onToggleEnabled(t.id, !isActive);
                                    if (key === 'delete') onDelete(t.id);
                                },
                            }}
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                className="!bg-white hover:!bg-white shadow-md border border-gray-200"
                            />
                        </Dropdown>
                    </div>
                </div>
            }
        >
            <Card.Meta
                title={
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-800 truncate">
                            {t.title}
                        </span>
                        <Tag
                            color={isActive ? 'success' : 'default'}
                            className="flex-shrink-0"
                        >
                            {isActive ? 'Ativo' : 'Inativo'}
                        </Tag>
                    </div>
                }
                description={
                    <div className="flex flex-col gap-1">
                        <Text
                            type="secondary"
                            className="text-xs text-gray-400"
                        >
                            <span className="font-bold">ID:</span> {t.id}
                        </Text>
                        {t.slug && (
                            <Text
                                type="secondary"
                                className="text-xs text-gray-400"
                            >
                                <span className="font-bold">Slug:</span>{' '}
                                {t.slug}
                            </Text>
                        )}
                    </div>
                }
            />
        </Card>
    );
}

export default function TemplateList() {
    const navigate = useNavigate();
    const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
    const templates = useTemplateBuilderStore((state) => state.templates);
    const globalTheme = useTemplateBuilderStore((state) => state.globalTheme);
    const templatesStatus = useTemplateBuilderStore(
        (state) => state.templatesStatus
    );
    const themeStatus = useTemplateBuilderStore((state) => state.themeStatus);
    const templatesError = useTemplateBuilderStore(
        (state) => state.templatesError
    );
    const themeError = useTemplateBuilderStore((state) => state.themeError);
    const hydrateCatalog = useTemplateBuilderStore(
        (state) => state.hydrateCatalog
    );
    const loadTemplates = useTemplateBuilderStore(
        (state) => state.loadTemplates
    );
    const persistGlobalTheme = useTemplateBuilderStore(
        (state) => state.persistGlobalTheme
    );
    const upsertTemplate = useTemplateBuilderStore(
        (state) => state.upsertTemplate
    );
    const removeTemplate = useTemplateBuilderStore(
        (state) => state.removeTemplate
    );
    const isLoading =
        templatesStatus === 'loading' || themeStatus === 'loading';
    const hasError = templatesStatus === 'error' || themeStatus === 'error';
    const errorDescription = templatesError || themeError;

    const refresh = async () => {
        try {
            await hydrateCatalog({ force: true });
        } catch {
            message.error('Erro ao atualizar o catálogo de templates.');
        }
    };

    useEffect(() => {
        void hydrateCatalog();
    }, [hydrateCatalog]);

    const handleDuplicate = async (id: string) => {
        const template = templates.find((t) => t.id === id);
        if (!template) return;
        const copy: TemplateBuilderTemplate = {
            ...template,
            id: `template-${Date.now()}`,
            title: `${template.title} (cópia)`,
            slug: `${template.slug}-copia-${Date.now()}`,
            active: false,
        };
        try {
            await createTemplate(copy);
            upsertTemplate(copy);
            await loadTemplates({ force: true });
            message.success('Template duplicado com sucesso!');
        } catch {
            message.error('Erro ao duplicar o template.');
        }
    };

    const handleCopyJson = (id: string) => {
        const template = templates.find((t) => t.id === id);
        if (!template) return;
        navigator.clipboard.writeText(
            JSON.stringify(template.template, null, 2)
        );
        message.success('JSON copiado para a área de transferência!');
    };

    const handleToggleEnabled = async (id: string, enabled: boolean) => {
        const template = templates.find((t) => t.id === id);
        if (!template) return;
        const updated = { ...template, active: enabled };
        upsertTemplate(updated);
        try {
            await updateTemplate(updated);
        } catch {
            upsertTemplate(template);
            message.error('Erro ao atualizar o status do template.');
        }
    };

    const handleDelete = (id: string) => {
        const template = templates.find((t) => t.id === id);
        Modal.confirm({
            title: 'Excluir template',
            content: `Tem certeza que deseja excluir "${template?.title}"? Essa ação não pode ser desfeita.`,
            okText: 'Excluir',
            okButtonProps: { danger: true },
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await deleteTemplate(id);
                    removeTemplate(id);
                    message.success('Template excluído com sucesso!');
                } catch {
                    message.error('Erro ao excluir o template.');
                }
            },
        });
    };

    const handleGlobalThemeChange = async (newTheme: Theme) => {
        await persistGlobalTheme(newTheme);
    };

    return (
        <Content className="tb-root cockpit-content-align">
            <div className="cockpit-subheader">
                <Row align="middle" justify="space-between">
                    <Col>
                        <h2 className="cockpit-subheader-title">
                            Gestão de Templates
                        </h2>
                    </Col>
                    <Col>
                        <Space size="middle">
                            <Button
                                icon={<BgColorsOutlined />}
                                onClick={() => setIsGlobalDrawerOpen(true)}
                            >
                                Editar Tema Global
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    navigate('/template-builder/editor/new')
                                }
                                className="bg-primary flex items-center"
                            >
                                Criar Template
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <div className="px-6 py-8">
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {isLoading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card
                                key={i}
                                cover={
                                    <div className="h-80 bg-gray-100 animate-pulse" />
                                }
                            >
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        ))}

                    {!isLoading && hasError && (
                        <div className="col-span-full">
                            <Alert
                                type="error"
                                message="Não foi possível carregar os templates."
                                description={
                                    errorDescription ||
                                    'Verifique sua conexão e tente novamente.'
                                }
                                showIcon
                                action={
                                    <Button size="small" onClick={refresh}>
                                        Tentar novamente
                                    </Button>
                                }
                            />
                        </div>
                    )}

                    {!isLoading && !hasError && templates.length === 0 && (
                        <div className="col-span-full flex justify-center py-16">
                            <Empty description="Nenhum template encontrado. Crie o seu primeiro!" />
                        </div>
                    )}

                    {!isLoading &&
                        !hasError &&
                        templates.map((t) => (
                            <TemplateCard
                                key={t.id}
                                t={t}
                                onOpen={() =>
                                    navigate(`/template-builder/editor/${t.id}`)
                                }
                                onDuplicate={handleDuplicate}
                                onCopyJson={handleCopyJson}
                                onToggleEnabled={handleToggleEnabled}
                                onDelete={handleDelete}
                                theme={globalTheme}
                            />
                        ))}
                </div>
            </div>

            <ThemeDrawer
                open={isGlobalDrawerOpen}
                onClose={() => setIsGlobalDrawerOpen(false)}
                theme={globalTheme}
                onThemeChange={handleGlobalThemeChange}
            />
        </Content>
    );
}
