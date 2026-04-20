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

export async function getGlobalTheme(): Promise<Theme> {
  try {
    const response = await getAccountClient().get('/theme');
    return response.data?.data ?? defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export async function saveGlobalTheme(theme: Theme): Promise<void> {
  await getAccountClient().put('/theme', theme);
}

export async function getTemplates(): Promise<TemplateBuilderTemplate[]> {
  const accountId = getBuilderConfig().getAccountId();
  const response = await getTemplateClient().get(`/templates/account/${accountId}`);
  const data: TemplateAPIPayload[] = response.data?.data ?? [];
  return data.map(apiToTemplate);
}

export async function getTemplateById(id: string): Promise<TemplateBuilderTemplate | undefined> {
  const response = await getTemplateClient().get(`/templates/${id}`);
  const data: TemplateAPIPayload = response.data?.data ?? response.data;
  return data ? apiToTemplate(data) : undefined;
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
