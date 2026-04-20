import { CVDTemplate, Theme } from '../types';
type UseBuilderCatalogResult = {
    templates: CVDTemplate[];
    globalTheme: Theme;
    isLoading: boolean;
};
export declare function useBuilderCatalog(): UseBuilderCatalogResult;
export {};
