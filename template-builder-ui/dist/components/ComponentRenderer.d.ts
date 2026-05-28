import { default as React } from 'react';
import { ComponentNode, Theme } from '../types';
interface RendererProps {
    node: ComponentNode;
    selectedNodeId: string | null;
    dragOverNodeId?: string | null;
    dragPosition?: "top" | "bottom" | "inside" | null;
    onSelect: (id: string) => void;
    onDragStartNode?: (e: React.DragEvent, id: string) => void;
    onDragOverNode?: (e: React.DragEvent, id: string) => void;
    onDragLeaveNode?: (e: React.DragEvent, id: string) => void;
    onDropNode?: (e: React.DragEvent, id: string) => void;
    dataContext?: Record<string, unknown>;
    theme?: Theme;
}
export default function ComponentRenderer({ node, selectedNodeId, dragOverNodeId, dragPosition, onSelect, onDragStartNode, onDragOverNode, onDragLeaveNode, onDropNode, dataContext, theme, }: RendererProps): import("react/jsx-runtime").JSX.Element;
export {};
