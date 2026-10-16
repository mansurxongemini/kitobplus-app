import React from "react";
import { render, screen } from "@testing-library/react";
import { useFormatDuration } from "../ds/format";
import { LibraryProvider } from "../LibraryContext";

const Probe = ({ seconds }) => {
  const fmt = useFormatDuration();
  return <span>{fmt(seconds)}</span>;
};

describe("useFormatDuration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("formats hours and minutes in Uzbek by default", () => {
    render(
      <LibraryProvider>
        <Probe seconds={10 * 3600 + 20 * 60} />
      </LibraryProvider>
    );
    expect(screen.getByText("10 soat 20 daqiqa")).toBeInTheDocument();
  });

  it("formats minutes only", () => {
    render(
      <LibraryProvider>
        <Probe seconds={45 * 60} />
      </LibraryProvider>
    );
    expect(screen.getByText("45 daqiqa")).toBeInTheDocument();
  });

  it("returns empty string for zero duration", () => {
    const { container } = render(
      <LibraryProvider>
        <Probe seconds={0} />
      </LibraryProvider>
    );
    expect(container.querySelector("span").textContent).toBe("");
  });
});
