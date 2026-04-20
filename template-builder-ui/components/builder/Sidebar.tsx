import React, { useState } from "react";
import { Tabs, Typography, Space, Input, Button } from "antd";
import { 
  AppstoreOutlined, 
  FontSizeOutlined, 
  DollarOutlined, 
  LineOutlined, 
  PictureFilled, 
  HeartOutlined, 
  BorderOutlined,
  StarOutlined,
  ImportOutlined,
  CodeOutlined,
  LayoutOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const ButtonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M7 12h10" />
    </svg>
);

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: string) => void;
  activeTab?: string;
  onImportJson?: (jsonText: string) => boolean;
}

export default function Sidebar({ 
  onDragStart, 
  activeTab: controlledTab,
  onImportJson
}: SidebarProps) {
  const [internalTab, setInternalTab] = useState("elements");
  const [importJsonText, setImportJsonText] = useState("");
  
  const activeTab = controlledTab || internalTab;
  const setActiveTab = controlledTab ? () => {} : setInternalTab;

  const handleImport = () => {
    if (onImportJson?.(importJsonText)) {
      setImportJsonText("");
    }
  };

  const elementsItems = [
    {
      title: "Containers",
      items: [
        { type: "container", label: "Container", icon: <BorderOutlined style={{ fontSize: '20px' }} /> },
      ]
    },
    {
      title: "Visuais",
      items: [
        { type: "header", label: "Header", icon: <LayoutOutlined style={{ fontSize: '20px' }} /> },
        { type: "text", label: "Texto", icon: <FontSizeOutlined style={{ fontSize: '20px' }} /> },
        { type: "price", label: "Preço", icon: <DollarOutlined style={{ fontSize: '20px' }} /> },
        { type: "divider", label: "Divisor", icon: <LineOutlined style={{ fontSize: '20px' }} /> },
        { type: "media", label: "Mídia", icon: <PictureFilled style={{ fontSize: '20px' }} /> },
        { type: "avatar", label: "Avatar", icon: <AppstoreOutlined style={{ fontSize: '20px' }} /> },
        { type: "post_interactions", label: "Interações", icon: <HeartOutlined style={{ fontSize: '20px' }} /> },
        { type: "html", label: "HTML Custom", icon: <CodeOutlined style={{ fontSize: '20px' }} /> },
      ]
    },
    {
      title: "Ações",
      items: [
        { type: "button", label: "Botão", icon: <ButtonIcon /> },
        { type: "icon", label: "Ícone", icon: <StarOutlined style={{ fontSize: '20px', color: '#f59e0b' }} /> },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        className="builder-tabs-50"
        tabBarGutter={0}
        items={[
          {
            key: "elements",
            label: (
              <Space size={8}>
                <AppstoreOutlined />
                <span>Elementos</span>
              </Space>
            ),
            children: (
              <div className="p-3 overflow-y-auto flex-1">
                {elementsItems.map((section) => (
                  <div key={section.title} className="mb-4">
                    <Text strong type="secondary" className="text-[10px] uppercase tracking-wider block mb-2 pl-1">
                      {section.title}
                    </Text>
                    <div className="grid grid-cols-2 gap-2">
                      {section.items.map((item) => (
                        <div
                          key={item.type}
                          draggable
                          onDragStart={(e) => onDragStart(e, item.type)}
                          className="group flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                        >
                          <div className="mb-1 text-gray-500 group-hover:text-primary transition-colors">
                            {React.cloneElement(item.icon as React.ReactElement<{ style: React.CSSProperties }>, { style: { fontSize: '18px' } })}
                          </div>
                          <Text className="text-[10px] text-gray-600 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          },
          {
            key: "import",
            label: (
              <Space size={8}>
                <ImportOutlined />
                <span>Importar</span>
              </Space>
            ),
            children: (
              <div className="p-5 overflow-y-auto flex-1">
                <Text strong type="secondary" className="text-[11px] uppercase tracking-wider block mb-3">
                  🚀 Importar Configuração
                </Text>
                <Text type="secondary" className="text-xs block mb-6 leading-relaxed">
                  Cole abaixo o JSON do template ou do post que deseja importar. 
                  O editor tentará extrair a lista de componentes automaticamente.
                </Text>

                <div className="space-y-4">
                  <Input.TextArea
                    rows={12}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"template": [...] }'
                    className="font-mono text-[10px] bg-gray-50 border-gray-200 rounded-lg p-3 hover:bg-white focus:bg-white transition-all"
                    style={{ resize: 'none' }}
                  />
                  <Button 
                    type="primary" 
                    icon={<ImportOutlined />} 
                    onClick={handleImport}
                    className="w-full bg-primary h-10 shadow-md shadow-primary/10"
                    disabled={!importJsonText.trim()}
                  >
                    Importar JSON
                  </Button>
                </div>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
