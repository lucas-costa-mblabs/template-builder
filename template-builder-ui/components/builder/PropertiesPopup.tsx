import { useState, useRef, useEffect } from "react";
import * as Icons from "@ant-design/icons";
import type {
  ComponentNode,
  ColorToken,
  TextComponentNode,
  ContainerComponentNode,
  IconComponentNode,
  ButtonComponentNode,
  MediaComponentNode,
  DividerComponentNode,
  PostInteractionsComponentNode,
  PriceComponentNode,
  AvatarComponentNode,
  HtmlComponentNode,
  HeaderComponentNode,
  HeaderMenuItem,
  TokenType,
  ComponentAction,
  ActionType,
} from "../../types";

const ColorOptions = ({ includeNone = true, noneLabel = "None" }: { includeNone?: boolean, noneLabel?: string }) => (
  <>
    {includeNone && <option value="">{noneLabel}</option>}
    <optgroup label="Marca">
      <option value="primary">Primary</option>
      <option value="secondary">Secondary</option>
      <option value="accent">Accent</option>
    </optgroup>
    <optgroup label="Feedback">
      <option value="success">Success</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
      <option value="info">Info</option>
    </optgroup>
    <optgroup label="Neutras">
      <option value="white">White</option>
      <option value="black">Black</option>
      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(n => (
        <option key={n} value={`gray-${n}`}>Gray {n}</option>
      ))}
    </optgroup>
    <optgroup label="Interação">
      <option value="primary-hover">Primary Hover</option>
      <option value="primary-active">Primary Active</option>
      <option value="secondary-hover">Secondary Hover</option>
      <option value="secondary-active">Secondary Active</option>
    </optgroup>
  </>
);

const DYNAMIC_TAGS = [
  { label: "Product Title", value: "{{post.title}}" },
  { label: "Product Price", value: "{{post.price}}" },
  { label: "Original Price", value: "{{post.originalPrice}}" },
  { label: "Discount %", value: "{{post.discount}}" },
  { label: "Description", value: "{{post.description}}" },
  { label: "Image URL", value: "{{post.url}}" },
  { label: "Account Name", value: "{{post.profile.accountName}}" },
  { label: "Account Description", value: "{{post.profile.description}}" },
  { label: "Account Icon", value: "{{post.profile.iconUrl}}" },
  { label: "Link URL", value: "{{post.destinationUrl}}" },
  { label: "Custom HTML Variable", value: "{{post.customVariables.html}}" },
];

interface DynamicFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  selectedNode: ComponentNode;
  onUpdateNode: (id: string, updates: Partial<ComponentNode>) => void;
  activeDynamicField: string | null;
  setActiveDynamicField: (val: string | null) => void;
  dynamicPopupRef: React.RefObject<HTMLDivElement | null>;
}

// Move outside to avoid re-mounting on parent render
const DynamicField = ({
  label,
  value,
  fieldKey,
  selectedNode,
  onUpdateNode,
  activeDynamicField,
  setActiveDynamicField,
  dynamicPopupRef,
}: DynamicFieldProps) => (
  <div
    ref={activeDynamicField === fieldKey ? dynamicPopupRef : null}
    style={{ marginBottom: "12px", position: "relative" }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <label style={{ marginBottom: "4px" }}>{label}</label>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveDynamicField(
            activeDynamicField === fieldKey ? null : fieldKey,
          );
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          color: "var(--primary-color)",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "2px",
        }}
        title="Dynamic Tags"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4zm0 4c-5.52 0-10 2.69-10 6s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4z" />
        </svg>
        Dynamic
      </button>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) =>
        onUpdateNode(selectedNode.id, { [fieldKey]: e.target.value })
      }
    />
    {activeDynamicField === fieldKey && (
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          borderRadius: "4px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          zIndex: 100,
          width: "160px",
          marginTop: "4px",
          overflow: "hidden",
        }}
      >
        {DYNAMIC_TAGS.map((tag) => (
          <div
            key={tag.value}
            onClick={() => {
              onUpdateNode(selectedNode.id, {
                [fieldKey]: value + tag.value,
              });
              setActiveDynamicField(null);
            }}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              cursor: "pointer",
              borderBottom: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
            className="dynamic-tag-item"
          >
            {tag.label}
          </div>
        ))}
      </div>
    )}
  </div>
);

interface ActionEditorProps {
  label: string;
  action?: ComponentAction;
  onUpdate: (action: ComponentAction) => void;
  activeDynamicField: string | null;
  setActiveDynamicField: (val: string | null) => void;
  dynamicPopupRef: React.RefObject<HTMLDivElement | null>;
  selectedNode: ComponentNode;
  onUpdateNode: (id: string, updates: Partial<ComponentNode>) => void;
  parentId: string;
}

