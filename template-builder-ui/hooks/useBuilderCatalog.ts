import { useEffect } from 'react';
import { useTemplateBuilderStore } from '../store';
import type { CVDTemplate, Theme } from '../types';

type UseBuilderCatalogResult = {
    templates: CVDTemplate[];
    globalTheme: Theme;
    isLoading: boolean;
};

export function useBuilderCatalog(): UseBuilderCatalogResult {
    const templates = useTemplateBuilderStore((state) => state.templates);
    const globalTheme = useTemplateBuilderStore((state) => state.globalTheme);
    const hydrateCatalog = useTemplateBuilderStore((state) => state.hydrateCatalog);
    const templatesStatus = useTemplateBuilderStore((state) => state.templatesStatus);
    const themeStatus = useTemplateBuilderStore((state) => state.themeStatus);

    useEffect(() => {
        void hydrateCatalog();
    }, [hydrateCatalog]);

    return {
        templates,
        globalTheme,
        isLoading: templatesStatus === 'loading' || themeStatus === 'loading',
    };
}
