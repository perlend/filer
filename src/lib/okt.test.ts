import { describe, expect, it } from "vitest";
import type { QuizSporsmal } from "@/content/types";
import { nyttKort, vurderKort } from "./srs";
import { beregnNyStreak, datoNokkel, erNumeriskRiktig, velgSporsmalTilOkt } from "./okt";

const NAA = new Date("2026-06-11T12:00:00");

function sporsmal(id: string, vanskelighetsgrad: 1 | 2 | 3 = 1): QuizSporsmal {
  return {
    id,
    omrade: "teori",
    kompetansemaal: [],
    type: "santusant",
    sporsmal: "?",
    riktig: true,
    forklaring: "",
    kilde: "",
    vanskelighetsgrad,
  };
}

describe("beregnNyStreak", () => {
  it("første økt gir streak 1", () => {
    expect(beregnNyStreak(null, 0, NAA)).toBe(1);
  });

  it("ny økt samme dag endrer ikke streaken", () => {
    expect(beregnNyStreak("2026-06-11", 3, NAA)).toBe(3);
  });

  it("økt dagen etter øker streaken", () => {
    expect(beregnNyStreak("2026-06-10", 3, NAA)).toBe(4);
  });

  it("hoppet over en dag nullstiller til 1", () => {
    expect(beregnNyStreak("2026-06-08", 7, NAA)).toBe(1);
  });
});

describe("velgSporsmalTilOkt", () => {
  it("tar forfalte repetisjoner før nye spørsmål", () => {
    const alle = [sporsmal("a"), sporsmal("b"), sporsmal("c")];
    // "b" er besvart galt tidligere → forfaller etter 1 dag
    const igaar = new Date(NAA.getTime() - 2 * 24 * 60 * 60 * 1000);
    const kortB = vurderKort(nyttKort("b", igaar), false, igaar);

    const okt = velgSporsmalTilOkt(alle, { b: kortB }, 10, NAA);
    expect(okt[0].id).toBe("b");
    expect(okt.map((s) => s.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("nye spørsmål kommer i stigende vanskelighetsgrad", () => {
    const alle = [sporsmal("vanskelig", 3), sporsmal("lett", 1), sporsmal("middels", 2)];
    const okt = velgSporsmalTilOkt(alle, {}, 10, NAA);
    expect(okt.map((s) => s.id)).toEqual(["lett", "middels", "vanskelig"]);
  });

  it("respekterer maks antall", () => {
    const alle = Array.from({ length: 20 }, (_, n) => sporsmal(`q${n}`));
    expect(velgSporsmalTilOkt(alle, {}, 10, NAA)).toHaveLength(10);
  });

  it("kort som ikke har forfalt tas ikke med", () => {
    const alle = [sporsmal("a")];
    const kortA = vurderKort(nyttKort("a", NAA), true, NAA); // forfaller om 1 dag
    expect(velgSporsmalTilOkt(alle, { a: kortA }, 10, NAA)).toHaveLength(0);
  });
});

describe("erNumeriskRiktig", () => {
  it("godtar svar innenfor toleransen", () => {
    expect(erNumeriskRiktig(8.7, 8.7, 0.1)).toBe(true);
    expect(erNumeriskRiktig(8.61, 8.7, 0.1)).toBe(true);
    expect(erNumeriskRiktig(8.5, 8.7, 0.1)).toBe(false);
    expect(erNumeriskRiktig(NaN, 8.7, 0.1)).toBe(false);
  });
});

describe("datoNokkel", () => {
  it("formaterer som YYYY-MM-DD med nuller", () => {
    expect(datoNokkel(new Date("2026-06-01T08:00:00"))).toBe("2026-06-01");
  });
});
