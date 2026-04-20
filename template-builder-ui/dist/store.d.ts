import { TemplateBuilderTemplate, Theme } from './types';
type LoadOptions = {
    force?: boolean;
};
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
type TemplateBuilderStore = {
    templates: TemplateBuilderTemplate[];
    globalTheme: Theme;
    templatesStatus: AsyncStatus;
    themeStatus: AsyncStatus;
    templatesError: string | null;
    themeError: string | null;
    loadTemplates: (options?: LoadOptions) => Promise<TemplateBuilderTemplate[]>;
    loadGlobalTheme: (options?: LoadOptions) => Promise<Theme>;
    hydrateCatalog: (options?: LoadOptions) => Promise<void>;
    upsertTemplate: (template: TemplateBuilderTemplate) => void;
    removeTemplate: (templateId: string) => void;
    setGlobalTheme: (theme: Theme) => void;
    persistGlobalTheme: (theme: Theme) => Promise<void>;
    reset: () => void;
};
export declare const useTemplateBuilderStore: import('zustand').UseBoundStore<import('zustand').StoreApi<TemplateBuilderStore>>;
export {};
