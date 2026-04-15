import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { ScrollableContainer } from "./ScrollableContainer.js";

describe("ScrollableContainer", () => {
  it("should render vertical scroll container by default", () => {
    const { container } = render(
      <ScrollableContainer>
        <div>Item</div>
      </ScrollableContainer>,
    );

    expect(container.firstChild).toHaveStyle({
      flexDirection: "column",
      overflowY: "auto",
    });
  });

  it("should render horizontal scroll container when requested", () => {
    const { container } = render(
      <ScrollableContainer orientation="horizontal">
        <div>Item</div>
      </ScrollableContainer>,
    );

    expect(container.firstChild).toHaveStyle({
      flexDirection: "row",
      overflowX: "auto",
    });
  });
});
