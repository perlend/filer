import { describe, expect, it } from "vitest";
import { stokkAlternativer, stokkSantUsant } from "./stokking";
import type { FlervalgSporsmal } from "@/content/types";

function lagSporsmal(alternativer: string[]): FlervalgSporsmal {
  return {
    id: "q1",
    omrade: "teori",
    kompetansemaal: [],
    sporsmal: "Test?",
    forklaring: "",
    kilde: "",
    vanskelighetsgrad: 1,
    type: "flervalg",
    alternativer,
    riktig: 0,
  };
}

/** Deterministisk pseudo-tilfeldig generator (mulberry32) for testbarhet. */
function lagRng(seed: number): () => number {
  let tilstand = seed >>> 0;
  return () => {
    tilstand |= 0;
    tilstand = (tilstand + 0x6d2b79f5) | 0;
    let t = Math.imul(tilstand ^ (tilstand >>> 15), 1 | tilstand);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("stokkAlternativer", () => {
  it("riktigIndeks peker alltid på det opprinnelige riktige alternativet (flere seeds)", () => {
    const sporsmal = lagSporsmal(["A-riktig", "B", "C", "D"]);
    for (let seed = 0; seed < 50; seed++) {
      const { alternativer, riktigIndeks } = stokkAlternativer(sporsmal, lagRng(seed));
      expect(alternativer[riktigIndeks]).toBe("A-riktig");
    }
  });

  it("bevarer alle alternativer uten duplikater eller tap", () => {
    const opprinnelige = ["A-riktig", "B", "C", "D"];
    const sporsmal = lagSporsmal(opprinnelige);
    for (let seed = 0; seed < 50; seed++) {
      const { alternativer } = stokkAlternativer(sporsmal, lagRng(seed));
      expect(alternativer).toHaveLength(opprinnelige.length);
      expect([...alternativer].sort()).toEqual([...opprinnelige].sort());
    }
  });

  it("gir deterministisk resultat for samme rng", () => {
    const sporsmal = lagSporsmal(["A-riktig", "B", "C", "D"]);
    const a = stokkAlternativer(sporsmal, lagRng(7));
    const b = stokkAlternativer(sporsmal, lagRng(7));
    expect(a).toEqual(b);
  });

  it("endrer faktisk rekkefølgen for minst én seed", () => {
    const sporsmal = lagSporsmal(["A-riktig", "B", "C", "D"]);
    const stokket = Array.from({ length: 50 }, (_, seed) =>
      stokkAlternativer(sporsmal, lagRng(seed)).riktigIndeks
    );
    // Med 4 alternativer skal det riktige havne på flere ulike posisjoner.
    expect(new Set(stokket).size).toBeGreaterThan(1);
  });
});

describe("stokkSantUsant", () => {
  it("gir [true, false] når rng < 0,5", () => {
    expect(stokkSantUsant(() => 0)).toEqual([true, false]);
  });

  it("gir [false, true] når rng >= 0,5", () => {
    expect(stokkSantUsant(() => 0.9)).toEqual([false, true]);
  });

  it("produserer begge rekkefølger over flere seeds", () => {
    const resultater = Array.from({ length: 50 }, (_, seed) => {
      const rng = lagRng(seed);
      return stokkSantUsant(rng)[0];
    });
    expect(resultater).toContain(true);
    expect(resultater).toContain(false);
  });
});
