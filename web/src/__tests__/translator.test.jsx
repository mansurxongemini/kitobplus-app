import React from "react";
import { render, screen } from "@testing-library/react";
import T, { tr } from "../lib/translator";
import { LibraryProvider } from "../LibraryContext";

const Probe = () => <span>{T("Главная")}</span>;

describe("translator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("T inside a component returns the Uzbek translation by default", () => {
    render(
      <LibraryProvider>
        <Probe />
      </LibraryProvider>
    );
    expect(screen.getByText("Bosh sahifa")).toBeInTheDocument();
  });

  it("tr outside a component returns the translation for the stored language", () => {
    localStorage.setItem("country_code", "UZ");
    expect(tr("Главная")).toBe("Bosh sahifa");
  });

  it("unknown key falls back to the Russian text", () => {
    localStorage.setItem("country_code", "UZ");
    expect(tr("Такого ключа нет в словаре")).toBe("Такого ключа нет в словаре");
  });

  it("RU returns the key itself", () => {
    expect(tr("Главная", "RU")).toBe("Главная");
  });
});
