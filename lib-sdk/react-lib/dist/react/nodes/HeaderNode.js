import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useTemplateContext } from "../context.js";
import { resolveVariables } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { AvatarNode } from "./AvatarNode.js";
import { MoreVertical, Flag, UserPlus, Check, Store, Heart, Share2, Bookmark, AlertTriangle, Info, Star, User, } from "lucide-react";
const iconMap = {
    more: MoreVertical,
    flag: Flag,
    report: AlertTriangle,
    follow: UserPlus,
    store: Store,
    heart: Heart,
    share: Share2,
    bookmark: Bookmark,
    info: Info,
    star: Star,
    user: User,
};
export function HeaderNode({ node, dataContext }) {
    const { tracker, getIsFollowing: getIsFollowingFromContext, setIsFollowing: setIsFollowingFromContext, } = useTemplateContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const menuRef = useRef(null);
    const avatarUrl = resolveVariables(node.imageUrl, dataContext)?.trim();
    const title = resolveVariables(node.title || node.value, dataContext);
    const getIsFollowing = getIsFollowingFromContext || ((_profileAccountId) => false);
    const setIsFollowing = setIsFollowingFromContext ||
        ((_profileAccountId, _isFollowing) => { });
    const handleProfilePress = node.onProfilePress
        ? () => executeAction(node.onProfilePress, dataContext)
        : undefined;
    const post = dataContext?.post || {};
    const profile = post.profile || {};
    const profileAccountId = profile.accountId?.trim() ||
        post.accountId?.trim() ||
        "";
    const initialFollowing = post.following === true ||
        post.isFollowing === true ||
        post.isFollower === true ||
        profile.following === true ||
        profile.isFollowing === true;
    useEffect(() => {
        if (profileAccountId && initialFollowing) {
            setIsFollowing(profileAccountId, true);
        }
    }, [initialFollowing, profileAccountId, setIsFollowing]);
    const isFollowing = profileAccountId
        ? getIsFollowing(profileAccountId)
        : initialFollowing;
    const handleMenuItemClick = async (item) => {
        setMenuOpen(false);
        const actionName = item.action?.payload?.actionName?.trim().toLowerCase();
        const isFollowAction = actionName === "follow" || actionName === "unfollow";
        if (!isFollowAction || !profileAccountId) {
            if (item.action)
                executeAction(item.action, dataContext);
            return;
        }
        const nextFollowing = !isFollowing;
        setIsFollowLoading(true);
        setIsFollowing(profileAccountId, nextFollowing);
        try {
            await tracker.toggleFollowAccount(profileAccountId, isFollowing);
        }
        catch (error) {
            setIsFollowing(profileAccountId, isFollowing);
            console.error("DirectoAi SDK: Failed to toggle follow state:", error);
        }
        finally {
            setIsFollowLoading(false);
        }
    };
    // Close dropdown when clicking outside
    useEffect(() => {
        if (!menuOpen)
            return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);
    const baseStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
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
                        }, dataContext: dataContext }), _jsxs("div", { style: {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }, children: [_jsx("span", { style: {
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#111827",
                                    lineHeight: 1.2,
                                }, children: title }), Boolean(dataContext?.post?.sponsored) && (_jsx("span", { style: {
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    color: "#9ca3af",
                                    lineHeight: 1.2,
                                    marginTop: "2px",
                                }, children: "Patrocinado" }))] })] }), node.menuItems && node.menuItems.length > 0 && (_jsxs("div", { ref: menuRef, style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }, children: [isFollowing && (_jsxs("div", { "aria-label": "Seguindo", title: "Seguindo", style: {
                            position: "relative",
                            width: "20px",
                            height: "20px",
                            color: "#6b7280",
                        }, children: [_jsx("div", { style: {
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "9999px",
                                    border: "1.8px solid #6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxSizing: "border-box",
                                    backgroundColor: "#ffffff",
                                }, children: _jsx(User, { size: 11, strokeWidth: 1.8 }) }), _jsx("div", { style: {
                                    position: "absolute",
                                    right: "-1px",
                                    top: "-1px",
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }, children: _jsx(Check, { size: 8, strokeWidth: 2.2, color: "#6b7280" }) })] })), _jsx("div", { role: "button", "aria-label": "Abrir op\u00E7\u00F5es", style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }, onClick: () => setMenuOpen((prev) => !prev), children: _jsx(MoreVertical, { size: 20, color: "#6b7280", strokeWidth: 1.5 }) }), menuOpen && (_jsx("div", { style: {
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            zIndex: 50,
                            minWidth: "200px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
                            border: "1px solid #e5e7eb",
                            padding: "4px 0",
                            marginTop: "4px",
                        }, children: node.menuItems.map((item, index) => {
                            const IconComp = iconMap[item.icon] || MoreVertical;
                            const actionName = item.action?.payload?.actionName
                                ?.trim()
                                .toLowerCase();
                            const isFollowAction = actionName === "follow" || actionName === "unfollow";
                            const itemLabel = isFollowAction
                                ? isFollowing
                                    ? "Deixar de seguir"
                                    : "Seguir"
                                : item.text;
                            return (_jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px 14px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#374151",
                                    transition: "background-color 0.15s",
                                }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = "#f3f4f6"), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = "transparent"), onClick: () => {
                                    void handleMenuItemClick(item);
                                }, children: [_jsx(IconComp, { size: 18, color: "#6b7280", strokeWidth: 1.5 }), _jsx("span", { children: isFollowAction && isFollowLoading
                                            ? "Processando..."
                                            : itemLabel })] }, `${node.id}-menu-${index}`));
                        }) }))] }))] }));
}
//# sourceMappingURL=HeaderNode.js.map