const ActionEditor = ({
  label,
  action,
  onUpdate,
  activeDynamicField,
  setActiveDynamicField,
  dynamicPopupRef,
  selectedNode,
  parentId,
}: Omit<ActionEditorProps, "onUpdateNode">) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const type = action?.type || "OPEN_URL";
  const payload = action?.payload || {};

  const getSummary = () => {
    if (type === "OPEN_URL") return `URL: ${payload.url || "(vazio)"}`;
    if (type === "DEEPLINK") return `Link: ${payload.deeplink || "(vazio)"}`;
    if (type === "UI_ACTION") return `Ação: ${payload.actionName || "(vazia)"}`;
    if (type === "NAVIGATE") return `Navegar: ${payload.target || "(vazio)"}`;
    return type;
  };

  return (
    <div style={{ 
      border: "1px solid var(--border-color)", 
      borderRadius: "6px", 
      marginBottom: "8px", 
      background: "rgba(0,0,0,0.02)",
      overflow: "hidden" 
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: "8px 10px", 
          cursor: "pointer", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: isExpanded ? "rgba(0,0,0,0.05)" : "transparent"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, fontSize: "10px", textTransform: "uppercase", opacity: 0.7 }}>{label}</span>
          {!isExpanded && <span style={{ fontSize: "11px", opacity: 0.8, color: "var(--text-primary)" }}>{getSummary()}</span>}
        </div>
        {isExpanded ? <Icons.CaretDownOutlined style={{fontSize: '12px'}} /> : <Icons.CaretRightOutlined style={{fontSize: '12px'}} />}
      </div>
      
      {isExpanded && (
        <div style={{ padding: "10px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "10px" }}>Tipo de Ação</label>
            <select
              value={type}
              onChange={(e) => onUpdate({ type: e.target.value as ActionType, payload: {} })}
              style={{ marginBottom: "4px" }}
            >
              <option value="OPEN_URL">Abrir URL (Browser)</option>
              <option value="DEEPLINK">Deeplink (App)</option>
              <option value="UI_ACTION">Ação de UI (Social)</option>
              <option value="NAVIGATE">Navegação (Plataforma)</option>
            </select>
          </div>

          {type === "OPEN_URL" && (
            <DynamicField
              label="URL"
              value={payload.url || ""}
              fieldKey={`${parentId}_url`}
              selectedNode={selectedNode}
              onUpdateNode={(_, updates) => {
                 const key = `${parentId}_url`;
                 const val = (updates as Record<string, string>)[key];
                 onUpdate({ ...action!, payload: { ...payload, url: val } });
              }}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
            />
          )}

          {type === "DEEPLINK" && (
            <DynamicField
              label="Deeplink"
              value={(payload.deeplink as string) || ""}
              fieldKey={`${parentId}_deeplink`}
              selectedNode={selectedNode}
              onUpdateNode={(_, updates) => {
                 const key = `${parentId}_deeplink`;
                 const val = (updates as Record<string, string>)[key];
                 onUpdate({ ...action!, payload: { ...payload, deeplink: val } });
              }}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
            />
          )}

          {type === "UI_ACTION" && (
            <div>
              <label style={{ fontSize: "10px" }}>Nome da Ação</label>
              <select
                value={(payload.actionName as string) || ""}
                onChange={(e) => onUpdate({ ...action!, payload: { ...payload, actionName: e.target.value as "like" | "save" | "share" | "follow" | "report" | "open_profile" } })}
              >
                <option value="">Selecione...</option>
                <option value="like">Curtir (Like)</option>
                <option value="save">Salvar (Favorite)</option>
                <option value="share">Compartilhar (Share)</option>
                <option value="follow">Seguir (Follow)</option>
                <option value="report">Denunciar (Report)</option>
                <option value="open_profile">Abrir Perfil</option>
              </select>
            </div>
          )}

          {type === "NAVIGATE" && (
            <div>
              <label style={{ fontSize: "10px" }}>Alvo (Target)</label>
              <select
                value={payload.target || ""}
                onChange={(e) => onUpdate({ ...action!, payload: { ...payload, target: e.target.value } })}
              >
                <option value="profile">Perfil</option>
                <option value="cart">Carrinho</option>
                <option value="settings">Configurações</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PropertiesPopupProps {
  selectedNode: ComponentNode;
  onUpdateNode: (id: string, updates: Partial<ComponentNode>) => void;
  onClose: () => void;
}

export default function PropertiesPopup({
  selectedNode,
  onUpdateNode,
  onClose,
}: PropertiesPopupProps) {
  const [activeDynamicField, setActiveDynamicField] = useState<string | null>(
    null,
  );
  const dynamicPopupRef = useRef<HTMLDivElement>(null);
  const [expandedHeaderMenuItem, setExpandedHeaderMenuItem] = useState<number | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dynamicPopupRef.current &&
        !dynamicPopupRef.current.contains(event.target as Node)
      ) {
        setActiveDynamicField(null);
      }
    }

    if (activeDynamicField) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDynamicField]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"design" | "config">("design");
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition({ x: dx, y: dy });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from the header itself, not from buttons/inputs
    if ((e.target as HTMLElement).closest('button, select, input')) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  return (
    <div
      className="floating-properties-popup"
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      <div 
        className="popup-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: "move", userSelect: "none" }}
      >
        <span>Edit {selectedNode.type}</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      <div className="properties-tabs">
        <div 
          className={`tab-item ${activeTab === "design" ? "active" : ""}`}
          onClick={() => setActiveTab("design")}
        >
          Design
        </div>
        <div 
          className={`tab-item ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          Config
        </div>
      </div>

      <div className="properties-panel">
        {/* Container Properties */}
        {selectedNode.type === "container" && activeTab === "design" && (
          <>
            <div className="prop-group" style={{ borderTop: "none", marginTop: 0 }}>
              <div className="dense-grid">
                <div>
                  <label>Direction</label>
                  <div className="segmented-control">
                    <div 
                      className={`segmented-item ${(selectedNode as ContainerComponentNode).direction === "row" ? "active" : ""}`}
                      onClick={() => onUpdateNode(selectedNode.id, { direction: "row" })}
                      title="Row"
                    >
                      <Icons.ArrowRightOutlined />
                    </div>
                    <div 
                      className={`segmented-item ${(selectedNode as ContainerComponentNode).direction !== "row" ? "active" : ""}`}
                      onClick={() => onUpdateNode(selectedNode.id, { direction: "column" })}
                      title="Column"
                    >
                      <Icons.ArrowDownOutlined />
                    </div>
                  </div>
                </div>
                <div>
                  <label>Gap</label>
                  <select
                    value={(selectedNode as ContainerComponentNode).gap || ""}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        gap: (e.target.value || undefined) as TokenType,
                      })
                    }
                    style={{ marginBottom: 0 }}
                  >
                    <option value="">None</option>
                    <option value="xs">xs (4px)</option>
                    <option value="sm">sm (8px)</option>
                    <option value="md">md (16px)</option>
                    <option value="lg">lg (24px)</option>
                  </select>
                </div>
              </div>

              <div className="dense-grid" style={{ marginTop: "8px" }}>
                <div>
                  <label>Justify</label>
                  <div className="segmented-control">
                    {[
                      { val: "flex-start", icon: <Icons.AlignLeftOutlined /> },
                      { val: "center", icon: <Icons.AlignCenterOutlined /> },
                      { val: "flex-end", icon: <Icons.AlignRightOutlined /> },
                      { val: "space-between", icon: <Icons.ColumnWidthOutlined /> },
                    ].map(opt => (
                      <div 
                        key={opt.val}
                        className={`segmented-item ${(selectedNode as ContainerComponentNode).justifyContent === opt.val ? "active" : ""}`}
                        onClick={() => onUpdateNode(selectedNode.id, { justifyContent: opt.val as ContainerComponentNode["justifyContent"] })}
                      >
                        {opt.icon}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Align</label>
                  <div className="segmented-control">
                    {[
                      { val: "flex-start", icon: <Icons.VerticalAlignTopOutlined /> },
                      { val: "center", icon: <Icons.AlignCenterOutlined /> },
                      { val: "flex-end", icon: <Icons.VerticalAlignBottomOutlined /> },
                      { val: "stretch", icon: <Icons.FullscreenExitOutlined /> },
                    ].map(opt => (
                      <div 
                        key={opt.val}
                        className={`segmented-item ${(selectedNode as ContainerComponentNode).alignItems === opt.val ? "active" : ""}`}
                        onClick={() => onUpdateNode(selectedNode.id, { alignItems: opt.val as ContainerComponentNode["alignItems"] })}
                      >
                        {opt.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="prop-group">
              <div className="dense-grid">
                <div>
                  <label>Padding (H / V)</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <select
                      value={(selectedNode as ContainerComponentNode).paddingX || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { paddingX: (e.target.value || undefined) as TokenType })}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <option value="">H</option>
                      <option value="xs">4</option>
                      <option value="sm">8</option>
                      <option value="md">16</option>
                      <option value="lg">24</option>
                    </select>
                    <select
                      value={(selectedNode as ContainerComponentNode).paddingY || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { paddingY: (e.target.value || undefined) as TokenType })}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <option value="">V</option>
                      <option value="xs">4</option>
                      <option value="sm">8</option>
                      <option value="md">16</option>
                      <option value="lg">24</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label>Margin (H / V)</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <select
                      value={(selectedNode as ContainerComponentNode).marginX || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { marginX: (e.target.value || undefined) as TokenType })}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <option value="">H</option>
                      <option value="xs">4</option>
                      <option value="sm">8</option>
                      <option value="md">16</option>
                      <option value="lg">24</option>
                    </select>
                    <select
                      value={(selectedNode as ContainerComponentNode).marginY || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { marginY: (e.target.value || undefined) as TokenType })}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <option value="">V</option>
                      <option value="xs">4</option>
                      <option value="sm">8</option>
                      <option value="md" >16</option>
                      <option value="lg">24</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="prop-group">
              <div className="dense-grid">
                <div>
                  <label>Background</label>
                  <select
                    value={(selectedNode as ContainerComponentNode).backgroundColor || ""}
                    onChange={(e) => onUpdateNode(selectedNode.id, { backgroundColor: e.target.value as ColorToken })}
                    style={{ marginBottom: 0 }}
                  >
                    <ColorOptions includeNone />
                  </select>
                </div>
                <div>
                  <label>Border</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      type="text"
                      placeholder="W"
                      value={(selectedNode as ContainerComponentNode).borderWidth || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { borderWidth: e.target.value })}
                      style={{ marginBottom: 0, flex: 1, padding: "4px" }}
                    />
                    <select
                      value={(selectedNode as ContainerComponentNode).borderStyle || "solid"}
                      onChange={(e) => onUpdateNode(selectedNode.id, { borderStyle: e.target.value as ContainerComponentNode["borderStyle"] })}
                      style={{ marginBottom: 0, flex: 1.5 }}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dash</option>
                      <option value="dotted">Dot</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="dense-grid" style={{ marginTop: "8px" }}>
                <div>
                  <label>Border Color</label>
                  <select
                    value={(selectedNode as ContainerComponentNode).borderColor || ""}
                    onChange={(e) => onUpdateNode(selectedNode.id, { borderColor: e.target.value as ColorToken })}
                    style={{ marginBottom: 0 }}
                  >
                    <ColorOptions noneLabel="None" />
                  </select>
                </div>
                <div>
                  <label>Radius</label>
                  <select
                    value={(selectedNode as ContainerComponentNode).borderRadius || ""}
                    onChange={(e) => onUpdateNode(selectedNode.id, { borderRadius: e.target.value as ContainerComponentNode["borderRadius"] })}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="">None</option>
                    <option value="sm">sm</option>
                    <option value="md">md</option>
                    <option value="lg">lg</option>
                    <option value="full">full</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="prop-group">
              <div className="dense-grid">
                <div>
                  <label>Width</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    <input
                      type="text"
                      placeholder="Auto/100%"
                      value={(selectedNode as ContainerComponentNode).width || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { width: e.target.value })}
                      style={{ marginBottom: 0, flex: 1, fontSize: "11px" }}
                    />
                    <div style={{ display: "flex", gap: "2px" }}>
                      {["auto", "100%"].map(v => (
                        <button key={v} className="size-chip" onClick={() => onUpdateNode(selectedNode.id, { width: v })} style={{ padding: "2px 4px" }}>{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label>Height</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    <input
                      type="text"
                      placeholder="Auto/100%"
                      value={(selectedNode as ContainerComponentNode).height || ""}
                      onChange={(e) => onUpdateNode(selectedNode.id, { height: e.target.value })}
                      style={{ marginBottom: 0, flex: 1, fontSize: "11px" }}
                    />
                    <div style={{ display: "flex", gap: "2px" }}>
                      {["auto", "100%"].map(v => (
                        <button key={v} className="size-chip" onClick={() => onUpdateNode(selectedNode.id, { height: v })} style={{ padding: "2px 4px" }}>{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedNode.type === "container" && activeTab === "config" && (
          <div className="prop-group" style={{ borderTop: "none", marginTop: 0 }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>
              No configuration properties for this component.
            </div>
          </div>
        )}

        {/* Text specific properties */}
        {selectedNode.type === "text" && activeTab === "design" && (
          <>
            <label>Typography</label>
            <select
              value={(selectedNode as TextComponentNode).typography || "body"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  typography: e.target.value as TextComponentNode["typography"],
                })
              }
            >
              <option value="body">Body</option>
              <option value="caption">Caption</option>
              <option value="heading1">Heading 1</option>
              <option value="heading2">Heading 2</option>
              <option value="heading3">Heading 3</option>
              <option value="heading4">Heading 4</option>
              <option value="heading5">Heading 5</option>
            </select>

            <label>Color Token</label>
            <select
              value={(selectedNode as TextComponentNode).color || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  color: e.target.value as ColorToken,
                })
              }
            >
              <ColorOptions includeNone={false} />
            </select>

            <label>Font Weight (Override)</label>
            <select
              value={(selectedNode as TextComponentNode).fontWeight || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  fontWeight: (e.target.value || undefined) as TextComponentNode["fontWeight"],
                })
              }
            >
              <option value="">Default from Typography</option>
              <option value="normal">Normal</option>
              <option value="semiBold">Semi Bold</option>
              <option value="bold">Bold</option>
            </select>

            <label>Text Align</label>
            <select
              value={(selectedNode as TextComponentNode).textAlign || "left"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  textAlign: e.target.value as TextComponentNode["textAlign"],
                })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </>
        )}

        {selectedNode.type === "text" && activeTab === "config" && (
          <>
            <DynamicField
              label="Value"
              value={(selectedNode as TextComponentNode).value || ""}
              fieldKey="value"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
            />

            <ActionEditor
              label="Ação de Clique (Texto)"
              action={(selectedNode as unknown as TextComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="text_action"
            />
          </>
        )}

        {/* Media specific properties */}
        {selectedNode.type === "media" && activeTab === "design" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <div>
                <label>Width</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 100%"
                    value={(selectedNode as MediaComponentNode).width || ""}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        width: e.target.value,
                      })
                    }
                    style={{ marginBottom: "4px" }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { width: "auto" })
                      }
                    >
                      Auto
                    </button>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { width: "100%" })
                      }
                    >
                      100%
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label>Height</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 300px"
                    value={(selectedNode as MediaComponentNode).height || ""}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        height: e.target.value,
                      })
                    }
                    style={{ marginBottom: "4px" }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { height: "auto" })
                      }
                    >
                      Auto
                    </button>
                    <button
                      className="size-chip"
                      style={{
                        backgroundColor:
                          (selectedNode as MediaComponentNode).height === "100%"
                            ? "#dbeafe"
                            : undefined,
                        borderColor:
                          (selectedNode as MediaComponentNode).height === "100%"
                            ? "#3b82f6"
                            : undefined,
                      }}
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { height: "100%" })
                      }
                    >
                      Fill
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label style={{ marginTop: "12px" }}>Object Fit</label>
            <select
              value={(selectedNode as MediaComponentNode).objectFit || "cover"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  objectFit: e.target.value as MediaComponentNode["objectFit"],
                })
              }
            >
              <option value="cover">Cover (Fill)</option>
              <option value="contain">Contain (Fit)</option>
              <option value="fill">Stretch</option>
              <option value="scale-down">Scale Down</option>
              <option value="none">None</option>
            </select>
          </>
        )}

        {selectedNode.type === "media" && activeTab === "config" && (
          <>
            <DynamicField
              label="Mídia URL"
              value={(selectedNode as MediaComponentNode).url || ""}
              fieldKey="url"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <label>Alt Text</label>
            <input
              type="text"
              value={(selectedNode as MediaComponentNode).alt || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  alt: e.target.value,
                })
              }
            />

            <ActionEditor
              label="Ação de Clique (Mídia)"
              action={(selectedNode as unknown as MediaComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="media_action"
            />
          </>
        )}

        {/* HTML specific properties */}
        {selectedNode.type === "html" && activeTab === "design" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <div>
                <label>Padding X</label>
                <select
                  value={(selectedNode as HtmlComponentNode).paddingX || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingX: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">None</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg">lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                </select>
              </div>
              <div>
                <label>Padding Y</label>
                <select
                  value={(selectedNode as HtmlComponentNode).paddingY || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingY: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">None</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg">lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <div>
                <label>Width</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 100%"
                    value={(selectedNode as HtmlComponentNode).width || ""}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        width: e.target.value,
                      })
                    }
                    style={{ marginBottom: "4px" }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { width: "auto" })
                      }
                    >
                      Auto
                    </button>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { width: "100%" })
                      }
                    >
                      100%
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label>Height</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 300px"
                    value={(selectedNode as HtmlComponentNode).height || ""}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        height: e.target.value,
                      })
                    }
                    style={{ marginBottom: "4px" }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="size-chip"
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { height: "auto" })
                      }
                    >
                      Auto
                    </button>
                    <button
                      className="size-chip"
                      style={{
                        backgroundColor:
                          (selectedNode as HtmlComponentNode).height === "100%"
                            ? "#dbeafe"
                            : undefined,
                        borderColor:
                          (selectedNode as HtmlComponentNode).height === "100%"
                            ? "#3b82f6"
                            : undefined,
                      }}
                      onClick={() =>
                        onUpdateNode(selectedNode.id, { height: "100%" })
                      }
                    >
                      Fill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedNode.type === "html" && activeTab === "config" && (
          <>
            <div style={{ marginBottom: "12px", position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={{ marginBottom: "4px" }}>Custom HTML</label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDynamicField(activeDynamicField === "html" ? null : "html");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "var(--primary-color)",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                  title="Dynamic Tags"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4zm0 4c-5.52 0-10 2.69-10 6s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4z" />
                  </svg>
                  Dynamic
                </button>
              </div>
              <textarea
                rows={8}
                value={(selectedNode as HtmlComponentNode).html || ""}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, { html: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  background: "white",
                  resize: "vertical",
                }}
              />
              {activeDynamicField === "html" && (
                <div
                  ref={dynamicPopupRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    zIndex: 101,
                    width: "180px",
                    overflow: "hidden",
                  }}
                >
                  {DYNAMIC_TAGS.map((tag) => (
                    <div
                      key={tag.value}
                      onClick={() => {
                        const currentHtml = (selectedNode as HtmlComponentNode).html || "";
                        onUpdateNode(selectedNode.id, {
                          html: currentHtml + tag.value,
                        });
                        setActiveDynamicField(null);
                      }}
                      style={{
                        padding: "8px 12px",
                        fontSize: "11px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                      className="dynamic-tag-item"
                    >
                      {tag.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ActionEditor
              label="Ação de Clique (HTML)"
              action={(selectedNode as unknown as HtmlComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="html_action"
            />
          </>
        )}

        {/* Button properties */}
        {selectedNode.type === "button" && activeTab === "design" && (
          <>
            <label>Variant</label>
            <select
              value={(selectedNode as ButtonComponentNode).variant || "primary"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  variant: e.target.value as ButtonComponentNode["variant"],
                })
              }
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>

            <label>Radius</label>
            <select
              value={(selectedNode as ButtonComponentNode).radius || "md"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  radius: e.target.value as ButtonComponentNode["radius"],
                })
              }
            >
              <option value="sm">sm (4px)</option>
              <option value="md">md (8px)</option>
              <option value="lg">lg (16px)</option>
              <option value="full">full (circular)</option>
            </select>

            <label>Size</label>
            <select
              value={(selectedNode as ButtonComponentNode).size || "md"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  size: e.target.value as TokenType,
                })
              }
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="xxl">Huge</option>
            </select>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as ButtonComponentNode).fullWidth || false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    fullWidth: e.target.checked,
                  })
                }
                style={{ width: "auto", marginBottom: 0 }}
              />
              Full Width
            </label>
          </>
        )}

        {selectedNode.type === "button" && activeTab === "config" && (
          <>
            <DynamicField
              label="Button Label"
              value={(selectedNode as ButtonComponentNode).label || ""}
              fieldKey="label"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <ActionEditor
              label="Ação (Primary Click)"
              action={(selectedNode as unknown as ButtonComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
              selectedNode={selectedNode}
              parentId="button_action"
            />
          </>
        )}

        {/* Icon component properties */}
        {selectedNode.type === "icon" && activeTab === "design" && (
          <>
            <label>Size (px)</label>
            <input
              type="number"
              value={(selectedNode as IconComponentNode).size || 24}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  size: parseInt(e.target.value) || 24,
                })
              }
            />

            <label>Padding</label>
            <select
              value={(selectedNode as IconComponentNode).padding || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  padding: (e.target.value || undefined) as TokenType,
                })
              }
            >
              <option value="">None</option>
              <option value="xs">xs (4px)</option>
              <option value="sm">sm (8px)</option>
              <option value="md">md (16px)</option>
            </select>

            <label>Background Color</label>
            <select
              value={(selectedNode as IconComponentNode).backgroundColor || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  backgroundColor: (e.target.value || undefined) as ColorToken,
                })
              }
            >
              <ColorOptions noneLabel="Transparent" />
            </select>

            <label>Border Radius</label>
            <select
              value={(selectedNode as IconComponentNode).borderRadius || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  borderRadius: (e.target.value || undefined) as IconComponentNode["borderRadius"],
                })
              }
            >
              <option value="">None</option>
              <option value="sm">sm (4px)</option>
              <option value="md">md (8px)</option>
              <option value="lg">lg (16px)</option>
              <option value="full">full (circular)</option>
            </select>
          </>
        )}

        {selectedNode.type === "icon" && activeTab === "config" && (
          <>
            <label>Icon Identifier</label>
            <select
              value={(selectedNode as IconComponentNode).icon || "star"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  icon: e.target.value,
                })
              }
            >
              <option value="star">Star</option>
              <option value="user">User</option>
              <option value="heart">Heart</option>
              <option value="bookmark">Bookmark</option>
              <option value="share">Share</option>
              <option value="camera">Camera</option>
              <option value="settings">Settings</option>
              <option value="home">Home</option>
              <option value="search">Search</option>
              <option value="bell">Bell</option>
              <option value="shoppingbag">Shopping Bag</option>
            </select>

            <ActionEditor
              label="Ação de Clique (Ícone)"
              action={(selectedNode as unknown as IconComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="icon_action"
            />
          </>
        )}
        {/* Divider properties */}
        {selectedNode.type === "divider" && activeTab === "design" && (
          <>
            <label>Thickness</label>
            <select
              value={(selectedNode as DividerComponentNode).thickness || "medium"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  thickness: e.target.value as DividerComponentNode["thickness"],
                })
              }
            >
              <option value="thin">Thin (0.5px)</option>
              <option value="medium">Medium (1px)</option>
              <option value="thick">Thick (2px)</option>
            </select>
          </>
        )}

        {selectedNode.type === "divider" && activeTab === "config" && (
          <div style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>
            No configuration available
          </div>
        )}
        {/* Post Interactions properties */}
        {selectedNode.type === "post_interactions" && activeTab === "design" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div>
                <label>Padding X</label>
                <select
                  value={(selectedNode as PostInteractionsComponentNode).paddingX || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingX: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">None</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg">lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                  <option value="xxl">xxl (48px)</option>
                </select>
              </div>
              <div>
                <label>Padding Y</label>
                <select
                  value={(selectedNode as PostInteractionsComponentNode).paddingY || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingY: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">Default (12px)</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg" >lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                  <option value="xxl">xxl (48px)</option>
                </select>
              </div>
            </div>

            <label>Gap between Icons</label>
            <select
              value={(selectedNode as PostInteractionsComponentNode).gap || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  gap: (e.target.value || undefined) as TokenType,
                })
              }
            >
              <option value="">Default (16px)</option>
              <option value="xs">xs (4px)</option>
              <option value="sm">sm (8px)</option>
              <option value="md">md (16px)</option>
              <option value="lg">lg (24px)</option>
              <option value="xl">xl (32px)</option>
              <option value="xxl">xxl (48px)</option>
            </select>
          </>
        )}

        {selectedNode.type === "post_interactions" && activeTab === "config" && (
          <>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as PostInteractionsComponentNode).showLike !== false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    showLike: e.target.checked,
                  })
                }
                style={{ width: "auto", margin: 0 }}
              />
              Show Like Icon
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as PostInteractionsComponentNode).showSave !== false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    showSave: e.target.checked,
                  })
                }
                style={{ width: "auto", margin: 0 }}
              />
              Show Save Icon
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as PostInteractionsComponentNode).showShare !== false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    showShare: e.target.checked,
                  })
                }
                style={{ width: "auto", margin: 0 }}
              />
              Show Share Icon
            </label>
          </>
        )}
        {/* Price properties */}
        {selectedNode.type === "price" && activeTab === "design" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <div>
                <label>Padding X</label>
                <select
                  value={(selectedNode as PriceComponentNode).paddingX || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingX: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">None</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg" >lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                  <option value="xxl">xxl (48px)</option>
                </select>
              </div>
              <div>
                <label>Padding Y</label>
                <select
                  value={(selectedNode as PriceComponentNode).paddingY || ""}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      paddingY: (e.target.value || undefined) as TokenType,
                    })
                  }
                >
                  <option value="">Default (8px)</option>
                  <option value="xs">xs (4px)</option>
                  <option value="sm">sm (8px)</option>
                  <option value="md">md (16px)</option>
                  <option value="lg" >lg (24px)</option>
                  <option value="xl">xl (32px)</option>
                  <option value="xxl">xxl (48px)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {selectedNode.type === "price" && activeTab === "config" && (
          <>
            <DynamicField
              label="Price"
              value={(selectedNode as PriceComponentNode).price || ""}
              fieldKey="price"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <DynamicField
              label="Original Price"
              value={(selectedNode as PriceComponentNode).originalPrice || ""}
              fieldKey="originalPrice"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <DynamicField
              label="Discount %(e.g. 25)"
              value={(selectedNode as PriceComponentNode).discountPercent || ""}
              fieldKey="discountPercent"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <hr style={{ margin: "16px 0", opacity: 0.1 }} />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as PriceComponentNode).showOriginalPrice !== false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    showOriginalPrice: e.target.checked,
                  })
                }
                style={{ width: "auto", margin: 0 }}
              />
              Show Original Price
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(selectedNode as PriceComponentNode).showDiscountPercent !== false}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    showDiscountPercent: e.target.checked,
                  })
                }
                style={{ width: "auto", margin: 0 }}
              />
              Show Percent Tag
            </label>

            <ActionEditor
              label="Ação de Clique (Preço)"
              action={(selectedNode as unknown as PriceComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="price_action"
            />
          </>
        )}

        {/* Avatar specific properties */}
        {selectedNode.type === "avatar" && activeTab === "design" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              <div>
                <label>Size (px)</label>
                <input
                  type="number"
                  value={(selectedNode as AvatarComponentNode).size || 40}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      size: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label>Radius</label>
                <select
                  value={(selectedNode as AvatarComponentNode).borderRadius || "full"}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, {
                      borderRadius: e.target.value as "sm" | "md" | "lg" | "full",
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="sm">sm (4px)</option>
                  <option value="md">md (8px)</option>
                  <option value="lg">lg (16px)</option>
                  <option value="full">full</option>
                </select>
              </div>
            </div>

            <label style={{ marginTop: "12px" }}>Background</label>
            <select
              value={(selectedNode as AvatarComponentNode).backgroundColor || ""}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  backgroundColor: e.target.value as ColorToken,
                })
              }
            >
              <ColorOptions noneLabel="Gray 100" />
            </select>
          </>
        )}

        {selectedNode.type === "avatar" && activeTab === "config" && (
          <>
            <DynamicField
              label="Avatar URL"
              value={(selectedNode as AvatarComponentNode).url || ""}
              fieldKey="url"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef as React.RefObject<HTMLDivElement>}
            />

            <label>Fallback Icon</label>
            <input
              type="text"
              value={(selectedNode as AvatarComponentNode).icon || "user"}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, {
                  icon: e.target.value,
                })
              }
              placeholder="user, shoppingbag, heart..."
            />

            <ActionEditor
              label="Ação de Clique (Avatar)"
              action={(selectedNode as unknown as AvatarComponentNode).action}
              onUpdate={(action) => onUpdateNode(selectedNode.id, { action })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="avatar_action"
            />
          </>
        )}

        {/* Header Properties */}
        {selectedNode.type === "header" && activeTab === "design" && (
           <div style={{ textAlign: "center", padding: "20px", opacity: 0.5, color: "var(--text-secondary)"}}>
             Header uses system-defined layout
           </div>
        )}

        {selectedNode.type === "header" && activeTab === "config" && (
          <>
            <DynamicField
              label="Image URL"
              value={(selectedNode as HeaderComponentNode).imageUrl || ""}
              fieldKey="imageUrl"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
            />

            <DynamicField
              label="Shopping Name"
              value={(selectedNode as HeaderComponentNode).title || ""}
              fieldKey="title"
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
            />

            <ActionEditor
              label="Clique no Perfil (Header)"
              action={(selectedNode as HeaderComponentNode).onProfilePress}
              onUpdate={(onProfilePress) => onUpdateNode(selectedNode.id, { onProfilePress })}
              activeDynamicField={activeDynamicField}
              setActiveDynamicField={setActiveDynamicField}
              dynamicPopupRef={dynamicPopupRef}
              selectedNode={selectedNode}
              parentId="header_profile_action"
            />

            <div style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontWeight: 600 }}>Menu Items</label>
                <button
                  type="button"
                  onClick={() => {
                    const items = [...((selectedNode as HeaderComponentNode).menuItems || [])];
                    items.push({ icon: "star", text: "Novo item", action: { type: "OPEN_URL", payload: { url: "" } } });
                    onUpdateNode(selectedNode.id, { menuItems: items });
                  }}
                  style={{
                    background: "var(--primary-color)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  + Adicionar
                </button>
              </div>

              {((selectedNode as HeaderComponentNode).menuItems || []).map((item: HeaderMenuItem, idx: number) => {
                const isExpanded = expandedHeaderMenuItem === idx;
                return (
                  <div
                     key={idx}
                     style={{
                       border: "1px solid var(--border-color)",
                       borderRadius: "6px",
                       marginBottom: "8px",
                       background: "var(--bg-panel)",
                       overflow: "hidden"
                     }}
                  >
                    <div 
                      onClick={() => setExpandedHeaderMenuItem(isExpanded ? null : idx)}
                      style={{ 
                        padding: "8px 12px", 
                        cursor: "pointer", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        background: isExpanded ? "rgba(0,0,0,0.05)" : "transparent",
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                        {isExpanded ? <Icons.CaretDownOutlined /> : <Icons.CaretRightOutlined />}
                        {item.text || `Item ${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const items = [...((selectedNode as HeaderComponentNode).menuItems || [])];
                          items.splice(idx, 1);
                          onUpdateNode(selectedNode.id, { menuItems: items });
                          if (expandedHeaderMenuItem === idx) setExpandedHeaderMenuItem(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#ef4444",
                          padding: "4px"
                        }}
                        title="Remover item"
                      >
                        <Icons.DeleteOutlined />
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid var(--border-color)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px" }}>
                          <div>
                            <label style={{ fontSize: "10px", margin: 0, opacity: 0.7 }}>Ícone</label>
                            <input
                              type="text"
                              placeholder="Ex: user"
                              value={item.icon}
                              style={{ margin: 0, padding: "4px" }}
                              onChange={(e) => {
                                const items = [...((selectedNode as HeaderComponentNode).menuItems || [])];
                                items[idx] = { ...items[idx], icon: e.target.value };
                                onUpdateNode(selectedNode.id, { menuItems: items });
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "10px", margin: 0, opacity: 0.7 }}>Texto</label>
                            <input
                              type="text"
                              placeholder="Texto"
                              value={item.text}
                              style={{ margin: 0, padding: "4px" }}
                              onChange={(e) => {
                                const items = [...((selectedNode as HeaderComponentNode).menuItems || [])];
                                items[idx] = { ...items[idx], text: e.target.value };
                                onUpdateNode(selectedNode.id, { menuItems: items });
                              }}
                            />
                          </div>
                        </div>

                        <ActionEditor
                          label="Ação do Item"
                          action={item.action}
                          onUpdate={(action) => {
                            const items = [...((selectedNode as HeaderComponentNode).menuItems || [])];
                            items[idx] = { ...items[idx], action };
                            onUpdateNode(selectedNode.id, { menuItems: items });
                          }}
                          activeDynamicField={activeDynamicField}
                          setActiveDynamicField={setActiveDynamicField}
                          dynamicPopupRef={dynamicPopupRef}
                          selectedNode={selectedNode}
                          parentId={`menu_item_${idx}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
