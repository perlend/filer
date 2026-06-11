import type { QuizSporsmal } from "@/content/types";
import { forfalteKort, type SrsKort } from "./srs";

/** Dato som YYYY-MM-DD i lokal tid. */
export function datoNokkel(d: Date): string {
  const mnd = String(d.getMonth() + 1).padStart(2, "0");
  const dag = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mnd}-${dag}`;
}

/**
 * Ny streak-verdi etter en fullført økt: samme dag = uendret,
 * dagen etter = +1, ellers tilbake til 1.
 */
export function beregnNyStreak(
  forrigeOktDato: string | null,
  streak: number,
  naa: Date
): number {
  if (forrigeOktDato === null) return 1;
  if (forrigeOktDato === datoNokkel(naa)) return Math.max(streak, 1);
  const igaar = new Date(naa.getTime() - 24 * 60 * 60 * 1000);
  if (forrigeOktDato === datoNokkel(igaar)) return streak + 1;
  return 1;
}

/**
 * Velger spørsmål til en økt: forfalte repetisjoner først (eldste først),
 * deretter nye spørsmål i stigende vanskelighetsgrad, opptil maks antall.
 */
export function velgSporsmalTilOkt(
  alle: QuizSporsmal[],
  kort: Record<string, SrsKort>,
  maksAntall: number,
  naa: Date = new Date()
): QuizSporsmal[] {
  const perId = new Map(alle.map((s) => [s.id, s]));

  const forfalte = forfalteKort(Object.values(kort), naa)
    .sort((a, b) => new Date(a.neste).getTime() - new Date(b.neste).getTime())
    .map((k) => perId.get(k.sporsmalId))
    .filter((s): s is QuizSporsmal => s !== undefined);

  const nye = alle
    .filter((s) => !(s.id in kort))
    .sort((a, b) => a.vanskelighetsgrad - b.vanskelighetsgrad);

  return [...forfalte, ...nye].slice(0, maksAntall);
}

/** Sjekker et numerisk svar mot fasit med toleranse. */
export function erNumeriskRiktig(svar: number, fasit: number, toleranse: number): boolean {
  return Number.isFinite(svar) && Math.abs(svar - fasit) <= toleranse;
}
