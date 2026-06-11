import { describe, expect, it } from "vitest";
import { minsteTverrsnitt } from "./kabel";

describe("minsteTverrsnitt", () => {
  // 16 A-kurs uten korreksjon: 1,5 mm² tåler 17,5 A ≥ 16 A
  it("16 A uten korreksjon gir 1,5 mm²", () => {
    const res = minsteTverrsnitt({ stromA: 16 });
    expect(res.tverrsnittMm2).toBe(1.5);
    expect(res.korrigertKapasitetA).toBeCloseTo(17.5);
  });

  // 20 A uten korreksjon: 1,5 mm² (17,5 A) holder ikke, 2,5 mm² (24 A) holder
  it("20 A uten korreksjon gir 2,5 mm²", () => {
    expect(minsteTverrsnitt({ stromA: 20 }).tverrsnittMm2).toBe(2.5);
  });

  // Håndregnet med korreksjon 0,8: 2,5 mm² → 24·0,8 = 19,2 A < 20 A,
  // 4 mm² → 32·0,8 = 25,6 A ≥ 20 A
  it("20 A med korreksjonsfaktor 0,8 gir 4 mm²", () => {
    const res = minsteTverrsnitt({ stromA: 20, korreksjonsfaktor: 0.8 });
    expect(res.tverrsnittMm2).toBe(4);
    expect(res.korrigertKapasitetA).toBeCloseTo(25.6);
  });

  // Grensetilfelle: nøyaktig lik kapasitet skal godtas (17,5 A på 1,5 mm²)
  it("strøm nøyaktig lik kapasiteten godtas", () => {
    expect(minsteTverrsnitt({ stromA: 17.5 }).tverrsnittMm2).toBe(1.5);
  });

  it("kaster feil når strømmen overstiger tabellen", () => {
    expect(() => minsteTverrsnitt({ stromA: 150 })).toThrow(/NEK 400/);
  });

  it("kaster feil ved ugyldig input", () => {
    expect(() => minsteTverrsnitt({ stromA: 0 })).toThrow(/positivt/);
    expect(() => minsteTverrsnitt({ stromA: 16, korreksjonsfaktor: 0 })).toThrow(
      /Korreksjonsfaktoren/
    );
    expect(() => minsteTverrsnitt({ stromA: 16, korreksjonsfaktor: 1.2 })).toThrow(
      /Korreksjonsfaktoren/
    );
  });
});
