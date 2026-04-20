import { Route, Routes, Navigate } from "react-router-dom";
import TemplateList from "./pages/TemplateList";
import TemplateEditor from "./pages/TemplateEditor";

export default function TemplateBuilderRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<TemplateList />} />
      <Route path="editor/:id" element={<TemplateEditor />} />
    </Routes>
  );
}
