import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTemplateContext } from "../context.js";
import { resolveVariables } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { AvatarNode } from "./AvatarNode.js";
import { MoreVertical, Flag, UserPlus, Store, Heart, Share2, Bookmark, AlertTriangle, } from "lucide-react";
const iconMap = {
    more: MoreVertical,
    flag: Flag,
    report: AlertTriangle,
    follow: UserPlus,
    store: Store,
    heart: Heart,
    share: Share2,
    bookmark: Bookmark,
};
export function HeaderNode({ node, dataContext }) {
    const { theme } = useTemplateContext();
    const avatarUrl = resolveVariables(node.imageUrl, dataContext)?.trim();
    const title = resolveVariables(node.title || node.value, dataContext);
    const handleProfilePress = node.onProfilePress
        ? () => executeAction(node.onProfilePress, dataContext)
        : undefined;
    const baseStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        flex: node.flex || undefined,
    };
    return (_jsxs("div", { style: baseStyle, children: [_jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: handleProfilePress ? "pointer" : undefined,
                }, onClick: handleProfilePress, children: [_jsx(AvatarNode, { node: {
                            id: `${node.id}-avatar`,
                            type: "avatar",
                            url: avatarUrl,
                            size: 36,
                            borderRadius: "full",
                        }, dataContext: dataContext }), _jsx("span", { style: {
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#111827",
                        }, children: title })] }), node.menuItems && node.menuItems.length > 0 && (_jsx("div", { style: { display: "flex", gap: "4px", alignItems: "center" }, children: node.menuItems.map((item, index) => {
                    const IconComp = iconMap[item.icon] || MoreVertical;
                    return (_jsx("div", { style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }, onClick: () => executeAction(item.action, dataContext), title: item.text, children: _jsx(IconComp, { size: 20, color: "#6b7280", strokeWidth: 1.5 }) }, `${node.id}-menu-${index}`));
                }) }))] }));
}
//# sourceMappingURL=HeaderNode.js.map