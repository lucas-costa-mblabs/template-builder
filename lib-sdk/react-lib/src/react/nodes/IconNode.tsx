import type { CSSProperties } from "react";
import type { ComponentNode } from "../../core/types.js";
import { useTemplateContext } from "../context.js";
import { tokenToPx, getRadius, colorToHex } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { ShoppingBag, Sparkles } from "lucide-react";

interface IconNodeProps {
  node: ComponentNode;
  dataContext?: Record<string, unknown>;
}

export function IconNode({ node, dataContext }: IconNodeProps) {
  const { theme } = useTemplateContext();

  const baseStyle: CSSProperties = {
    flex: node.flex || undefined,
  };

  const p = tokenToPx(theme, node.padding) || "0";
  const size = (typeof node.size === "number" ? node.size : 20) as number;
  const color = colorToHex(theme, node.color) || "#1f2937";

  const IconComponent = node.icon === "shoppingbag" ? ShoppingBag : Sparkles;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          colorToHex(theme, node.backgroundColor) || "transparent",
        padding: p,
        borderRadius: getRadius(theme, node.borderRadius) || "0",
        cursor: node.action ? "pointer" : undefined,
        ...baseStyle,
      }}
      onClick={
        node.action ? () => executeAction(node.action, dataContext) : undefined
      }
    >
      <IconComponent size={size} color={color} strokeWidth={1.5} />
    </div>
  );
}
