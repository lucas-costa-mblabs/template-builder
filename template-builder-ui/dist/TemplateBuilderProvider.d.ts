import { ReactNode } from 'react';
import { TemplateBuilderConfig } from './config';
interface TemplateBuilderProviderProps {
    config: TemplateBuilderConfig;
    children: ReactNode;
}
export declare function TemplateBuilderProvider({ config, children }: TemplateBuilderProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
