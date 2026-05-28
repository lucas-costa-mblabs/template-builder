import { Theme } from '../../types';
interface ThemeDrawerProps {
    open: boolean;
    onClose: () => void;
    theme: Theme;
    onThemeChange: (newTheme: Theme) => void;
    onSave?: (newTheme: Theme) => void;
    title?: string;
}
export default function ThemeDrawer({ open, onClose, theme, onThemeChange, onSave, title, }: ThemeDrawerProps): import("react/jsx-runtime").JSX.Element;
export {};
