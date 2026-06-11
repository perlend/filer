import { describe, expect, it } from "vitest";
import { forfalteKort, nyttKort, vurderKort, MIN_LETTFAKTOR } from "./srs";

const NAA = new Date("2026-06-11T12:00:00Z");
const DAG_MS = 24 * 60 * 60 * 1000;

function dagerTil(iso: string): number {
  return Math.round((new Date(iso).getTime() - NAA.getTime()) / DAG_MS);
}

describe("vurderKort", () => {
  it("følger SM-2-intervallene 1, 6, round(6·EF) ved riktige svar", () => {
    let kort = nyttKort("q1", NAA);

    kort = vurderKort(kort, true, NAA);
    expect(kort.intervallDager).toBe(1);
    expect(dagerTil(kort.neste)).toBe(1);

    kort = vurderKort(kort, true, NAA);
    expect(kort.intervallDager).toBe(6);

    // Etter to riktige (kvalitet 4) er EF = 2,5 - 2·0 ... håndregnet:
    // EF etter q=4: 2,5 + (0,1 - 1·(0,08+0,02)) = 2,5. Tredje: round(6·2,5) = 15
    kort = vurderKort(kort, true, NAA);
    expect(kort.intervallDager).toBe(15);
    expect(kort.repetisjoner).toBe(3);
  });

  it("galt svar nullstiller intervallrekken og senker lettfaktoren", () => {
    let kort = nyttKort("q1", NAA);
    kort = vurderKort(kort, true, NAA);
    kort = vurderKort(kort, true, NAA);

    const forLettfaktor = kort.lettfaktor;
    kort = vurderKort(kort, false, NAA);
    expect(kort.repetisjoner).toBe(0);
    expect(kort.intervallDager).toBe(1);
    // Håndregnet for q=2: EF' = EF + (0,1 - 3·(0,08 + 3·0,02)) = EF - 0,32
    expect(kort.lettfaktor).toBeCloseTo(forLettfaktor - 0.32, 5);
  });

  it("lettfaktoren går aldri under 1,3", () => {
    let kort = nyttKort("q1", NAA);
    for (let n = 0; n < 10; n++) {
      kort = vurderKort(kort, false, NAA);
    }
    expect(kort.lettfaktor).toBe(MIN_LETTFAKTOR);
  });
});

describe("forfalteKort", () => {
  it("returnerer bare kort der neste-tidspunktet er passert", () => {
    const forfalt = { ...nyttKort("a", NAA), neste: new Date(NAA.getTime() - DAG_MS).toISOString() };
    const fremtidig = { ...nyttKort("b", NAA), neste: new Date(NAA.getTime() + DAG_MS).toISOString() };
    const naaKort = nyttKort("c", NAA);

    const res = forfalteKort([forfalt, fremtidig, naaKort], NAA);
    expect(res.map((k) => k.sporsmalId)).toEqual(["a", "c"]);
  });
});
