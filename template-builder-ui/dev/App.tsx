import { Routes, Route, Navigate } from 'react-router-dom';
import { TemplateBuilderProvider } from '@ui/TemplateBuilderProvider';
import TemplateBuilderRoutes from '@ui/routes';
import { initTemplateBuilder } from '@ui/config';

const BASE_URL = (import.meta.env.VITE_BASE_URL ?? '').replace(/\/$/, '');
const TEMPLATE_API = `${BASE_URL}/template/api/v1`;
const ACCOUNT_API = `${BASE_URL}/account/api/v1`;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN ?? '';
const ACCOUNT_ID = import.meta.env.VITE_ACCOUNT_ID ?? '';

const config = {
  templateApiBaseUrl: TEMPLATE_API,
  accountApiBaseUrl: ACCOUNT_API,
  getAuthToken: () => AUTH_TOKEN,
  getAccountId: () => ACCOUNT_ID,
};

initTemplateBuilder(config);

export default function App() {
  return (
    <TemplateBuilderProvider config={config}>
      <Routes>
        <Route path="template-builder/*" element={<TemplateBuilderRoutes />} />
        <Route path="*" element={<Navigate to="/template-builder" replace />} />
      </Routes>
    </TemplateBuilderProvider>
  );
}
