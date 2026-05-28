import { Theme, TemplateBuilderTemplate, ComponentNode } from '../types';
export declare function getGlobalTheme(): Promise<Theme>;
export declare function saveGlobalTheme(theme: Theme): Promise<void>;
export declare function getTemplates(): Promise<TemplateBuilderTemplate[]>;
export declare function getTemplateById(id: string): Promise<TemplateBuilderTemplate | undefined>;
export declare function createTemplate(template: TemplateBuilderTemplate): Promise<void>;
export declare function updateTemplate(template: TemplateBuilderTemplate): Promise<void>;
export declare function deleteTemplate(templateId: string): Promise<void>;
export declare function getTemplateData(id: string): Promise<{
    found: boolean;
    components: ComponentNode[];
    theme: Theme;
    slug: string;
    title: string;
    enabled: boolean;
}>;
