import { getTemplateClient, getAccountClient, getBuilderConfig } from '../config';
import { theme as defaultTheme } from '../theme';
import type { Theme, TemplateBuilderTemplate, ComponentNode } from '../types';

interface TemplateAPIPayload {
  templateId: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  active: boolean;
  data: ComponentNode[] | Record<string, never>;
}

function apiToTemplate(payload: TemplateAPIPayload): TemplateBuilderTemplate {
  return {
    id: payload.templateId,
    title: payload.name,
    slug: payload.slug,
    active: payload.active ?? true,
    template: Array.isArray(payload.data) ? payload.data : [],
  };
}

function templateToApi(template: TemplateBuilderTemplate): TemplateAPIPayload {
  return {
    templateId: template.id,
    name: template.title,
    slug: template.slug,
    active: template.active ?? true,
    description: '',
    content: '',
    data: template.template,
  };
}

interface APITheme {
  primaryColor?: string;
  secondaryColor?: string;
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  typography?: Record<string, string>;
}

function apiThemeToTheme(apiTheme: APITheme | null | undefined): Theme {
  if (!apiTheme) return defaultTheme;
  if (apiTheme.colors) {
    return {
      colors: { ...defaultTheme.colors, ...apiTheme.colors },
      spacing: { ...defaultTheme.spacing, ...apiTheme.spacing },
      borderRadius: { ...defaultTheme.borderRadius, ...apiTheme.borderRadius },
      typography: { ...defaultTheme.typography, ...apiTheme.typography },
    };
  }
  return {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      ...(apiTheme.primaryColor && { primary: apiTheme.primaryColor }),
      ...(apiTheme.secondaryColor && { secondary: apiTheme.secondaryColor }),
    },
  };
}

export async function getGlobalTheme(): Promise<Theme> {
  try {
    const response = await getAccountClient().get('/theme');
    return apiThemeToTheme(response.data?.data);
  } catch {
    return defaultTheme;
  }
}

function themeToApiTheme(theme: Theme): APITheme {
  return {
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    typography: theme.typography,
  };
}

export async function saveGlobalTheme(theme: Theme): Promise<void> {
  await getAccountClient().put('/theme', themeToApiTheme(theme));
}

export async function getTemplates(): Promise<TemplateBuilderTemplate[]> {
  const accountId = getBuilderConfig().getAccountId();
  const response = await getTemplateClient().get(`/templates/account/${accountId}`);
  const data: TemplateAPIPayload[] = response.data?.data ?? [];
  return data.map(apiToTemplate);
}

export async function getTemplateById(id: string): Promise<TemplateBuilderTemplate | undefined> {
  try {
    const response = await getTemplateClient().get(`/templates/${id}`);
    const data: TemplateAPIPayload = response.data?.data ?? response.data;
    return data ? apiToTemplate(data) : undefined;
  } catch (error: unknown) {
    if ((error as { response?: { status?: number } })?.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function createTemplate(template: TemplateBuilderTemplate): Promise<void> {
  await getTemplateClient().post('/templates', templateToApi(template));
}

export async function updateTemplate(template: TemplateBuilderTemplate): Promise<void> {
  await getTemplateClient().patch(`/templates/${template.id}`, templateToApi(template));
}

export async function deleteTemplate(templateId: string): Promise<void> {
  await getTemplateClient().delete(`/templates/${templateId}`);
}

export async function getTemplateData(id: string) {
  const template = await getTemplateById(id);

  return {
    found: !!template,
    components: template?.template || [],
    theme: await getGlobalTheme(),
    slug: template?.slug || '',
    title: template?.title || '',
    enabled: template?.active !== false,
  };
}
