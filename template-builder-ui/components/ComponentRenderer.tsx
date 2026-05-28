import React, { useState, useRef, useEffect } from "react";
import * as Icons from "@ant-design/icons";
import type {
  ComponentNode,
  ContainerComponentNode,
  DividerComponentNode,
  MediaComponentNode,
  TextComponentNode,
  ButtonComponentNode,
  IconComponentNode,
  PostInteractionsComponentNode,
  PriceComponentNode,
  AvatarComponentNode,
  HtmlComponentNode,
  HeaderComponentNode,
  Theme,
} from "../types";

/* ─── Header sub-component (needs its own state for the dropdown) ─── */
interface HeaderRendererProps {
  node: HeaderComponentNode;
  resolvedTitle: string;
  resolvedImageUrl: string;
  abbreviation: string;
  renderIcon: (
    icon: string,
    color: string,
    size?: number | string,
  ) => React.ReactNode;
  colorToHex: (token?: string) => string | undefined;
  resolveVariables: (str: string) => string;
  selectionStyle: React.CSSProperties;
  dragIndicatorStyle: React.CSSProperties;
  baseStyle: React.CSSProperties;
  onSelect: (id: string) => void;
  onDragStartNode?: (e: React.DragEvent, id: string) => void;
  onDragOverNode?: (e: React.DragEvent, id: string) => void;
  onDragLeaveNode?: (e: React.DragEvent, id: string) => void;
  onDropNode?: (e: React.DragEvent, id: string) => void;
}

