import { default as React } from 'react';
interface SidebarProps {
    onDragStart: (e: React.DragEvent, type: string) => void;
    activeTab?: string;
    onImportJson?: (jsonText: string) => boolean;
}
export default function Sidebar({ onDragStart, activeTab: controlledTab, onImportJson }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
