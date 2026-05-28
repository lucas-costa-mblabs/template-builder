import { ComponentNode } from '../../types';
interface PropertiesPopupProps {
    selectedNode: ComponentNode;
    onUpdateNode: (id: string, updates: Partial<ComponentNode>) => void;
    onClose: () => void;
}
export default function PropertiesPopup({ selectedNode, onUpdateNode, onClose, }: PropertiesPopupProps): import("react/jsx-runtime").JSX.Element;
export {};
