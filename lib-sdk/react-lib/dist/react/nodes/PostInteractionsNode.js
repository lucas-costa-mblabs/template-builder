import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useTemplateContext } from "../context.js";
import { tokenToPx } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { Heart, Bookmark, Share2 } from "lucide-react";
export function PostInteractionsNode({ node, dataContext, }) {
    const { theme, tracker } = useTemplateContext();
    const post = dataContext?.post;
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    useEffect(() => {
        setIsLiked(Boolean(post?.liked));
        setIsFavorited(Boolean(post?.favorite));
    }, [post]);
    const baseStyle = {
        flex: node.flex || undefined,
    };
    const px = tokenToPx(theme, node.paddingX) || "0";
    const py = tokenToPx(theme, node.paddingY) || "12px";
    const iconSize = 24;
    const iconStrokeWidth = 1.5;
    const shouldRunNativeAction = (action, actionName) => {
        if (!action)
            return true;
        return (action.type === "UI_ACTION" && action.payload?.actionName === actionName);
    };
    const handleLike = async () => {
        if (node.onLike) {
            executeAction(node.onLike, dataContext);
        }
        if (!post)
            return;
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        if (shouldRunNativeAction(node.onLike, "like")) {
            await tracker.toggleLike(post.contentId, post.campaignId);
        }
    };
    const handleFavorite = async () => {
        if (node.onSave) {
            executeAction(node.onSave, dataContext);
        }
        if (!post)
            return;
        const wasFavorited = isFavorited;
        setIsFavorited(!wasFavorited);
        if (shouldRunNativeAction(node.onSave, "save")) {
            if (wasFavorited) {
                await tracker.removeFavorite(post.contentId);
            }
            else {
                await tracker.addFavorite(post.contentId, post.campaignId);
            }
        }
    };
    const handleShare = async () => {
        if (node.onShare) {
            executeAction(node.onShare, dataContext);
        }
        if (!post)
            return;
        if (shouldRunNativeAction(node.onShare, "share")) {
            await tracker.shareContent(post);
        }
    };
    return (_jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            padding: `${py} ${px}`,
            ...baseStyle,
        }, children: [_jsxs("div", { style: { display: "flex", gap: "16px" }, children: [node.showLike !== false && (_jsx(Heart, { size: iconSize, strokeWidth: iconStrokeWidth, color: isLiked ? "#ef4444" : "#1f2937", fill: isLiked ? "#ef4444" : "none", "data-testid": "heart-icon", style: { cursor: "pointer" }, onClick: handleLike })), node.showSave !== false && (_jsx(Bookmark, { size: iconSize, strokeWidth: iconStrokeWidth, color: isFavorited ? "#374151" : "#1f2937", fill: isFavorited ? "#374151" : "none", "data-testid": "bookmark-icon", style: { cursor: "pointer" }, onClick: handleFavorite }))] }), node.showShare !== false && (_jsx(Share2, { size: iconSize, strokeWidth: iconStrokeWidth, color: "#1f2937", "data-testid": "share-icon", style: { cursor: "pointer" }, onClick: handleShare }))] }));
}
//# sourceMappingURL=PostInteractionsNode.js.map