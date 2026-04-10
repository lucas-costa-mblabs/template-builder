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
  const { theme } = useTemplateContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = resolveVariables(node.imageUrl, dataContext)?.trim();
  const title = resolveVariables(node.title || node.value, dataContext);

  const handleProfilePress = node.onProfilePress
    ? () => executeAction(node.onProfilePress, dataContext)
    : undefined;

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
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          {title}
        </span>
      </div>

      {/* Right side: Single ⋮ button with dropdown */}
      {node.menuItems && node.menuItems.length > 0 && (
        <div ref={menuRef} style={{ position: "relative" }}>
          <div
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
                      setMenuOpen(false);
                      if (item.action) executeAction(item.action, dataContext);
                    }}
                  >
                    <IconComp size={18} color="#6b7280" strokeWidth={1.5} />
                    <span>{item.text}</span>
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
