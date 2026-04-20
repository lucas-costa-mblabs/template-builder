import React from "react";
import { Button, Space, Modal, Typography, Tooltip, Divider, message } from "antd";
import { 
  EyeOutlined, 
  CodeOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  CopyOutlined,
  BorderOutlined
} from "@ant-design/icons";
import ComponentRenderer from "../ComponentRenderer";
import type { ComponentNode, Theme } from "../../types";

const { Text } = Typography;

interface CanvasAreaProps {
  showGuides: boolean;
  setShowGuides: (show: boolean) => void;
  components: ComponentNode[];
  theme?: Theme;
  selectedNodeId: string | null;
  isDragOver: boolean;
  dragOverNodeId: string | null;
  dragPosition: "top" | "bottom" | "inside" | null;
  onSelectNode: (id: string | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStartNode: (e: React.DragEvent, id: string) => void;
  onDragOverNode: (e: React.DragEvent, id: string) => void;
  onDragLeaveNode: (e: React.DragEvent, id: string) => void;
  onDropNode: (e: React.DragEvent, id: string) => void;
  onSave?: () => void;
  templateName?: string;
  onRenameTemplate?: (name: string) => void;
  children?: React.ReactNode;
}

export default function CanvasArea({
  showGuides,
  setShowGuides,
  components,
  theme: dynamicTheme,
  selectedNodeId,
  isDragOver,
  dragOverNodeId,
  dragPosition,
  onSelectNode,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStartNode,
  onDragOverNode,
  onDragLeaveNode,
  onDropNode,
  children,
}: CanvasAreaProps) {
  const [zoom, setZoom] = React.useState(0.75);
  const [showCode, setShowCode] = React.useState(false);

  const handlePreview = () => {
    localStorage.setItem("builder-components", JSON.stringify(components));
    window.open("/template-builder/previews", "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Código JSON copiado para a área de transferência!");
  };

  const generatedCode = JSON.stringify(
    { template: components },
    null,
    2,
  );

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Floating Canvas Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <Space className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-gray-100">
          <Tooltip title="Preview">
            <Button 
              shape="circle" 
              icon={<EyeOutlined />} 
              onClick={handlePreview} 
              type="text"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Diminuir Zoom">
            <Button 
              shape="circle" 
              icon={<ZoomOutOutlined />} 
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} 
              type="text"
            />
          </Tooltip>
          <div className="min-w-[45px] text-center">
            <Text strong className="text-[11px]">{Math.round(zoom * 100)}%</Text>
          </div>
          <Tooltip title="Aumentar Zoom">
            <Button 
              shape="circle" 
              icon={<ZoomInOutlined />} 
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} 
              type="text"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Ver JSON">
            <Button 
              shape="circle" 
              icon={<CodeOutlined />} 
              onClick={() => setShowCode(true)} 
              type="text"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title={showGuides ? "Ocultar Guias" : "Mostrar Guias"}>
            <Button 
              shape="circle" 
              icon={<BorderOutlined />} 
              onClick={() => setShowGuides(!showGuides)} 
              type={showGuides ? "primary" : "text"}
              size="small"
              className={showGuides ? "bg-primary text-white" : ""}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Main Canvas Workspace */}
      <div 
        className="flex-1 overflow-auto pt-20 pb-10 px-6 flex justify-center bg-[#f1f5f9] custom-scrollbar"
        onClick={() => onSelectNode(null)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={`canvas-page format-portrait shadow-2xl relative bg-white ${showGuides ? "show-guides" : ""}`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* Social Media Safe Zones (20px Margin on all sides) */}
          {showGuides && (
            <div className="absolute inset-0 border-[20px] border-gray-500/10 pointer-events-none z-20 flex items-start justify-center pt-1 overflow-hidden transition-all">
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full">
            {components.map((node) => (
              <ComponentRenderer
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                dragOverNodeId={dragOverNodeId}
                dragPosition={dragPosition}
                onSelect={onSelectNode}
                onDragStartNode={onDragStartNode}
                onDragOverNode={onDragOverNode}
                onDragLeaveNode={onDragLeaveNode}
                onDropNode={onDropNode}
                theme={dynamicTheme}
              />
            ))}

            {components.length === 0 && (
              <div
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all m-4 rounded-xl
                  ${isDragOver ? "border-primary bg-primary/5 scale-105" : "border-gray-200 bg-gray-50 opacity-60"}`}
              >
                <div className="text-4xl text-gray-300 mb-2">+</div>
                <Text type="secondary" strong>Arraste elementos para começar</Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {children}

      <Modal
        title={
          <Space>
            <CodeOutlined className="text-primary" />
            <span>Código JSON do Template</span>
          </Space>
        }
        open={showCode}
        onCancel={() => setShowCode(false)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedCode)}>
            Copiar Código
          </Button>,
          <Button key="close" type="primary" onClick={() => setShowCode(false)}>
            Fechar
          </Button>
        ]}
        width={700}
        centered
      >
        <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[500px]">
          <pre className="m-0 text-blue-300 text-xs font-mono leading-relaxed">
            {generatedCode}
          </pre>
        </div>
      </Modal>
    </div>
  );
}
