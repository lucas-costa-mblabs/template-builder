import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RemoteTemplateProvider } from "./RemoteTemplateProvider.js";
import { useTemplateContext } from "./context.js";
import { clearRemoteBootstrapCache } from "./bootstrap.js";
function Consumer() {
    const { theme, templates } = useTemplateContext();
    return (_jsxs("div", { children: [_jsx("span", { children: theme.colors.primary }), _jsx("span", { children: templates[0]?.name })] }));
}
describe("RemoteTemplateProvider", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        clearRemoteBootstrapCache();
    });
    it("should fetch theme and templates and render children", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: { colors: { primary: "#0D63D6" }, spacing: {}, borderRadius: {}, typography: {} },
            }),
        })
            .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [
                    {
                        templateId: "tpl_1",
                        name: "Template remoto",
                        active: true,
                        slug: "template-remoto",
                        data: [],
                    },
                ],
            }),
        });
        vi.stubGlobal("fetch", fetchMock);
        render(_jsx(RemoteTemplateProvider, { config: {
                accountId: "acc_1",
                apiKey: "api_key",
                baseUrl: "https://api.dev-directoai.com.br",
            }, loadingFallback: _jsx("span", { children: "loading" }), children: _jsx(Consumer, {}) }));
        expect(screen.getByText("loading")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("#0D63D6")).toBeInTheDocument();
            expect(screen.getByText("Template remoto")).toBeInTheDocument();
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[0]?.[0]).toContain("/account/api/v1/theme/account/acc_1");
        expect(fetchMock.mock.calls[1]?.[0]).toContain("/template/api/v1/templates/account/acc_1");
    });
});
//# sourceMappingURL=RemoteTemplateProvider.test.js.map