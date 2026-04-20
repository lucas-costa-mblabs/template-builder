import { create } from 'zustand';
import {
    getGlobalTheme,
    getTemplates,
    saveGlobalTheme,
} from './services/templateService';
import { theme as defaultTheme } from './theme';
import type { TemplateBuilderTemplate, Theme } from './types';

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

const INITIAL_STATE = {
    templates: [] as TemplateBuilderTemplate[],
    globalTheme: defaultTheme,
    templatesStatus: 'idle' as AsyncStatus,
    themeStatus: 'idle' as AsyncStatus,
    templatesError: null as string | null,
    themeError: null as string | null,
};

export const useTemplateBuilderStore = create<TemplateBuilderStore>(
    (set, get) => ({
        ...INITIAL_STATE,

        loadTemplates: async ({ force = false }: LoadOptions = {}) => {
            const { templatesStatus, templates } = get();

            if (
                !force &&
                templatesStatus === 'success' &&
                templates.length > 0
            ) {
                return templates;
            }

            set({
                templatesStatus: 'loading',
                templatesError: null,
            });

            try {
                const nextTemplates = await getTemplates();
                set({
                    templates: nextTemplates,
                    templatesStatus: 'success',
                    templatesError: null,
                });
                return nextTemplates;
            } catch (error) {
                set({
                    templatesStatus: 'error',
                    templatesError:
                        error instanceof Error
                            ? error.message
                            : 'Erro ao carregar templates',
                });
                throw error;
            }
        },

        loadGlobalTheme: async ({ force = false }: LoadOptions = {}) => {
            const { themeStatus, globalTheme } = get();

            if (!force && themeStatus === 'success') {
                return globalTheme;
            }

            set({
                themeStatus: 'loading',
                themeError: null,
            });

            try {
                const nextTheme = await getGlobalTheme();
                set({
                    globalTheme: nextTheme,
                    themeStatus: 'success',
                    themeError: null,
                });
                return nextTheme;
            } catch (error) {
                set({
                    globalTheme: defaultTheme,
                    themeStatus: 'error',
                    themeError:
                        error instanceof Error
                            ? error.message
                            : 'Erro ao carregar tema global',
                });
                throw error;
            }
        },

        hydrateCatalog: async ({ force = false }: LoadOptions = {}) => {
            await Promise.all([
                get().loadTemplates({ force }),
                get().loadGlobalTheme({ force }),
            ]);
        },

        upsertTemplate: (template) =>
            set((state) => {
                const templateExists = state.templates.some(
                    ({ id }) => id === template.id
                );

                if (templateExists) {
                    return {
                        templates: state.templates.map((item) =>
                            item.id === template.id ? template : item
                        ),
                    };
                }

                return {
                    templates: [...state.templates, template],
                };
            }),

        removeTemplate: (templateId) =>
            set((state) => ({
                templates: state.templates.filter(
                    ({ id }) => id !== templateId
                ),
            })),

        setGlobalTheme: (theme) =>
            set({
                globalTheme: theme,
                themeStatus: 'success',
                themeError: null,
            }),

        persistGlobalTheme: async (theme) => {
            set({
                globalTheme: theme,
                themeStatus: 'loading',
                themeError: null,
            });

            try {
                await saveGlobalTheme(theme);
                set({
                    globalTheme: theme,
                    themeStatus: 'success',
                    themeError: null,
                });
            } catch (error) {
                set({
                    themeStatus: 'error',
                    themeError:
                        error instanceof Error
                            ? error.message
                            : 'Erro ao salvar tema global',
                });
                throw error;
            }
        },

        reset: () => set(INITIAL_STATE),
    })
);
