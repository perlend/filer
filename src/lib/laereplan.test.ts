import { describe, expect, it } from "vitest";
import type { QuizSporsmal } from "@/content/types";
import { ALLE_LEKSJONER, ALLE_SPORSMAL } from "@/content";
import { normaliserKompetansemaal } from "@/content/kompetansemaal";
import type { SrsKort } from "./srs";
import type { Svarlogg } from "./statistikk";
import {
  erMestret,
  laereplanProgresjon,
  laereplanSammendrag,
  MESTRING_REPETISJONER,
} from "./laereplan";

function sporsmal(id: string, kompetansemaal: string[]): QuizSporsmal {
  return {
    id,
    omrade: "elsikkerhet",
    kompetansemaal,
    type: "santusant",
    sporsmal: "?",
    riktig: true,
    forklaring: "",
    kilde: "",
    vanskelighetsgrad: 1,
  };
}

function kort(id: string, repetisjoner: number): SrsKort {
  return { sporsmalId: id, repetisjoner, lettfaktor: 2.5, intervallDager: 6, neste: "2026-01-01" };
}

const FORSTEHJELP = "gi livreddende førstehjelp";
const SIKKERT = "arbeide med hensyn til sikkerhet ved arbeid i og drift av elektriske anlegg";
const FORDELING_A = "installere og sette i drift ulike fordelingssystemer";
const FORDELING_B = "bygge og koble fordelinger";

function maal(progresjon: ReturnType<typeof laereplanProgresjon>, id: string) {
  const m = progresjon.find((p) => p.id === id);
  if (!m) throw new Error(`fant ikke mål ${id}`);
  return m;
}

describe("erMestret", () => {
  it("krever minst to repetisjoner", () => {
    expect(erMestret(undefined)).toBe(false);
    expect(erMestret(kort("a", MESTRING_REPETISJONER - 1))).toBe(false);
    expect(erMestret(kort("a", MESTRING_REPETISJONER))).toBe(true);
  });
});

describe("laereplanProgresjon", () => {
  it("teller besvarte og mestrede spørsmål per mål", () => {
    const alle = [
      sporsmal("f1", [FORSTEHJELP]),
      sporsmal("f2", [FORSTEHJELP]),
      sporsmal("d1", [FORDELING_A]), // annet mål (k05)
    ];
    const srs = { f1: kort("f1", 3) }; // f1 mestret, f2 ikke
    const logg: Svarlogg = {
      f1: { riktig: 3, galt: 0 },
      f2: { riktig: 0, galt: 2 }, // besvart, men bommet
    };

    const p = laereplanProgresjon(alle, srs, logg);
    const k03 = maal(p, "k03");
    expect(k03.antall).toBe(2);
    expect(k03.besvart).toBe(2);
    expect(k03.mestret).toBe(1);
    expect(k03.mestringsandel).toBeCloseTo(0.5);
    expect(k03.status).toBe("pabegynt");
  });

  it("markerer et mål som mestret først når alle spørsmålene sitter", () => {
    const alle = [sporsmal("f1", [FORSTEHJELP]), sporsmal("f2", [FORSTEHJELP])];
    const logg: Svarlogg = { f1: { riktig: 1, galt: 0 }, f2: { riktig: 1, galt: 0 } };

    const delvis = laereplanProgresjon(alle, { f1: kort("f1", 4) }, logg);
    expect(maal(delvis, "k03").status).toBe("pabegynt");

    const helt = laereplanProgresjon(alle, { f1: kort("f1", 4), f2: kort("f2", 2) }, logg);
    expect(maal(helt, "k03").status).toBe("mestret");
  });

  it("mål uten besvarte spørsmål er urørt", () => {
    const p = laereplanProgresjon([sporsmal("f1", [FORSTEHJELP])], {}, {});
    expect(maal(p, "k03").status).toBe("urort");
    expect(maal(p, "k03").besvart).toBe(0);
  });

  it("teller et spørsmål med to varianter av samme mål bare én gang", () => {
    const alle = [sporsmal("x", [FORDELING_A, FORDELING_B])];
    const p = laereplanProgresjon(alle, {}, {});
    expect(maal(p, "k05").antall).toBe(1);
  });

  it("tar med alle ti målene, også de uten innhold", () => {
    const p = laereplanProgresjon([], {}, {});
    expect(p).toHaveLength(10);
    expect(p.every((m) => m.antall === 0 && m.status === "urort")).toBe(true);
  });
});

describe("laereplanSammendrag", () => {
  it("teller mål med innhold, påbegynte og mestrede", () => {
    const alle = [
      sporsmal("f1", [FORSTEHJELP]), // k03 – mestres
      sporsmal("s1", [SIKKERT]), // k03 – ikke mestret → k03 blir påbegynt
      sporsmal("d1", [FORDELING_A]), // k05 – urørt
    ];
    const srs = { f1: kort("f1", 3) };
    const logg: Svarlogg = { f1: { riktig: 3, galt: 0 }, s1: { riktig: 1, galt: 1 } };

    const s = laereplanSammendrag(laereplanProgresjon(alle, srs, logg));
    expect(s.maalMedInnhold).toBe(2); // k03 og k05
    expect(s.paabegynte).toBe(1); // k03
    expect(s.mestrede).toBe(0); // k03 ikke fullt mestret (s1 gjenstår)
  });
});

describe("alt faginnhold peker på kjente kompetansemål", () => {
  it("hvert kompetansemål i spørsmålene kan normaliseres", () => {
    const ukjente = new Set<string>();
    for (const s of ALLE_SPORSMAL) {
      for (const streng of s.kompetansemaal) {
        if (normaliserKompetansemaal(streng) === null) ukjente.add(`${s.id}: «${streng}»`);
      }
    }
    expect([...ukjente]).toEqual([]);
  });

  it("hvert kompetansemål i leksjonene kan normaliseres", () => {
    const ukjente = new Set<string>();
    for (const l of ALLE_LEKSJONER) {
      for (const streng of l.kompetansemaal) {
        if (normaliserKompetansemaal(streng) === null) ukjente.add(`${l.id}: «${streng}»`);
      }
    }
    expect([...ukjente]).toEqual([]);
  });
});
