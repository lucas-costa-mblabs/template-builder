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
};

interface HeaderNodeProps {
  node: ComponentNode;
  dataContext?: Record<string, unknown>;
}

export function HeaderNode({ node, dataContext }: HeaderNodeProps) {
  const { theme } = useTemplateContext();

  const avatarUrl = resolveVariables(node.imageUrl, dataContext)?.trim();
  const title = resolveVariables(node.title || node.value, dataContext);

  const handleProfilePress = node.onProfilePress
    ? () => executeAction(node.onProfilePress, dataContext)
    : undefined;

  const baseStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
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

      {/* Right side: Menu Items */}
      {node.menuItems && node.menuItems.length > 0 && (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {node.menuItems.map((item, index) => {
            const IconComp = iconMap[item.icon] || MoreVertical;
            return (
              <div
                key={`${node.id}-menu-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onClick={() => executeAction(item.action, dataContext)}
                title={item.text}
              >
                <IconComp size={20} color="#6b7280" strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
