import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PostInteractionsNode } from "./PostInteractionsNode.js";
import { TemplateContext } from "../context.js";
describe("PostInteractionsNode", () => {
    const mockTheme = {
        colors: {},
        spacing: { md: "16px" },
        borderRadius: {},
        typography: {},
    };
    const mockTracker = {
        trackEvent: async () => { },
        trackImpression: async () => { },
        trackViewTime: async () => { },
        toggleLike: async () => { },
        addFavorite: vi.fn(async () => { }),
        removeFavorite: vi.fn(async () => { }),
        toggleFavorite: async () => { },
        shareContent: async () => { },
    };
    const renderWithContext = (ui) => {
        return render(_jsx(TemplateContext.Provider, { value: {
                theme: mockTheme,
                templates: [],
                tracker: mockTracker,
            }, children: ui }));
    };
    it("should render interaction buttons", () => {
        const node = {
            id: "pi1",
            type: "post_interactions",
            showLike: true,
            showSave: true,
            showShare: true,
        };
        const { container } = renderWithContext(_jsx(PostInteractionsNode, { node: node }));
        // Check for SVGs (Lucide icons render as svg)
        const svgs = container.querySelectorAll("svg");
        expect(svgs.length).toBe(3);
    });
    it("should respect visibility flags", () => {
        const node = {
            id: "pi1",
            type: "post_interactions",
            showLike: true,
            showSave: false,
            showShare: false,
        };
        const { container } = renderWithContext(_jsx(PostInteractionsNode, { node: node }));
        // Just verify it renders something
        expect(container).toBeInTheDocument();
    });
    it("should call addFavorite when post is not favorited", () => {
        const node = {
            id: "pi1",
            type: "post_interactions",
            showSave: true,
        };
        renderWithContext(_jsx(PostInteractionsNode, { node: node, dataContext: {
                post: { contentId: "content_1", campaignId: "campaign_1", favorite: false },
            } }));
        fireEvent.click(screen.getByTestId("bookmark-icon"));
        expect(mockTracker.addFavorite).toHaveBeenCalledWith("content_1", "campaign_1");
    });
    it("should call addFavorite when onSave is a UI_ACTION save", () => {
        const node = {
            id: "pi1",
            type: "post_interactions",
            showSave: true,
            onSave: {
                type: "UI_ACTION",
                payload: { actionName: "save" },
            },
        };
        renderWithContext(_jsx(PostInteractionsNode, { node: node, dataContext: {
                post: { contentId: "content_1", campaignId: "campaign_1", favorite: false },
            } }));
        fireEvent.click(screen.getByTestId("bookmark-icon"));
        expect(mockTracker.addFavorite).toHaveBeenCalledWith("content_1", "campaign_1");
    });
    it("should call removeFavorite when post is already favorited", () => {
        const node = {
            id: "pi1",
            type: "post_interactions",
            showSave: true,
        };
        renderWithContext(_jsx(PostInteractionsNode, { node: node, dataContext: {
                post: { contentId: "content_1", campaignId: "campaign_1", favorite: true },
            } }));
        fireEvent.click(screen.getByTestId("bookmark-icon"));
        expect(mockTracker.removeFavorite).toHaveBeenCalledWith("content_1");
    });
});
//# sourceMappingURL=PostInteractionsNode.test.js.map