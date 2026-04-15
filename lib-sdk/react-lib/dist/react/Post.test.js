import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Post } from "./Post.js";
import { TemplateContext } from "./context.js";
vi.mock("./utils.js", async () => {
    const actual = await vi.importActual("./utils.js");
    return {
        ...actual,
        injectTailwind: vi.fn().mockResolvedValue(undefined),
    };
});
vi.mock("./hooks/useImpressionObserver.js", () => ({
    useImpressionObserver: ({ contentId, tracker, data }) => {
        // Simula a chamada imediata para verificar se o contentId está correto
        tracker.trackImpression(contentId, data);
        return { elementRef: { current: null }, isIntersecting: true };
    },
}));
const mockTheme = {
    colors: { primary: "#FF0000" },
    spacing: {},
    borderRadius: {},
    typography: {},
};
const mockTracker = {
    trackEvent: vi.fn(),
    trackImpression: vi.fn(),
    trackViewTime: vi.fn(),
};
const renderPost = (post, templates = []) => {
    return render(_jsx(TemplateContext.Provider, { value: {
            theme: mockTheme,
            templates,
            tracker: mockTracker,
        }, children: _jsx(Post, { post: post }) }));
};
describe("Post Component", () => {
    it("should render template if found", () => {
        const templates = [
            {
                templateId: "t1",
                data: [{ id: "n1", type: "text", value: "Template Node" }],
            },
        ];
        const post = { id: "p1", templateId: "t1" };
        renderPost(post, templates);
        expect(screen.getByText("Template Node")).toBeInTheDocument();
    });
    it("should prefer structured template over legacy html when both exist", () => {
        const templates = [
            {
                templateId: "t1",
                data: [{ id: "n1", type: "text", value: "Structured Template" }],
            },
        ];
        const post = {
            id: "p1",
            templateId: "t1",
            template: "<div>Legacy HTML</div>",
        };
        renderPost(post, templates);
        expect(screen.getByText("Structured Template")).toBeInTheDocument();
        expect(screen.queryByText("Legacy HTML")).not.toBeInTheDocument();
    });
    it("should fallback to dangerouslySetInnerHTML if template not found but post.template exists", async () => {
        const post = {
            id: "p1",
            templateId: "missing",
            template: "<div data-testid='custom-html'>Custom HTML Content</div>",
        };
        renderPost(post, []);
        expect(await screen.findByText("Custom HTML Content")).toBeInTheDocument();
    });
    it("should show 'Template não encontrado' message if both template and fallback are missing", () => {
        const post = { id: "p1", templateId: "missing" };
        renderPost(post, []);
        expect(screen.getByText(/Template não encontrado: missing/)).toBeInTheDocument();
    });
    it("should handle contentId if id is missing", () => {
        const post = {
            contentId: "c1",
            templateId: "missing",
            template: "<div>HTML fallback</div>",
        };
        renderPost(post, []);
        // contentId should be passed to useImpressionObserver
        expect(mockTracker.trackImpression).toHaveBeenCalledWith("c1", expect.any(Object));
    });
});
//# sourceMappingURL=Post.test.js.map