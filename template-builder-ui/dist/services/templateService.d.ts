import { Theme, CVDTemplate, ComponentNode } from '../types';
export declare function getGlobalTheme(): Promise<Theme>;
export declare function saveGlobalTheme(theme: Theme): Promise<void>;
export declare function getTemplates(): Promise<CVDTemplate[]>;
export declare function getTemplateById(id: string): Promise<CVDTemplate | undefined>;
export declare function createTemplate(template: CVDTemplate): Promise<void>;
export declare function updateTemplate(template: CVDTemplate): Promise<void>;
export declare function deleteTemplate(templateId: string): Promise<void>;
export declare function getTemplateData(id: string): Promise<{
    found: boolean;
    components: ComponentNode[];
    theme: Theme;
    slug: string;
    title: string;
    enabled: boolean;
}>;
