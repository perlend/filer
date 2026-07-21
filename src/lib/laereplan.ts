import type { QuizSporsmal } from "@/content/types";
import {
  KOMPETANSEMAAL,
  normaliserKompetansemaal,
  type Kompetansemaal,
  type KompetansemaalId,
} from "@/content/kompetansemaal";
import type { SrsKort } from "./srs";
import type { Svarlogg } from "./statistikk";

/**
 * Progresjon mot læreplanen: hvor mange kompetansemål lærlingen har vært
 * innom og mestret. «Mestret» følger repetisjonsmotoren – et spørsmål regnes
 * som sittende når SM-2-kortet har klart minst to repetisjoner på rad
 * (intervallet er da oppe i 6+ dager), ikke bare fordi det er sett én gang.
 */

export const MESTRING_REPETISJONER = 2;

export type MaalStatus = "urort" | "pabegynt" | "mestret";

export interface MaalProgresjon extends Kompetansemaal {
  /** Antall spørsmål som er knyttet til målet */
  antall: number;
  /** Hvor mange av dem som er besvart minst én gang */
  besvart: number;
  /** Hvor mange som er mestret (SM-2-kortet har «satt seg») */
  mestret: number;
  /** 0–1: andel av spørsmålene som er mestret */
  mestringsandel: number;
  status: MaalStatus;
}

export interface LaereplanSammendrag {
  /** Antall kompetansemål det finnes innhold til */
  maalMedInnhold: number;
  /** Mål som er påbegynt (minst ett spørsmål besvart) */
  paabegynte: number;
  /** Mål som er fullt mestret */
  mestrede: number;
}

/** Om et SM-2-kort regnes som mestret. */
export function erMestret(kort: SrsKort | undefined): boolean {
  return kort !== undefined && kort.repetisjoner >= MESTRING_REPETISJONER;
}

function status(besvart: number, mestret: number, antall: number): MaalStatus {
  if (besvart === 0) return "urort";
  if (antall > 0 && mestret === antall) return "mestret";
  return "pabegynt";
}

/**
 * Regner ut progresjon per kompetansemål. Et spørsmål teller for alle målene
 * det er merket med. Mål uten innhold tas med (antall = 0) slik at det synes
 * hvor det mangler spørsmål.
 */
export function laereplanProgresjon(
  alle: QuizSporsmal[],
  srsKort: Record<string, SrsKort>,
  svarlogg: Svarlogg
): MaalProgresjon[] {
  // Bygg opp hvilke spørsmåls-ID-er som hører til hvert mål.
  const iderPerMaal = new Map<KompetansemaalId, string[]>();
  for (const maal of KOMPETANSEMAAL) iderPerMaal.set(maal.id, []);

  for (const sporsmal of alle) {
    const maalForSporsmal = new Set<KompetansemaalId>();
    for (const streng of sporsmal.kompetansemaal) {
      const id = normaliserKompetansemaal(streng);
      if (id) maalForSporsmal.add(id);
    }
    for (const id of maalForSporsmal) {
      iderPerMaal.get(id)?.push(sporsmal.id);
    }
  }

  return KOMPETANSEMAAL.map((maal) => {
    const ider = iderPerMaal.get(maal.id) ?? [];
    let besvart = 0;
    let mestret = 0;
    for (const id of ider) {
      const svar = svarlogg[id];
      if (svar && svar.riktig + svar.galt > 0) besvart++;
      if (erMestret(srsKort[id])) mestret++;
    }
    return {
      ...maal,
      antall: ider.length,
      besvart,
      mestret,
      mestringsandel: ider.length > 0 ? mestret / ider.length : 0,
      status: status(besvart, mestret, ider.length),
    };
  });
}

export function laereplanSammendrag(progresjon: MaalProgresjon[]): LaereplanSammendrag {
  const medInnhold = progresjon.filter((p) => p.antall > 0);
  return {
    maalMedInnhold: medInnhold.length,
    paabegynte: medInnhold.filter((p) => p.status !== "urort").length,
    mestrede: medInnhold.filter((p) => p.status === "mestret").length,
  };
}
