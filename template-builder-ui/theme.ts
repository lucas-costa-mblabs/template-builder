import type { Theme } from "./types";

export const theme: Theme = {
  colors: {
    // Base / Brand
    primary: "#6366f1", // Indigo 500
    secondary: "#ec4899", // Pink 500
    accent: "#f59e0b", // Amber 500

    // Feedback
    success: "#22c55e", // Green 500
    warning: "#eab308", // Yellow 500
    error: "#ef4444", // Red 500
    info: "#3b82f6", // Blue 500

    // Neutrals / Grayscale
    white: "#ffffff",
    black: "#000000",
    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "gray-950": "#030712",

    // Interactions
    "primary-hover": "#4f46e5",
    "primary-active": "#4338ca",
    "secondary-hover": "#db2777",
    "secondary-active": "#be185d",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  },
  typography: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "24px",
    xxl: "32px",
  },
};
