import { CVDTemplate, Theme } from './types';
type LoadOptions = {
    force?: boolean;
};
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
type TemplateBuilderStore = {
    templates: CVDTemplate[];
    globalTheme: Theme;
    templatesStatus: AsyncStatus;
    themeStatus: AsyncStatus;
    templatesError: string | null;
    themeError: string | null;
    loadTemplates: (options?: LoadOptions) => Promise<CVDTemplate[]>;
    loadGlobalTheme: (options?: LoadOptions) => Promise<Theme>;
    hydrateCatalog: (options?: LoadOptions) => Promise<void>;
    upsertTemplate: (template: CVDTemplate) => void;
    removeTemplate: (templateId: string) => void;
    setGlobalTheme: (theme: Theme) => void;
    persistGlobalTheme: (theme: Theme) => Promise<void>;
    reset: () => void;
};
export declare const useTemplateBuilderStore: import('zustand').UseBoundStore<import('zustand').StoreApi<TemplateBuilderStore>>;
export {};
