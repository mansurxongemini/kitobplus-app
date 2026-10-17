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

  it("translates modern keys with explicit RU translations in Russian locale", () => {
    expect(tr("hero_description", "RU")).toContain("Узбекская и мировая литература");
    expect(tr("10 soniya tinglab ko'ring", "RU")).toBe("Послушать 10 секунд");
    expect(tr("HAR BIR INSON UCHUN KITOB", "RU")).toBe("КНИГА ДЛЯ КАЖДОГО ЧЕЛОВЕКА");
  });

  it("translates language name Русский correctly into Uzbek and English", () => {
    expect(tr("Русский", "UZ")).toBe("Ruscha");
    expect(tr("Русский", "US")).toBe("Russian");
    expect(tr("Русский", "RU")).toBe("Русский");
  });

  it("resolves HomePage accessibility feature descriptions", () => {
    expect(tr("NVDA, JAWS, TalkBack va VoiceOver uchun tushunarli nomlar, sarlavhalar va ovozli xabarlar.", "RU"))
      .toBe("Понятные подписи, заголовки и объявления для NVDA, JAWS, TalkBack и VoiceOver.");
    expect(tr("Bo'sh joy — pauza, strelkalar — 30 soniya orqaga va oldinga, Shift va strelkalar — tezlik.", "RU"))
      .toBe("Пробел — пауза, стрелки — 30 секунд назад и вперёд, Shift и стрелки — скорость.");
    expect(tr("Quloqchin va qulflangan ekrandan pauza va o'tkazish.", "RU"))
      .toBe("Пауза и перемотка с наушников и экрана блокировки.");
  });

  it("translates ming number abbreviation across locales", () => {
    expect(tr("ming", "UZ")).toBe("ming");
    expect(tr("ming", "RU")).toBe("тыс.");
    expect(tr("ming", "US")).toBe("k");
  });
});
