import { jsx as _jsx } from "react/jsx-runtime";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TemplateProvider } from "./TemplateProvider.js";
import { HeaderNode } from "./nodes/HeaderNode.js";
describe("Report Dialog", () => {
    const mockTheme = {
        colors: { primary: "#0d63d6" },
        spacing: { md: "16px" },
        borderRadius: { md: "8px" },
        typography: {},
    };
    const mockConfig = {
        accountId: "acc_123",
        apiKey: "api_456",
        customerId: "cust_789",
    };
    it("should open report dialog from header menu and submit data", async () => {
        const onReportSubmit = vi.fn();
        render(_jsx(TemplateProvider, { theme: mockTheme, config: mockConfig, onReportSubmit: onReportSubmit, children: _jsx(HeaderNode, { node: {
                    id: "header-1",
                    type: "header",
                    imageUrl: "{{post.profile.iconUrl}}",
                    title: "{{post.profile.accountName}}",
                    menuItems: [
                        {
                            icon: "report",
                            text: "Denunciar anúncio",
                            action: {
                                type: "UI_ACTION",
                                payload: { actionName: "report" },
                            },
                        },
                    ],
                }, dataContext: {
                    post: {
                        contentId: "content_1",
                        campaignId: "campaign_1",
                        title: "Raquete de Tênis Babolat Pure Aero",
                        profile: {
                            accountName: "Super Zeus",
                            iconUrl: "https://example.com/avatar.png",
                        },
                    },
                } }) }));
        fireEvent.click(screen.getByRole("button", { name: /abrir opções/i }));
        fireEvent.click(screen.getByText("Denunciar anúncio"));
        expect(screen.getByRole("dialog", { name: "Denunciar anúncio" })).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText("Outro motivo"));
        fireEvent.change(screen.getByPlaceholderText("Descreva o motivo da denúncia..."), {
            target: { value: "Conteúdo suspeito" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Enviar denúncia" }));
        expect(onReportSubmit).toHaveBeenCalledWith(expect.objectContaining({
            reasonId: "other_reason",
            reasonLabel: "Outro motivo",
            details: "Conteúdo suspeito",
            contentId: "content_1",
            campaignId: "campaign_1",
            title: "Raquete de Tênis Babolat Pure Aero",
        }), expect.objectContaining({
            report: expect.objectContaining({
                reasonId: "other_reason",
                details: "Conteúdo suspeito",
            }),
        }));
    });
});
//# sourceMappingURL=ReportDialog.test.js.map