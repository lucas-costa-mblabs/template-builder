import { default as React } from 'react';
import { ComponentNode, Theme } from '../../types';
interface CanvasAreaProps {
    showGuides: boolean;
    setShowGuides: (show: boolean) => void;
    components: ComponentNode[];
    theme?: Theme;
    selectedNodeId: string | null;
    isDragOver: boolean;
    dragOverNodeId: string | null;
    dragPosition: "top" | "bottom" | "inside" | null;
    onSelectNode: (id: string | null) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragStartNode: (e: React.DragEvent, id: string) => void;
    onDragOverNode: (e: React.DragEvent, id: string) => void;
    onDragLeaveNode: (e: React.DragEvent, id: string) => void;
    onDropNode: (e: React.DragEvent, id: string) => void;
    onSave?: () => void;
    templateName?: string;
    onRenameTemplate?: (name: string) => void;
    children?: React.ReactNode;
}
export default function CanvasArea({ showGuides, setShowGuides, components, theme: dynamicTheme, selectedNodeId, isDragOver, dragOverNodeId, dragPosition, onSelectNode, onDragOver, onDragLeave, onDrop, onDragStartNode, onDragOverNode, onDragLeaveNode, onDropNode, children, }: CanvasAreaProps): import("react/jsx-runtime").JSX.Element;
export {};
