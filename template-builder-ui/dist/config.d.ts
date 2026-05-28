import { AxiosInstance } from 'axios';
export interface TemplateBuilderConfig {
    templateApiBaseUrl: string;
    accountApiBaseUrl: string;
    getAuthToken: () => string | null;
    getAccountId: () => string;
}
export declare function initTemplateBuilder(config: TemplateBuilderConfig): void;
export declare function getTemplateClient(): AxiosInstance;
export declare function getAccountClient(): AxiosInstance;
export declare function getBuilderConfig(): TemplateBuilderConfig;
