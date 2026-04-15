import type { CSSProperties, ReactNode } from "react";

export interface ScrollableContainerProps {
  children: ReactNode;
  orientation?: "vertical" | "horizontal";
  style?: CSSProperties;
}

export function ScrollableContainer({
  children,
  orientation = "vertical",
  style,
}: ScrollableContainerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        overflowX: isHorizontal ? "auto" : "hidden",
        overflowY: isHorizontal ? "hidden" : "auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
