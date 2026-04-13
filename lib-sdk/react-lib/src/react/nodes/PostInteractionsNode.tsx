import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { ComponentNode, Post } from "../../core/types.js";
import { useTemplateContext } from "../context.js";
import { tokenToPx } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { Heart, Bookmark, Share2 } from "lucide-react";

interface PostInteractionsNodeProps {
  node: ComponentNode;
  dataContext?: Record<string, unknown>;
}

export function PostInteractionsNode({
  node,
  dataContext,
}: PostInteractionsNodeProps) {
  const { theme, tracker } = useTemplateContext();
  const post = dataContext?.post as Post | undefined;

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsLiked(Boolean((post as any)?.liked));
    setIsFavorited(Boolean((post as any)?.favorite));
  }, [post]);

  const baseStyle: CSSProperties = {
    flex: node.flex || undefined,
  };

  const px = tokenToPx(theme, node.paddingX) || "0";
  const py = tokenToPx(theme, node.paddingY) || "12px";

  const iconSize = 24;
  const iconStrokeWidth = 1.5;
  const shouldRunNativeAction = (
    action: ComponentNode["onLike"] | ComponentNode["onSave"] | ComponentNode["onShare"],
    actionName: string,
  ) => {
    if (!action) return true;
    return (
      action.type === "UI_ACTION" && action.payload?.actionName === actionName
    );
  };

  const handleLike = async () => {
    if (node.onLike) {
      executeAction(node.onLike, dataContext);
    }

    if (!post) return;
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    if (shouldRunNativeAction(node.onLike, "like")) {
      await tracker.toggleLike(post.contentId, (post as any).campaignId);
    }
  };

  const handleFavorite = async () => {
    if (node.onSave) {
      executeAction(node.onSave, dataContext);
    }

    if (!post) return;
    const wasFavorited = isFavorited;
    setIsFavorited(!wasFavorited);

    if (shouldRunNativeAction(node.onSave, "save")) {
      if (wasFavorited) {
        await tracker.removeFavorite(post.contentId);
      } else {
        await tracker.addFavorite(post.contentId, (post as any).campaignId);
      }
    }
  };

  const handleShare = async () => {
    if (node.onShare) {
      executeAction(node.onShare, dataContext);
    }

    if (!post) return;
    if (shouldRunNativeAction(node.onShare, "share")) {
      await tracker.shareContent(post);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${py} ${px}`,
        ...baseStyle,
      }}
    >
      <div style={{ display: "flex", gap: "16px" }}>
        {node.showLike !== false && (
          <Heart
            size={iconSize}
            strokeWidth={iconStrokeWidth}
            color={isLiked ? "#ef4444" : "#1f2937"}
            fill={isLiked ? "#ef4444" : "none"}
            data-testid="heart-icon"
            style={{ cursor: "pointer" }}
            onClick={handleLike}
          />
        )}
        {node.showSave !== false && (
          <Bookmark
            size={iconSize}
            strokeWidth={iconStrokeWidth}
            color={isFavorited ? "#374151" : "#1f2937"}
            fill={isFavorited ? "#374151" : "none"}
            data-testid="bookmark-icon"
            style={{ cursor: "pointer" }}
            onClick={handleFavorite}
          />
        )}
      </div>
      {node.showShare !== false && (
        <Share2
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          color="#1f2937"
          data-testid="share-icon"
          style={{ cursor: "pointer" }}
          onClick={handleShare}
        />
      )}
    </div>
  );
}
