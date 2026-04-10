import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useTemplateContext } from "../context.js";
import { colorToHex, getRadius, resolveVariables } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { User } from "lucide-react";
export function AvatarNode({ node, dataContext }) {
    const { theme } = useTemplateContext();
    const [imgError, setImgError] = useState(false);
    const url = resolveVariables(node.url, dataContext)?.trim();
    const size = typeof node.size === "number" ? node.size : 40;
    const bg = colorToHex(theme, node.backgroundColor) || "#e5e7eb";
    const radius = node.borderRadius === "full"
        ? "9999px"
        : getRadius(theme, node.borderRadius) || "9999px";
    const containerStyle = {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: radius,
        backgroundColor: bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: node.action ? "pointer" : undefined,
        flex: node.flex || undefined,
    };
    const handleClick = node.action
        ? () => executeAction(node.action, dataContext)
        : undefined;
    if (url && !imgError) {
        return (_jsx("div", { style: containerStyle, onClick: handleClick, children: _jsx("img", { src: url, alt: "avatar", style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }, onError: () => setImgError(true) }) }));
    }
    // Fallback: icon
    const iconSize = Math.round(size * 0.6);
    return (_jsx("div", { style: containerStyle, onClick: handleClick, children: _jsx(User, { size: iconSize, color: "#6b7280", strokeWidth: 1.5 }) }));
}
//# sourceMappingURL=AvatarNode.js.map