import { TemplateBuilderTemplate, Theme } from '../types';
type UseBuilderCatalogResult = {
    templates: TemplateBuilderTemplate[];
    globalTheme: Theme;
    isLoading: boolean;
};
export declare function useBuilderCatalog(): UseBuilderCatalogResult;
export {};
