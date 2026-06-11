import { describe, expect, it } from "vitest";
import { erGyldigElnummer, formaterElnummer } from "./elnummer";

describe("erGyldigElnummer", () => {
  it("godtar nøyaktig 7 siffer", () => {
    expect(erGyldigElnummer("1234567")).toBe(true);
    expect(erGyldigElnummer(" 1234567 ")).toBe(true);
  });

  it("avviser feil lengde og ikke-siffer", () => {
    expect(erGyldigElnummer("123456")).toBe(false);
    expect(erGyldigElnummer("12345678")).toBe(false);
    expect(erGyldigElnummer("12a4567")).toBe(false);
    expect(erGyldigElnummer("")).toBe(false);
  });
});

describe("formaterElnummer", () => {
  it("formaterer som «12 345 67»", () => {
    expect(formaterElnummer("1234567")).toBe("12 345 67");
  });

  it("lar ugyldige verdier stå urørt", () => {
    expect(formaterElnummer("abc")).toBe("abc");
  });
});
