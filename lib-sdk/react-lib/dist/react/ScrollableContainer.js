import { jsx as _jsx } from "react/jsx-runtime";
export function ScrollableContainer({ children, orientation = "vertical", style, }) {
    const isHorizontal = orientation === "horizontal";
    return (_jsx("div", { style: {
            width: "100%",
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
            overflowX: isHorizontal ? "auto" : "hidden",
            overflowY: isHorizontal ? "hidden" : "auto",
            ...style,
        }, children: children }));
}
//# sourceMappingURL=ScrollableContainer.js.map