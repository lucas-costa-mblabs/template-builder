import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, } from "@testing-library/react";
import { TemplateProvider } from "./TemplateProvider.js";
import { useRemoteFeed } from "./hooks/useRemoteFeed.js";
import { clearRemoteFeedCache } from "./remoteFeed.js";
const mockConfig = {
    accountId: "acc_1",
    apiKey: "api_key",
    customerId: "customer_1",
    baseUrl: "https://api.dev-directoai.com.br",
};
const mockTheme = {
    colors: { primary: "#0D63D6" },
    spacing: {},
    borderRadius: {},
    typography: {},
};
function FeedConsumer({ label = "default" }) {
    const { posts, isLoading, error, reload } = useRemoteFeed();
    return (_jsxs("div", { children: [_jsx("span", { children: label }), _jsx("span", { children: isLoading ? "loading" : "loaded" }), _jsx("span", { children: posts[0]?.title || "empty" }), _jsx("span", { children: error?.message || "no-error" }), _jsx("button", { type: "button", onClick: reload, children: "reload" })] }));
}
describe("useRemoteFeed", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        clearRemoteFeedCache();
    });
    it("should fetch posts using the provider config", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    feeds: [
                        {
                            contentId: "content_1",
                            title: "Post remoto",
                            templateId: "tpl_1",
                            url: "https://example.com/post.jpg",
                        },
                    ],
                },
            }),
        });
        vi.stubGlobal("fetch", fetchMock);
        render(_jsx(TemplateProvider, { theme: mockTheme, config: mockConfig, children: _jsx(FeedConsumer, {}) }));
        expect(screen.getByText("loading")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("loaded")).toBeInTheDocument();
            expect(screen.getByText("Post remoto")).toBeInTheDocument();
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
        expect(requestUrl.pathname).toBe("/campaign/api/v1/feed");
        expect(requestUrl.searchParams.get("customer")).toBe("customer_1");
        expect(requestUrl.searchParams.get("accountId")).toBe("acc_1");
        expect(requestUrl.searchParams.get("apiKey")).toBe("api_key");
    });
    it("should reuse the cached request for concurrent consumers", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    feeds: [
                        {
                            contentId: "content_1",
                            title: "Post compartilhado",
                            templateId: "tpl_1",
                            url: "https://example.com/post.jpg",
                        },
                    ],
                },
            }),
        });
        vi.stubGlobal("fetch", fetchMock);
        render(_jsx(TemplateProvider, { theme: mockTheme, config: mockConfig, children: _jsxs(_Fragment, { children: [_jsx(FeedConsumer, { label: "first" }), _jsx(FeedConsumer, { label: "second" })] }) }));
        await waitFor(() => {
            expect(screen.getAllByText("Post compartilhado")).toHaveLength(2);
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("should reload after a failed request", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({
            ok: false,
            status: 500,
        })
            .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    feeds: [
                        {
                            contentId: "content_2",
                            title: "Post recarregado",
                            templateId: "tpl_2",
                            url: "https://example.com/post-2.jpg",
                        },
                    ],
                },
            }),
        });
        vi.stubGlobal("fetch", fetchMock);
        render(_jsx(TemplateProvider, { theme: mockTheme, config: mockConfig, children: _jsx(FeedConsumer, {}) }));
        await waitFor(() => {
            expect(screen.getByText("Failed to fetch remote feed: 500")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: "reload" }));
        await waitFor(() => {
            expect(screen.getByText("Post recarregado")).toBeInTheDocument();
            expect(screen.getByText("no-error")).toBeInTheDocument();
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
//# sourceMappingURL=useRemoteFeed.test.js.map