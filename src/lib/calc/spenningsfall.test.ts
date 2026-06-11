import { describe, expect, it } from "vitest";
import { beregnSpenningsfall } from "./spenningsfall";

describe("beregnSpenningsfall", () => {
  // Håndregnet enfase: ΔU = 2·0,0175·30·16/2,5 = 6,72 V → 6,72/230 = 2,92 %
  it("enfase 230 V, 30 m, 16 A, 2,5 mm² gir 6,72 V (2,92 %)", () => {
    const res = beregnSpenningsfall({
      lengdeM: 30,
      stromA: 16,
      tverrsnittMm2: 2.5,
      spenningV: 230,
      fase: "enfase",
    });
    expect(res.fallV).toBeCloseTo(6.72, 2);
    expect(res.fallProsent).toBeCloseTo(2.922, 2);
    expect(res.innenforAnbefaling).toBe(true);
  });

  // Håndregnet trefase: ΔU = √3·0,0175·30·16/2,5 = √3·8,4/2,5... = 5,82 V
  // (0,0175·30·16/2,5 = 3,36; 3,36·1,7321 = 5,8197)
  it("trefase 400 V, 30 m, 16 A, 2,5 mm² gir 5,82 V", () => {
    const res = beregnSpenningsfall({
      lengdeM: 30,
      stromA: 16,
      tverrsnittMm2: 2.5,
      spenningV: 400,
      fase: "trefase",
    });
    expect(res.fallV).toBeCloseTo(5.8197, 3);
    expect(res.fallProsent).toBeCloseTo(1.455, 2);
    expect(res.innenforAnbefaling).toBe(true);
  });

  // Håndregnet: 80 m, 20 A, 2,5 mm² enfase → 2·0,0175·80·20/2,5 = 22,4 V = 9,74 % > 4 %
  it("lang kabel gir fall over anbefalingen på 4 %", () => {
    const res = beregnSpenningsfall({
      lengdeM: 80,
      stromA: 20,
      tverrsnittMm2: 2.5,
      spenningV: 230,
      fase: "enfase",
    });
    expect(res.fallV).toBeCloseTo(22.4, 1);
    expect(res.innenforAnbefaling).toBe(false);
  });

  it("kaster feil ved ugyldige verdier", () => {
    const gyldig = {
      lengdeM: 30,
      stromA: 16,
      tverrsnittMm2: 2.5,
      spenningV: 230,
      fase: "enfase" as const,
    };
    expect(() => beregnSpenningsfall({ ...gyldig, lengdeM: 0 })).toThrow(/Lengden/);
    expect(() => beregnSpenningsfall({ ...gyldig, stromA: -1 })).toThrow(/Strømmen/);
    expect(() => beregnSpenningsfall({ ...gyldig, tverrsnittMm2: 0 })).toThrow(/Tverrsnittet/);
    expect(() => beregnSpenningsfall({ ...gyldig, spenningV: NaN })).toThrow(/Spenningen/);
  });
});
