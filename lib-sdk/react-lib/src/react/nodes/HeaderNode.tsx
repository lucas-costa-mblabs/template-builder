import React, { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import type { ComponentNode } from "../../core/types.js";
import { useTemplateContext } from "../context.js";
import { resolveVariables } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { AvatarNode } from "./AvatarNode.js";
import {
  MoreVertical,
  Flag,
  UserPlus,
  Check,
  Store,
  Heart,
  Share2,
  Bookmark,
  AlertTriangle,
  Info,
  Star,
  User,
} from "lucide-react";

const iconMap: Record<string, typeof MoreVertical> = {
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

interface HeaderNodeProps {
  node: ComponentNode;
  dataContext?: Record<string, unknown>;
}

export function HeaderNode({ node, dataContext }: HeaderNodeProps) {
  const {
    tracker,
    getIsFollowing: getIsFollowingFromContext,
    setIsFollowing: setIsFollowingFromContext,
  } = useTemplateContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = resolveVariables(node.imageUrl, dataContext)?.trim();
  const title = resolveVariables(node.title || node.value, dataContext);

  const getIsFollowing =
    getIsFollowingFromContext || ((_profileAccountId: string) => false);
  const setIsFollowing =
    setIsFollowingFromContext ||
    ((_profileAccountId: string, _isFollowing: boolean) => {});

  const handleProfilePress = node.onProfilePress
    ? () => executeAction(node.onProfilePress, dataContext)
    : undefined;
  const post = (dataContext?.post as Record<string, unknown> | undefined) || {};
  const profile = (post.profile as Record<string, unknown> | undefined) || {};
  const profileAccountId =
    (profile.accountId as string | undefined)?.trim() ||
    (post.accountId as string | undefined)?.trim() ||
    "";
  const initialFollowing =
    post.following === true ||
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

  const handleMenuItemClick = async (item: any) => {
    setMenuOpen(false);

    const actionName = item.action?.payload?.actionName?.trim().toLowerCase();
    const isFollowAction = actionName === "follow" || actionName === "unfollow";

    if (!isFollowAction || !profileAccountId) {
      if (item.action) executeAction(item.action, dataContext);
      return;
    }

    const nextFollowing = !isFollowing;
    setIsFollowLoading(true);
    setIsFollowing(profileAccountId, nextFollowing);

    try {
      await tracker.toggleFollowAccount(profileAccountId, isFollowing);
    } catch (error) {
      setIsFollowing(profileAccountId, isFollowing);
      console.error("DirectoAi SDK: Failed to toggle follow state:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const baseStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    flex: node.flex || undefined,
  };

  return (
    <div style={baseStyle}>
      {/* Left side: Avatar + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: handleProfilePress ? "pointer" : undefined,
        }}
        onClick={handleProfilePress}
      >
        <AvatarNode
          node={{
            id: `${node.id}-avatar`,
            type: "avatar",
            url: avatarUrl,
            size: 36,
            borderRadius: "full",
          }}
          dataContext={dataContext}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
          {Boolean((dataContext?.post as any)?.sponsored) && (
            <span
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "#9ca3af",
                lineHeight: 1.2,
                marginTop: "2px",
              }}
            >
              Patrocinado
            </span>
          )}
        </div>
      </div>

      {/* Right side: Follow state + menu */}
      {node.menuItems && node.menuItems.length > 0 && (
        <div
          ref={menuRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isFollowing && (
            <div
              aria-label="Seguindo"
              title="Seguindo"
              style={{
                position: "relative",
                width: "20px",
                height: "20px",
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "9999px",
                  border: "1.8px solid #6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  backgroundColor: "#ffffff",
                }}
              >
                <User size={11} strokeWidth={1.8} />
              </div>
              <div
                style={{
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
                }}
              >
                <Check size={8} strokeWidth={2.2} color="#6b7280" />
              </div>
            </div>
          )}
          <div
            role="button"
            aria-label="Abrir opções"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MoreVertical size={20} color="#6b7280" strokeWidth={1.5} />
          </div>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 50,
                minWidth: "200px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow:
                  "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                padding: "4px 0",
                marginTop: "4px",
              }}
            >
              {node.menuItems.map((item: any, index: number) => {
                const IconComp = iconMap[item.icon] || MoreVertical;
                const actionName = item.action?.payload?.actionName
                  ?.trim()
                  .toLowerCase();
                const isFollowAction =
                  actionName === "follow" || actionName === "unfollow";
                const itemLabel = isFollowAction
                  ? isFollowing
                    ? "Deixar de seguir"
                    : "Seguir"
                  : item.text;
                return (
                  <div
                    key={`${node.id}-menu-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#374151",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => {
                      void handleMenuItemClick(item);
                    }}
                  >
                    <IconComp size={18} color="#6b7280" strokeWidth={1.5} />
                    <span>
                      {isFollowAction && isFollowLoading
                        ? "Processando..."
                        : itemLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
