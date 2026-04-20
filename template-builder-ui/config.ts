import axios, { type AxiosInstance } from 'axios';

export interface TemplateBuilderConfig {
  templateApiBaseUrl: string;
  accountApiBaseUrl: string;
  getAuthToken: () => string | null;
  getAccountId: () => string;
}

let _config: TemplateBuilderConfig | null = null;
let _templateClient: AxiosInstance | null = null;
let _accountClient: AxiosInstance | null = null;

export function initTemplateBuilder(config: TemplateBuilderConfig): void {
  _config = config;

  _templateClient = axios.create({
    baseURL: config.templateApiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
  });

  _accountClient = axios.create({
    baseURL: config.accountApiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
  });

  const addAuthInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use((req) => {
      const token = config.getAuthToken();
      if (token) req.headers['Authorization'] = `Bearer ${token}`;
      return req;
    });
  };

  addAuthInterceptor(_templateClient);
  addAuthInterceptor(_accountClient);
}

export function getTemplateClient(): AxiosInstance {
  if (!_templateClient) throw new Error('[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.');
  return _templateClient;
}

export function getAccountClient(): AxiosInstance {
  if (!_accountClient) throw new Error('[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.');
  return _accountClient;
}

export function getBuilderConfig(): TemplateBuilderConfig {
  if (!_config) throw new Error('[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.');
  return _config;
}
