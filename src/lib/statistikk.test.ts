import { describe, expect, it } from "vitest";
import type { QuizSporsmal } from "@/content/types";
import {
  karakterestimat,
  omradeStatistikk,
  registrerISvarlogg,
  velgProveSporsmal,
  velgSvakeSporsmal,
  type Svarlogg,
} from "./statistikk";

function sporsmal(id: string, omrade: string): QuizSporsmal {
  return {
    id,
    omrade: omrade as QuizSporsmal["omrade"],
    kompetansemaal: [],
    type: "santusant",
    sporsmal: "?",
    riktig: true,
    forklaring: "",
    kilde: "",
    vanskelighetsgrad: 1,
  };
}

describe("registrerISvarlogg", () => {
  it("teller riktige og gale per spørsmål", () => {
    let logg: Svarlogg = {};
    logg = registrerISvarlogg(logg, "a", true);
    logg = registrerISvarlogg(logg, "a", false);
    logg = registrerISvarlogg(logg, "a", false);
    expect(logg.a).toEqual({ riktig: 1, galt: 2 });
  });
});

describe("omradeStatistikk", () => {
  it("beregner treffprosent per område", () => {
    const alle = [sporsmal("a", "teori"), sporsmal("b", "teori"), sporsmal("c", "maaling")];
    const logg: Svarlogg = {
      a: { riktig: 3, galt: 1 },
      b: { riktig: 1, galt: 0 },
      // c er aldri besvart
    };
    const stat = omradeStatistikk(alle, logg);
    const teori = stat.find((s) => s.omrade === "teori")!;
    expect(teori.besvart).toBe(5);
    expect(teori.prosent).toBe(80); // 4 av 5
    const maaling = stat.find((s) => s.omrade === "maaling")!;
    expect(maaling.prosent).toBeNull();
  });
});

describe("velgSvakeSporsmal", () => {
  it("velger høyest feilandel først og hopper over feilfrie", () => {
    const alle = [sporsmal("a", "teori"), sporsmal("b", "teori"), sporsmal("c", "teori")];
    const logg: Svarlogg = {
      a: { riktig: 3, galt: 1 }, // 25 % feil
      b: { riktig: 1, galt: 3 }, // 75 % feil
      c: { riktig: 5, galt: 0 }, // aldri feil – skal ikke med
    };
    const svake = velgSvakeSporsmal(alle, logg, 10);
    expect(svake.map((s) => s.id)).toEqual(["b", "a"]);
  });

  it("respekterer maks antall", () => {
    const alle = [sporsmal("a", "teori"), sporsmal("b", "teori")];
    const logg: Svarlogg = { a: { riktig: 0, galt: 1 }, b: { riktig: 0, galt: 1 } };
    expect(velgSvakeSporsmal(alle, logg, 1)).toHaveLength(1);
  });
});

describe("velgProveSporsmal", () => {
  it("sprer utvalget over områdene (rundgang)", () => {
    const alle = [
      sporsmal("t1", "teori"),
      sporsmal("t2", "teori"),
      sporsmal("t3", "teori"),
      sporsmal("m1", "maaling"),
      sporsmal("m2", "maaling"),
    ];
    const prove = velgProveSporsmal(alle, 4, () => 0.99);
    const omrader = prove.map((s) => s.omrade);
    expect(omrader.filter((o) => o === "teori").length).toBe(2);
    expect(omrader.filter((o) => o === "maaling").length).toBe(2);
  });

  it("gir aldri duplikater og stopper når banken er tom", () => {
    const alle = [sporsmal("a", "teori"), sporsmal("b", "maaling")];
    const prove = velgProveSporsmal(alle, 10, () => 0);
    expect(prove).toHaveLength(2);
    expect(new Set(prove.map((s) => s.id)).size).toBe(2);
  });
});

describe("karakterestimat", () => {
  it("følger grensene 85 og 60", () => {
    expect(karakterestimat(90)).toBe("Bestått meget godt");
    expect(karakterestimat(85)).toBe("Bestått meget godt");
    expect(karakterestimat(84)).toBe("Bestått");
    expect(karakterestimat(60)).toBe("Bestått");
    expect(karakterestimat(59)).toBe("Ikke bestått");
  });
});
