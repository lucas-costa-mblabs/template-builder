import type { 
  ComponentNode, 
  ContainerComponentNode, 
  TextComponentNode, 
  MediaComponentNode, 
  ButtonComponentNode, 
  DividerComponentNode,
  PriceComponentNode,
  Theme 
} from "../types";

export function renderToHtml(components: ComponentNode[], theme: Theme): string {
  const getActionHref = (button: ButtonComponentNode): string => {
    if (button.action?.type === "DEEPLINK") {
      return String(
        button.action.payload.deeplink || button.action.payload.url || "",
      );
    }

    if (button.action?.type === "OPEN_URL") {
      return String(button.action.payload.url || "");
    }

    return button.url || "";
  };

  const tokenToPx = (token?: string) => {
    if (!token) return "";
    if (theme.spacing && token in theme.spacing) {
      return theme.spacing[token as keyof Theme["spacing"]];
    }
    switch (token) {
      case "xs": return "4px";
      case "sm": return "8px";
      case "md": return "16px";
      case "lg": return "24px";
      case "xl": return "32px";
      case "xxl": return "48px";
      default: return token.includes('px') || token.includes('%') ? token : "";
    }
  };

  const colorToHex = (token?: string) => {
    if (!token) return "";
    if (theme?.colors && token in theme.colors) {
      return theme.colors[token as keyof Theme["colors"]];
    }
    // Fallback constants mirroring ComponentRenderer.tsx
    const fallbacks: Record<string, string> = {
      white: "#ffffff",
      black: "#000000",
      "gray-50": "#f8fafc",
      "gray-100": "#f1f5f9",
      "gray-200": "#e2e8f0",
      "gray-300": "#cbd5e1",
      "gray-400": "#94a3b8",
      "gray-500": "#64748b",
      "gray-600": "#475569",
      "gray-700": "#334155",
      "gray-800": "#1e293b",
      "gray-900": "#0f172a",
      primary: "#6366f1",
      secondary: "#94a3b8",
      accent: "#f59e0b",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    };
    return fallbacks[token] || token;
  };

  const getRadius = (r?: string) => {
    if (!r) return "0";
    if (theme.borderRadius && r in theme.borderRadius) {
      return theme.borderRadius[r as keyof Theme["borderRadius"]];
    }
    switch (r) {
      case "sm": return "4px";
      case "md": return "8px";
      case "lg":
      case "full": return "9999px";
      default: return r.includes('px') ? r : "0";
    }
  };

  const renderNode = (node: ComponentNode): string => {
    let styles = "";
    const baseStyles = node.flex ? `flex: ${node.flex};` : "";

    switch (node.type) {
      case "container": {
        const c = node as ContainerComponentNode;
        const px = tokenToPx(c.paddingX);
        const py = tokenToPx(c.paddingY);
        const mx = tokenToPx(c.marginX);
        const my = tokenToPx(c.marginY);
        styles = `
          display: flex;
          flex-direction: ${c.direction || "column"};
          justify-content: ${c.justifyContent || "flex-start"};
          align-items: ${c.alignItems || "stretch"};
          padding: ${py || "0"} ${px || "0"};
          margin: ${my || "0"} ${mx || "0"};
          gap: ${tokenToPx(c.gap) || "0"};
          background-color: ${colorToHex(c.backgroundColor) || "transparent"};
          border-radius: ${getRadius(c.borderRadius)};
          ${c.borderWidth ? `border: ${c.borderWidth} ${c.borderStyle || "solid"} ${colorToHex(c.borderColor) || "#000"};` : ""}
          width: ${c.width || "auto"};
          height: ${c.height || "auto"};
          box-sizing: border-box;
          ${baseStyles}
        `;
        const children = (c.blocks || []).map(renderNode).join("");
        return `<div style="${styles.replace(/\s+/g, " ")}">${children}</div>`;
      }

      case "text": {
        const t = node as TextComponentNode;
        let fontSize = "16px";
        let fontWeight = "normal";
        if (t.typography === "caption") fontSize = "12px";
        else if (t.typography?.startsWith("heading")) {
            const level = t.typography.replace("heading", "");
            fontSize = level === "1" ? "32px" : level === "2" ? "24px" : level === "3" ? "20px" : "18px";
            fontWeight = "bold";
        }
        if (t.fontWeight === "bold") fontWeight = "bold";
        else if (t.fontWeight === "semiBold") fontWeight = "600";

        styles = `
          font-size: ${fontSize};
          font-weight: ${fontWeight};
          color: ${colorToHex(t.color) || "#000"};
          margin: 0;
          ${baseStyles}
        `;
        // Handle alignment
        if (t.textAlign) {
          styles += `text-align: ${t.textAlign};`;
        }

        return `<div style="${styles.replace(/\s+/g, " ")}">${t.value}</div>`;
      }

      case "media": {
        const m = node as MediaComponentNode;
        styles = `
          width: ${m.width || "100%"};
          height: ${m.height || "auto"};
          object-fit: ${m.objectFit || "cover"};
          display: block;
          ${baseStyles}
        `;
        return `<img src="${m.url}" alt="${m.alt || ""}" style="${styles.replace(/\s+/g, " ")}" />`;
      }

      case "button": {
        const b = node as ButtonComponentNode;
        const isGhost = b.variant === "ghost";
        const isOutline = b.variant === "outline";
        
        const primaryColor = colorToHex("primary");
        const bg = (isGhost || isOutline) ? "transparent" : colorToHex(b.background) || primaryColor;
        const color = (isGhost || isOutline) ? colorToHex(b.background) || primaryColor : "white";
        const border = isOutline ? `1px solid ${color}` : "none";
        
        styles = `
          background-color: ${bg};
          color: ${color};
          border: ${border};
          padding: 10px 16px;
          border-radius: ${getRadius(b.radius) || "8px"};
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          width: ${b.fullWidth ? "100%" : "auto"};
          box-sizing: border-box;
          ${baseStyles}
        `;
        const href = getActionHref(b) || "#";
        return `<a href="${href}" style="${styles.replace(/\s+/g, " ")}">${b.label}</a>`;
      }
      
      case "divider": {
        const d = node as DividerComponentNode;
        const thickness = d.thickness === "thick" ? "2px" : "1px";
        return `<hr style="border: none; border-top: ${thickness} solid #e2e8f0; margin: 8px 0; width: 100%;" />`;
      }

      case "price": {
          const p = node as PriceComponentNode;
          const px = tokenToPx(p.paddingX) || "0";
          const py = tokenToPx(p.paddingY) || "8px";
          const gray900 = colorToHex("gray-900");
          const gray400 = colorToHex("gray-400");
          const errorColor = colorToHex("error");

          styles = `
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: ${py} ${px};
            ${baseStyles}
          `;

          let html = `<div style="${styles.replace(/\s+/g, " ")}">`;
          html += `<div style="display: flex; align-items: center; gap: 6px;">`;
          if (p.showOriginalPrice !== false && p.originalPrice) {
            html += `<span style="font-size: 12px; color: ${gray400}; text-decoration: line-through;">${p.originalPrice}</span>`;
          }
          if (p.showDiscountPercent !== false && p.discountPercent) {
            html += `<span style="background-color: ${errorColor}20; color: ${errorColor}; font-size: 10px; font-weight: bold; padding: 1px 4px; border-radius: 3px;">${p.discountPercent}% OFF</span>`;
          }
          html += `</div>`;
          html += `<span style="font-size: 20px; font-weight: bold; color: ${gray900};">${p.price}</span>`;
          html += `</div>`;
          return html;
      }

      default:
        return "<!-- Unknown Component -->";
    }
  };

  return components.map(renderNode).join("");
}
