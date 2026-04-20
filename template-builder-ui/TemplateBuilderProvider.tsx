import { useRef, type ReactNode } from 'react';
import { initTemplateBuilder, type TemplateBuilderConfig } from './config';

interface TemplateBuilderProviderProps {
  config: TemplateBuilderConfig;
  children: ReactNode;
}

export function TemplateBuilderProvider({ config, children }: TemplateBuilderProviderProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    initTemplateBuilder(config);
    initialized.current = true;
  }

  return <>{children}</>;
}
