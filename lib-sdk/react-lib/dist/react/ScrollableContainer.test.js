import { jsx as _jsx } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ScrollableContainer } from "./ScrollableContainer.js";
describe("ScrollableContainer", () => {
    it("should render vertical scroll container by default", () => {
        const { container } = render(_jsx(ScrollableContainer, { children: _jsx("div", { children: "Item" }) }));
        expect(container.firstChild).toHaveStyle({
            flexDirection: "column",
            overflowY: "auto",
        });
    });
    it("should render horizontal scroll container when requested", () => {
        const { container } = render(_jsx(ScrollableContainer, { orientation: "horizontal", children: _jsx("div", { children: "Item" }) }));
        expect(container.firstChild).toHaveStyle({
            flexDirection: "row",
            overflowX: "auto",
        });
    });
});
//# sourceMappingURL=ScrollableContainer.test.js.map