import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TemplateProvider } from "./TemplateProvider.js";
import { HeaderNode } from "./nodes/HeaderNode.js";

describe("Report Dialog", () => {
  const mockTheme = {
    colors: { primary: "#0d63d6" },
    spacing: { md: "16px" },
    borderRadius: { md: "8px" },
    typography: {},
  } as any;

  const mockConfig = {
    accountId: "acc_123",
    apiKey: "api_456",
    customerId: "cust_789",
  };

  it("should open report dialog from header menu and submit data", async () => {
    const onReportSubmit = vi.fn();

    render(
      <TemplateProvider
        theme={mockTheme}
        config={mockConfig}
        onReportSubmit={onReportSubmit}
      >
        <HeaderNode
          node={
            {
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
            } as any
          }
          dataContext={
            {
              post: {
                contentId: "content_1",
                campaignId: "campaign_1",
                title: "Raquete de Tênis Babolat Pure Aero",
                profile: {
                  accountName: "Super Zeus",
                  iconUrl: "https://example.com/avatar.png",
                },
              },
            } as any
          }
        />
      </TemplateProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /abrir opções/i }));
    fireEvent.click(screen.getByText("Denunciar anúncio"));

    expect(screen.getByRole("dialog", { name: "Denunciar anúncio" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Outro motivo"));
    fireEvent.change(screen.getByPlaceholderText("Descreva o motivo da denúncia..."), {
      target: { value: "Conteúdo suspeito" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar denúncia" }));

    expect(onReportSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        reasonId: "other_reason",
        reasonLabel: "Outro motivo",
        details: "Conteúdo suspeito",
        contentId: "content_1",
        campaignId: "campaign_1",
        title: "Raquete de Tênis Babolat Pure Aero",
      }),
      expect.objectContaining({
        report: expect.objectContaining({
          reasonId: "other_reason",
          details: "Conteúdo suspeito",
        }),
      }),
    );
  });

  it("should toggle follow label in header menu", async () => {
    const tracker = {
      trackEvent: vi.fn().mockResolvedValue(undefined),
      trackImpression: vi.fn().mockResolvedValue(undefined),
      trackViewTime: vi.fn().mockResolvedValue(undefined),
      toggleLike: vi.fn().mockResolvedValue(undefined),
      followAccount: vi.fn().mockResolvedValue(undefined),
      unfollowAccount: vi.fn().mockResolvedValue(undefined),
      toggleFollowAccount: vi.fn().mockResolvedValue(undefined),
      addFavorite: vi.fn().mockResolvedValue(undefined),
      removeFavorite: vi.fn().mockResolvedValue(undefined),
      toggleFavorite: vi.fn().mockResolvedValue(undefined),
      reportContent: vi.fn().mockResolvedValue(undefined),
      shareContent: vi.fn().mockResolvedValue(undefined),
    };

    render(
      <TemplateProvider theme={mockTheme} config={mockConfig} tracker={tracker as any}>
        <HeaderNode
          node={
            {
              id: "header-follow",
              type: "header",
              imageUrl: "{{post.profile.iconUrl}}",
              title: "{{post.profile.accountName}}",
              menuItems: [
                {
                  icon: "user",
                  text: "Seguir",
                  action: {
                    type: "UI_ACTION",
                    payload: { actionName: "follow" },
                  },
                },
              ],
            } as any
          }
          dataContext={
            {
              post: {
                accountId: "profile_1",
                profile: {
                  accountName: "Super Zeus",
                  iconUrl: "https://example.com/avatar.png",
                },
              },
            } as any
          }
        />
      </TemplateProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /abrir opções/i }));
    fireEvent.click(screen.getByText("Seguir"));

    await waitFor(() => {
      expect(tracker.toggleFollowAccount).toHaveBeenCalledWith("profile_1", false);
    });

    fireEvent.click(screen.getByRole("button", { name: /abrir opções/i }));
    expect(screen.getByText("Deixar de seguir")).toBeInTheDocument();
  });
});