function HeaderRenderer({
  node,
  resolvedTitle,
  resolvedImageUrl,
  abbreviation,
  renderIcon,
  colorToHex,
  resolveVariables,
  selectionStyle,
  dragIndicatorStyle,
  baseStyle,
  onSelect,
  onDragStartNode,
  onDragOverNode,
  onDragLeaveNode,
  onDropNode,
}: HeaderRendererProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStartNode?.(e, node.id)}
      onDragOver={(e) => onDragOverNode?.(e, node.id)}
      onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
      onDrop={(e) => onDropNode?.(e, node.id)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        cursor: "pointer",
        position: "relative",
        ...baseStyle,
        ...selectionStyle,
        ...dragIndicatorStyle,
      }}
    >
      {/* Profile Section (Avatar + Title) */}
      <div
        onClick={(e) => {
          if (node.onProfilePress) {
            e.stopPropagation();
            console.log("Action Triggered (Profile):", node.onProfilePress);
            alert(`Profile Action: ${node.onProfilePress.type}`);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: 1,
          minWidth: 0,
          cursor: node.onProfilePress ? "pointer" : "default",
        }}
      >
        {/* Avatar / Abbreviation */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "9999px",
            backgroundColor: colorToHex("gray-100") || "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {resolvedImageUrl ? (
            <img
              src={resolvedImageUrl}
              alt={resolvedTitle}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = document.createElement("span");
                  fallback.textContent = abbreviation;
                  fallback.style.cssText =
                    "font-size:14px;font-weight:600;color:#6b7280;";
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--tb-text-primary)",
              }}
            >
              {abbreviation}
            </span>
          )}
        </div>

        {/* Title */}
        <span
          style={{
            flex: 1,
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--tb-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {resolvedTitle}
        </span>
      </div>

      {/* Vertical dots menu trigger */}
      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "4px",
          }}
        >
          {renderIcon("more-vertical", colorToHex("gray-500") || "#6b7280", 18)}
        </div>

        {menuOpen && node.menuItems && node.menuItems.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              minWidth: "180px",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {node.menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  if (item.action) {
                    console.log("Action Triggered (Menu Item):", item.action);
                    alert(
                      `Action: ${item.action.type}\nPayload: ${JSON.stringify(item.action.payload)}`,
                    );
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color:
                    item.icon === "flag" || item.icon === "report"
                      ? colorToHex("error") || "#dc2626"
                      : colorToHex("gray-800") || "#1f2937",
                  cursor: "pointer",
                  borderBottom:
                    idx < node.menuItems.length - 1
                      ? "1px solid #f3f4f6"
                      : undefined,
                }}
                className="dynamic-tag-item"
              >
                {renderIcon(
                  item.icon || "star",
                  item.icon === "flag" || item.icon === "report"
                    ? colorToHex("error") || "#dc2626"
                    : colorToHex("gray-500") || "#6b7280",
                  16,
                )}
                <span>{resolveVariables(item.text)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface RendererProps {
  node: ComponentNode;
  selectedNodeId: string | null;
  dragOverNodeId?: string | null;
  dragPosition?: "top" | "bottom" | "inside" | null;
  onSelect: (id: string) => void;
  onDragStartNode?: (e: React.DragEvent, id: string) => void;
  onDragOverNode?: (e: React.DragEvent, id: string) => void;
  onDragLeaveNode?: (e: React.DragEvent, id: string) => void;
  onDropNode?: (e: React.DragEvent, id: string) => void;
  dataContext?: Record<string, unknown>;
  theme?: Theme;
}

export default function ComponentRenderer({
  node,
  selectedNodeId,
  dragOverNodeId,
  dragPosition,
  onSelect,
  onDragStartNode,
  onDragOverNode,
  onDragLeaveNode,
  onDropNode,
  dataContext,
  theme,
}: RendererProps) {
  // Mapping tokens to simple inline styles for the POC builder
  const tokenToPx = (token?: string) => {
    if (!token) return undefined;
    if (theme?.spacing && token in theme.spacing) {
      return theme.spacing[token as keyof Theme["spacing"]];
    }
    // Fallback if token not in dynamic theme
    switch (token) {
      case "xs":
        return "4px";
      case "sm":
        return "8px";
      case "md":
        return "16px";
      case "lg":
        return "24px";
      case "xl":
        return "32px";
      case "xxl":
        return "48px";
      default:
        return token.includes("px") || token.includes("%") ? token : undefined;
    }
  };

  const colorToHex = (token?: string) => {
    if (!token) return undefined;
    if (theme?.colors && token in theme.colors) {
      return theme.colors[token as keyof Theme["colors"]];
    }
    // Fallback if token not in dynamic theme
    switch (token) {
      case "white":
        return "#ffffff";
      case "gray-100":
        return "#f3f4f6";
      case "gray-200":
        return "#e2e8f0";
      case "gray-800":
        return "#1f2937";
      case "gray-900":
        return "#111827";
      case "primary":
        return "#6366f1";
      default:
        return token; // Fallback
    }
  };

  const mockDataContext = {
    post: {
      title: "Titulo do post",
      description: "Chaleira Elétrica Cadence 1,8L Inox Control 127V CEL850",
      originalPrice: "89,90",
      price: "39,90",
      discount: "26",
      destinationUrl: "/shop/f148c0ad-a39a-4674-a59f-cad2f4b7e91b",
      contentType: "catalog",
      url: "https://cdn.luxuryloyalty.com/media/product/detail/9c3adfe3-00d6-4e1a-9e4f-be925067f2d6-1.jpg",
      profile: {
        accountName: "Flash Shopping",
        iconUrl:
          "https://cockpit-app.dev-directoai.com.br/assets/creator_logo-BVuuYkvo.png",
        description:
          "A Rede Sol Antunes em Mirassol foi inaugurada em 1946, conta com quatro amplas unidades na cidade, com estacionamento próprio com capacidade para 270 veículos, grande variedade de produtos em todos os setores, restaurante e rotisseria próprios e uma equipe de 410 colaboradores prontos para servir da melhor maneira.",
      },
      customVariables: {},
    },
  };

  const resolveVariables = (str: string) => {
    if (!str) return str;
    return str.replace(/\{\{(.*?)\}\}/g, (match, path) => {
      const parts = path.trim().split(".");
      let current: unknown = dataContext || mockDataContext;
      for (const part of parts) {
        if (
          current &&
          typeof current === "object" &&
          part in (current as Record<string, unknown>)
        ) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return match; // Return as is if not found
        }
      }
      return String(current ?? "");
    });
  };

  const renderIcon = (
    iconName: string,
    color: string,
    size: number | string = 20,
  ) => {
    // Map of common names to @ant-design/icons component names
    const iconMap: Record<string, React.ElementType> = {
      user: Icons.UserOutlined,
      heart: Icons.HeartOutlined,
      bookmark: Icons.BookOutlined,
      share: Icons.ShareAltOutlined,
      camera: Icons.CameraOutlined,
      settings: Icons.SettingOutlined,
      home: Icons.HomeOutlined,
      search: Icons.SearchOutlined,
      bell: Icons.BellOutlined,
      star: Icons.StarOutlined,
      "more-horizontal": Icons.EllipsisOutlined,
      "more-vertical": Icons.MoreOutlined,
      shopping: Icons.ShoppingOutlined,
      shoppingbag: Icons.ShoppingOutlined,
      "shopping-bag": Icons.ShoppingOutlined,
      plus: Icons.PlusOutlined,
      trash: Icons.DeleteOutlined,
      edit: Icons.EditOutlined,
      check: Icons.CheckOutlined,
      chevronRight: Icons.RightOutlined,
      chevronLeft: Icons.LeftOutlined,
      info: Icons.InfoCircleOutlined,
      flag: Icons.FlagOutlined,
      follow: Icons.UserAddOutlined,
      report: Icons.FlagOutlined,
    };

    const IconComponent = iconMap[iconName] || Icons.StarOutlined;

    return <IconComponent style={{ fontSize: size, color }} />;
  };

  const isSelected = node.id === selectedNodeId;
  const isDragOver = node.id === dragOverNodeId;

  const selectionStyle: React.CSSProperties = isSelected
    ? { outline: "2px solid #2563eb", outlineOffset: "-2px" }
    : {};

  const dragIndicatorStyle: React.CSSProperties = isDragOver
    ? {
        borderTop: dragPosition === "top" ? "4px solid #2563eb" : undefined,
        borderBottom:
          dragPosition === "bottom" ? "4px solid #2563eb" : undefined,
        backgroundColor:
          dragPosition === "inside" ? "rgba(37, 99, 235, 0.1)" : undefined,
      }
    : {};

  const baseStyle: React.CSSProperties = {
    flex:
      node.flex || ("height" in node && node.height === "100%" ? 1 : undefined),
  };

  if (node.type === "text") {
    const textNode = node as TextComponentNode;
    let fontSize = "16px";
    let fontWeightStr = "normal";

    if (textNode.typography === "caption") {
      fontSize = "12px";
    } else if (textNode.typography === "heading1") {
      fontSize = "32px";
      fontWeightStr = "bold";
    } else if (textNode.typography === "heading2") {
      fontSize = "24px";
      fontWeightStr = "bold";
    } else if (textNode.typography === "heading3") {
      fontSize = "20px";
      fontWeightStr = "bold";
    } else if (textNode.typography === "heading4") {
      fontSize = "18px";
      fontWeightStr = "bold";
    } else if (textNode.typography === "heading5") {
      fontSize = "16px";
      fontWeightStr = "bold";
    }

    if (textNode.fontWeight) {
      if (textNode.fontWeight === "bold") fontWeightStr = "bold";
      else if (textNode.fontWeight === "semiBold") fontWeightStr = "600";
      else fontWeightStr = "normal";
    }

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        style={{
          fontSize,
          fontWeight: fontWeightStr,
          textAlign: textNode.textAlign || "left",
          color: textNode.color
            ? colorToHex(textNode.color)
            : "var(--tb-text-primary)",
          padding: "0",
          cursor:
            ("action" in node && node.action) || isSelected
              ? "pointer"
              : "default",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
        onClick={(e) => {
          if ("action" in node && node.action) {
            e.stopPropagation();
            const action = (node as TextComponentNode).action;
            if (action) {
              console.log("Action Triggered (Text/Node):", action);
              alert(`Action: ${action.type}`);
            }
          } else {
            e.stopPropagation();
            onSelect(node.id);
          }
        }}
      >
        {resolveVariables(textNode.value || "Input Text")}
      </div>
    );
  }

  const getRadius = (r?: string) => {
    if (!r) return "0";
    if (theme?.borderRadius && r in theme.borderRadius) {
      return theme.borderRadius[r as keyof Theme["borderRadius"]];
    }
    switch (r) {
      case "sm":
        return "4px";
      case "md":
        return "8px";
      case "lg":
      case "full":
        return "9999px";
      default:
        return r.includes("px") ? r : "0";
    }
  };

  if (node.type === "container") {
    const containerNode = node as ContainerComponentNode;
    const paddingX = tokenToPx(containerNode.paddingX);
    const paddingY = tokenToPx(containerNode.paddingY);
    const marginX = tokenToPx(containerNode.marginX);
    const marginY = tokenToPx(containerNode.marginY);

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          display: "flex",
          flexDirection: containerNode.direction || "column",
          justifyContent: containerNode.justifyContent || "flex-start",
          alignItems: containerNode.alignItems || "stretch",
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          marginLeft: marginX,
          marginRight: marginX,
          marginTop: marginY,
          marginBottom: marginY,
          gap: tokenToPx(containerNode.gap),
          backgroundColor: colorToHex(containerNode.backgroundColor),
          borderRadius: getRadius(containerNode.borderRadius),
          border: containerNode.borderWidth
            ? `${containerNode.borderWidth} ${
                containerNode.borderStyle || "solid"
              } ${colorToHex(containerNode.borderColor) || "#000"}`
            : undefined,
          width: containerNode.width || "auto",
          height: containerNode.height || "auto",
          minHeight: "40px",
          position: "relative",
          boxSizing: "border-box",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
        className="builder-container-node"
      >
        {containerNode.blocks && containerNode.blocks.length > 0 ? (
          containerNode.blocks.map((child) => (
            <ComponentRenderer
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              dragOverNodeId={dragOverNodeId}
              dragPosition={dragPosition}
              onSelect={onSelect}
              onDragStartNode={onDragStartNode}
              onDragOverNode={onDragOverNode}
              onDragLeaveNode={onDragLeaveNode}
              onDropNode={onDropNode}
              dataContext={dataContext}
              theme={theme}
            />
          ))
        ) : (
          <span
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              opacity: 0.6,
              alignSelf: "center",
              margin: "auto",
            }}
          >
            Empty Container
          </span>
        )}
      </div>
    );
  }

  if (node.type === "divider") {
    const dividerNode = node as DividerComponentNode;
    let borderWidth = "1px";
    let borderColor = "#e2e8f0";

    if (dividerNode.thickness === "thin") {
      borderWidth = "0.5px";
      borderColor = "#f1f5f9"; // Lighter
    } else if (dividerNode.thickness === "thick") {
      borderWidth = "2px";
    }

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          height: "12px",
          margin: "0",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        <hr
          style={{
            borderTop: `${borderWidth} solid ${borderColor}`,
            margin: 0,
            width: "100%",
          }}
        />
      </div>
    );
  }

  if (node.type === "media") {
    const mediaNode = node as MediaComponentNode;
    const width = mediaNode.width || "100%";
    const height = mediaNode.height || "200px";

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        style={{
          width,
          height,
          backgroundColor: mediaNode.url ? "transparent" : "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          cursor: mediaNode.action || isSelected ? "pointer" : "default",
          overflow: "hidden",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        {mediaNode.url ? (
          <img
            src={resolveVariables(mediaNode.url)}
            alt={resolveVariables(mediaNode.alt || "")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: mediaNode.objectFit || "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: colorToHex("gray-400"),
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              Mídia Placeholder
            </span>
          </div>
        )}
      </div>
    );
  }

  if (node.type === "post_interactions") {
    const interactionsNode = node as PostInteractionsComponentNode;
    const showLike = interactionsNode.showLike !== false; // Default true
    const showSave = interactionsNode.showSave !== false; // Default true
    const showShare = interactionsNode.showShare !== false; // Default true

    const px = tokenToPx(interactionsNode.paddingX) || "0";
    const py = tokenToPx(interactionsNode.paddingY) || "12px";
    const gapIcons = tokenToPx(interactionsNode.gap) || "16px";

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${py} ${px}`,
          cursor: "pointer",
          width: "100%",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: gapIcons }}>
          {showLike && (
            <div
              onClick={(e) => {
                const action = interactionsNode.onLike || {
                  type: "UI_ACTION",
                  payload: { actionName: "like" },
                };
                e.stopPropagation();
                alert(`Action: Like (${action.payload.actionName})`);
              }}
              style={{ cursor: "pointer" }}
            >
              {renderIcon("heart", colorToHex("gray-500") || "#64748b", 24)}
            </div>
          )}
          {showSave && (
            <div
              onClick={(e) => {
                const action = interactionsNode.onSave || {
                  type: "UI_ACTION",
                  payload: { actionName: "save" },
                };
                e.stopPropagation();
                alert(`Action: Save (${action.payload.actionName})`);
              }}
              style={{ cursor: "pointer" }}
            >
              {renderIcon("bookmark", colorToHex("gray-500") || "#64748b", 24)}
            </div>
          )}
        </div>
        <div>
          {showShare && (
            <div
              onClick={(e) => {
                const action = interactionsNode.onShare || {
                  type: "UI_ACTION",
                  payload: { actionName: "share" },
                };
                e.stopPropagation();
                alert(`Action: Share (${action.payload.actionName})`);
              }}
              style={{ cursor: "pointer" }}
            >
              {renderIcon("share", colorToHex("gray-500") || "#64748b", 24)}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (node.type === "price") {
    const priceNode = node as PriceComponentNode;
    const px = tokenToPx(priceNode.paddingX) || "0";
    const py = tokenToPx(priceNode.paddingY) || "8px";

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: `${py} ${px}`,
          cursor: "pointer",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {priceNode.showOriginalPrice !== false && priceNode.originalPrice && (
            <span
              style={{
                fontSize: "12px",
                color: colorToHex("gray-400"),
                textDecoration: "line-through",
              }}
            >
              {resolveVariables(priceNode.originalPrice)}
            </span>
          )}
          {priceNode.showDiscountPercent !== false &&
            priceNode.discountPercent && (
              <span
                style={{
                  backgroundColor: colorToHex("error") + "20" || "#fecaca",
                  color: colorToHex("error") || "#dc2626",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >
                {resolveVariables(priceNode.discountPercent)}% OFF
              </span>
            )}
        </div>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "var(--tb-text-primary)",
          }}
        >
          {resolveVariables(priceNode.price)}
        </span>
      </div>
    );
  }

  if (node.type === "button") {
    const buttonNode = node as ButtonComponentNode;
    const buttonLink =
      buttonNode.action?.type === "DEEPLINK"
        ? String(
            buttonNode.action.payload.deeplink ||
              buttonNode.action.payload.url ||
              "",
          )
        : buttonNode.action?.type === "OPEN_URL"
          ? String(buttonNode.action.payload.url || "")
          : buttonNode.url || "";

    const primaryColor = colorToHex("primary") || "#6366f1";
    let bg = colorToHex(buttonNode.background) || primaryColor;
    let color = "#ffffff";
    let border = "none";

    if (buttonNode.variant === "outline") {
      bg = "transparent";
      color = colorToHex(buttonNode.background) || primaryColor;
      border = `1px solid ${color}`;
    } else if (buttonNode.variant === "ghost") {
      bg = "transparent";
      color = colorToHex(buttonNode.background) || primaryColor;
      border = "none";
    }

    const sizeStyles = {
      xs: { padding: "4px 8px", fontSize: "10px" },
      sm: { padding: "6px 12px", fontSize: "12px" },
      md: { padding: "10px 16px", fontSize: "14px" },
      lg: { padding: "14px 24px", fontSize: "16px" },
      xl: { padding: "18px 32px", fontSize: "18px" },
      xxl: { padding: "22px 40px", fontSize: "20px" },
    };

    const currentSize =
      sizeStyles[(buttonNode.size as keyof typeof sizeStyles) || "md"];

    return (
      <button
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        title={buttonLink}
        style={{
          backgroundColor: bg,
          color,
          border,
          ...currentSize,
          borderRadius: getRadius(buttonNode.radius) || "8px",
          fontWeight: "bold",
          width: buttonNode.fullWidth ? "100%" : "auto",
          cursor: "pointer",
          transition: "opacity 0.2s",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        {resolveVariables(buttonNode.label || "Button")}
      </button>
    );
  }

  if (node.type === "avatar") {
    const avatarNode = node as AvatarComponentNode;
    const url = resolveVariables(avatarNode.url || "");
    const size = Number(avatarNode.size) || 40;
    const bgColor = colorToHex(avatarNode.backgroundColor) || "#f3f4f6";
    const borderRadius = getRadius(avatarNode.borderRadius || "full");

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          width: size,
          height: size,
          borderRadius,
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          flexShrink: 0,
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        {url ? (
          <img
            src={url}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              // Should show fallback icon if error
            }}
          />
        ) : null}
        {!url &&
          renderIcon(
            avatarNode.icon || "user",
            colorToHex("gray-400") || "#9ca3af",
            size * 0.6,
          )}
      </div>
    );
  }

  if (node.type === "icon") {
    const iconNode = node as IconComponentNode;
    const padding = tokenToPx(iconNode.padding);

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            colorToHex(iconNode.backgroundColor) || "transparent",
          padding,
          borderRadius: getRadius(iconNode.borderRadius) || "0",
          cursor: "pointer",
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
      >
        {renderIcon(
          iconNode.icon || "star",
          colorToHex("gray-500") || "#64748b",
          iconNode.size || 20,
        )}
      </div>
    );
  }

  if (node.type === "header") {
    const headerNode = node as HeaderComponentNode;
    const resolvedTitle = resolveVariables(headerNode.title || "Shopping");
    const resolvedImageUrl = resolveVariables(headerNode.imageUrl || "");
    const abbreviation = resolvedTitle
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <HeaderRenderer
        node={headerNode}
        resolvedTitle={resolvedTitle}
        resolvedImageUrl={resolvedImageUrl}
        abbreviation={abbreviation}
        renderIcon={renderIcon}
        colorToHex={colorToHex}
        resolveVariables={resolveVariables}
        selectionStyle={selectionStyle}
        dragIndicatorStyle={dragIndicatorStyle}
        baseStyle={baseStyle}
        onSelect={onSelect}
        onDragStartNode={onDragStartNode}
        onDragOverNode={onDragOverNode}
        onDragLeaveNode={onDragLeaveNode}
        onDropNode={onDropNode}
      />
    );
  }

  if (node.type === "html") {
    const htmlNode = node as HtmlComponentNode;
    const px = tokenToPx(htmlNode.paddingX) || "0";
    const py = tokenToPx(htmlNode.paddingY) || "0";
    const width = htmlNode.width || "auto";
    const height = htmlNode.height || "auto";

    return (
      <div
        draggable
        onDragStart={(e) => onDragStartNode?.(e, node.id)}
        onDragOver={(e) => onDragOverNode?.(e, node.id)}
        onDragLeave={(e) => onDragLeaveNode?.(e, node.id)}
        onDrop={(e) => onDropNode?.(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          padding: `${py} ${px}`,
          cursor: "pointer",
          width,
          height,
          ...baseStyle,
          ...selectionStyle,
          ...dragIndicatorStyle,
        }}
        dangerouslySetInnerHTML={{
          __html: resolveVariables(htmlNode.html || "<div>Custom HTML</div>"),
        }}
      />
    );
  }

  return <div>Unknown Component</div>;
}
