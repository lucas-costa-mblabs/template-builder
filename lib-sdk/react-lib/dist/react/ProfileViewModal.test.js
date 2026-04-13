import { jsx as _jsx } from "react/jsx-runtime";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TemplateProvider } from "./TemplateProvider.js";
import { HeaderNode } from "./nodes/HeaderNode.js";
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
const mockTemplates = [
    {
        templateId: "tpl_1",
        name: "Test template",
        active: true,
        slug: "test",
        data: [
            {
                id: "text-1",
                type: "text",
                value: "{{post.title}}",
            },
        ],
    },
];
function createTracker() {
    return {
        trackEvent: vi.fn().mockResolvedValue(undefined),
        trackImpression: vi.fn().mockResolvedValue(undefined),
        trackViewTime: vi.fn().mockResolvedValue(undefined),
        toggleLike: vi.fn().mockResolvedValue(undefined),
        fetchProfileFeed: vi.fn().mockResolvedValue([]),
        followAccount: vi.fn().mockResolvedValue(undefined),
        unfollowAccount: vi.fn().mockResolvedValue(undefined),
        toggleFollowAccount: vi.fn().mockResolvedValue(undefined),
        addFavorite: vi.fn().mockResolvedValue(undefined),
        removeFavorite: vi.fn().mockResolvedValue(undefined),
        toggleFavorite: vi.fn().mockResolvedValue(undefined),
        reportContent: vi.fn().mockResolvedValue(undefined),
        shareContent: vi.fn().mockResolvedValue(undefined),
    };
}
describe("Profile View Modal", () => {
    it("should open profile modal, fetch account feed and toggle follow", async () => {
        const tracker = createTracker();
        tracker.fetchProfileFeed.mockResolvedValue([
            {
                id: "post_2",
                contentId: "post_2",
                accountId: "profile_1",
                templateId: "tpl_1",
                title: "Raquete de Tênis Babolat Pure Aero",
                url: "https://example.com/image.jpg",
                profile: {
                    accountId: "profile_1",
                    accountName: "Super Zeus",
                    iconUrl: "https://example.com/avatar.png",
                },
            },
        ]);
        render(_jsx(TemplateProvider, { theme: mockTheme, templates: mockTemplates, config: mockConfig, tracker: tracker, children: _jsx(HeaderNode, { node: {
                    id: "header-1",
                    type: "header",
                    imageUrl: "{{post.profile.iconUrl}}",
                    title: "{{post.profile.accountName}}",
                    onProfilePress: {
                        type: "UI_ACTION",
                        payload: { actionName: "open_profile" },
                    },
                }, dataContext: {
                    post: {
                        contentId: "content_1",
                        accountId: "profile_1",
                        templateId: "tpl_1",
                        title: "Super Zeus",
                        url: "https://example.com/current-image.jpg",
                        profile: {
                            accountId: "profile_1",
                            accountName: "Super Zeus",
                            iconUrl: "https://example.com/avatar.png",
                            description: "Loja oficial da Super Zeus",
                        },
                    },
                } }) }));
        fireEvent.click(screen.getByText("Super Zeus"));
        expect(await screen.findByRole("dialog", { name: "Perfil de Super Zeus" })).toBeInTheDocument();
        await waitFor(() => {
            expect(tracker.fetchProfileFeed).toHaveBeenCalledWith("profile_1");
        });
        expect(await screen.findByText("Raquete de Tênis Babolat Pure Aero")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Seguir" }));
        await waitFor(() => {
            expect(tracker.toggleFollowAccount).toHaveBeenCalledWith("profile_1", false);
        });
        expect(screen.getByRole("button", { name: "Seguindo" })).toBeInTheDocument();
    });
    it("should show empty state when profile feed has no posts", async () => {
        const tracker = createTracker();
        render(_jsx(TemplateProvider, { theme: mockTheme, templates: mockTemplates, config: mockConfig, tracker: tracker, children: _jsx(HeaderNode, { node: {
                    id: "header-2",
                    type: "header",
                    title: "{{post.profile.accountName}}",
                    onProfilePress: {
                        type: "UI_ACTION",
                        payload: { actionName: "open_profile" },
                    },
                }, dataContext: {
                    post: {
                        contentId: "content_2",
                        accountId: "profile_2",
                        templateId: "tpl_1",
                        title: "Loja Vazia",
                        url: "https://example.com/current-image.jpg",
                        profile: {
                            accountId: "profile_2",
                            accountName: "Loja Vazia",
                            iconUrl: "https://example.com/avatar.png",
                        },
                    },
                } }) }));
        fireEvent.click(screen.getByText("Loja Vazia"));
        expect(await screen.findByText("Esta conta ainda não possui publicações disponíveis.")).toBeInTheDocument();
    });
    it("should handle missing profile account id gracefully", async () => {
        const tracker = createTracker();
        render(_jsx(TemplateProvider, { theme: mockTheme, templates: mockTemplates, config: mockConfig, tracker: tracker, children: _jsx(HeaderNode, { node: {
                    id: "header-3",
                    type: "header",
                    title: "{{post.profile.accountName}}",
                    onProfilePress: {
                        type: "UI_ACTION",
                        payload: { actionName: "open_profile" },
                    },
                }, dataContext: {
                    post: {
                        contentId: "content_3",
                        templateId: "tpl_1",
                        title: "Conta sem id",
                        url: "https://example.com/current-image.jpg",
                        profile: {
                            accountName: "Conta sem id",
                            iconUrl: "https://example.com/avatar.png",
                        },
                    },
                } }) }));
        fireEvent.click(screen.getByText("Conta sem id"));
        expect(await screen.findByText("Não foi possível identificar o perfil desta conta.")).toBeInTheDocument();
        expect(tracker.fetchProfileFeed).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=ProfileViewModal.test.js.map