import { Drawer, Space, Typography, Input, Collapse, Tag, Tabs, Button, message } from "antd";
import { BgColorsOutlined, LayoutOutlined, CodeOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import type { Theme, ColorToken } from "../../types";

const { Text } = Typography;
const { Panel } = Collapse;

interface ThemeDrawerProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (newTheme: Theme) => void;
  onSave?: (newTheme: Theme) => void;
  title?: string;
}

export default function ThemeDrawer({
  open,
  onClose,
  theme,
  onThemeChange,
  onSave,
  title = "Editar Tema",
}: ThemeDrawerProps) {
  const [localTheme, setLocalTheme] = useState<Theme>(theme);

  // Sync with prop when drawer opens
  useEffect(() => {
    if (open) {
      setLocalTheme(theme);
    }
  }, [open, theme]);

  const handleColorChange = (name: ColorToken, value: string) => {
    const updated = { ...localTheme, colors: { ...localTheme.colors, [name]: value } };
    setLocalTheme(updated);
  };

  const handleSpacingChange = (token: string, value: string) => {
    const updated = { ...localTheme, spacing: { ...localTheme.spacing, [token]: value } };
    setLocalTheme(updated);
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(localTheme) !== JSON.stringify(theme);
  }, [localTheme, theme]);

  const handleSave = () => {
    if (onSave) {
      onSave(localTheme);
    } else {
      onThemeChange(localTheme);
    }
  };

  const renderColorItem = (name: ColorToken, label: string) => {
    const color = localTheme.colors[name];
    return (
      <div key={name} className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded-md border border-gray-100 mb-2">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(name, e.target.value)}
            className="w-5 h-5 rounded border border-gray-200 shrink-0 cursor-pointer p-0"
            style={{ appearance: "none", WebkitAppearance: "none", background: "none" }}
          />
          <div className="flex flex-col">
            <Text className="text-[10px] font-bold text-gray-700 leading-tight">{label}</Text>
            <Text className="text-[8px] text-gray-400 font-mono italic">{name}</Text>
          </div>
        </div>
        <Input
          size="small"
          value={color}
          onChange={(e) => handleColorChange(name, e.target.value)}
          className="w-20 text-[10px] h-7 px-1.5 font-mono"
        />
      </div>
    );
  };

  const renderColorSection = (
    key: string,
    label: string,
    items: [ColorToken, string][],
    extra?: React.ReactNode
  ) => (
    <Panel
      header={<Text strong className="text-[11px] uppercase tracking-wider text-gray-500">{label}</Text>}
      key={key}
    >
        {extra}
        {items.map(([token, name]) => renderColorItem(token, name))}
    </Panel>
  );

  return (
    <Drawer
      title={title}
      closeIcon={false}
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
      styles={{ 
        header: { padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
        body: { padding: "0 20px 20px" },
        footer: { padding: "12px 20px", borderTop: "1px solid #f1f5f9" }
      }}
      footer={
        <div className="flex justify-between items-center w-full">
          <Button 
            icon={<CodeOutlined />} 
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(localTheme, null, 2));
              message.success("Tema copiado para a área de transferência!");
            }}
          >
            Exportar JSON
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Salvar
          </Button>
        </div>
      }
    >
      <Tabs
        defaultActiveKey="spacing"
        className="theme-tabs"
        items={[
          {
            key: "spacing",
            label: (
              <Space size="small">
                <LayoutOutlined className="text-[12px]" />
                <span className="text-[12px] font-bold text-gray-700">Espaços</span>
              </Space>
            ),
            children: (
              <div className="pt-2 grid grid-cols-2 gap-x-4 gap-y-3">
                {localTheme?.spacing &&
                  Object.entries(localTheme.spacing).map(([token, value]) => (
                    <div key={token} className="flex flex-col gap-1">
                      <Text className="text-[9px] font-bold uppercase text-gray-400">{token}</Text>
                      <Input
                        size="small"
                        value={value as string}
                        onChange={(e) => handleSpacingChange(token, e.target.value)}
                        className="text-[10px] h-7 px-2"
                      />
                    </div>
                  ))}
              </div>
            ),
          },
          {
            key: "colors",
            label: (
              <Space size="small">
                <BgColorsOutlined className="text-[12px]" />
                <span className="text-[12px] font-bold">Cores</span>
              </Space>
            ),
            children: (
              <div>
                <Collapse
                  ghost
                  expandIconPosition="end"
                  defaultActiveKey={["base"]}
                  className="theme-collapse"
                  style={{ padding: 0 }}
                >
                  {renderColorSection("base", "Marca", [
                    ["primary", "Primária"],
                    ["secondary", "Secundária"],
                    ["accent", "Destaque"],
                  ])}

                  {renderColorSection("feedback", "Feedback", [
                    ["success", "Sucesso"],
                    ["warning", "Aviso"],
                    ["error", "Erro"],
                    ["info", "Informação"],
                  ])}

                  {renderColorSection("neutrals", "Neutras", [
                    ["white", "White"],
                    ["black", "Black"],
                    ...((["gray-50", "gray-100", "gray-200", "gray-300", "gray-400", "gray-500", "gray-600", "gray-700", "gray-800", "gray-900", "gray-950"] as ColorToken[]).map(
                      (t) => [t, t.replace("gray-", "Nível ")] as [ColorToken, string]
                    )),
                  ])}

                  {renderColorSection(
                    "interactions",
                    "Interações",
                    [
                      ["primary-hover", "Primary Hover"],
                      ["primary-active", "Primary Active"],
                      ["secondary-hover", "Secondary Hover"],
                      ["secondary-active", "Secondary Active"],
                    ],
                    <Tag color="blue" className="mb-3 text-[9px]">Automático via CSS</Tag>
                  )}
                </Collapse>
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
}
