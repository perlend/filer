import type { Omrade } from "./types";
import kart from "../../content/kompetansemaal.json";

/**
 * Kanonisk kart over kompetansemålene i Vg3 elektrikerfaget, brukt til å vise
 * lærlingen hvor langt hun er kommet mot læreplanen ("dekket 6 av 10 mål").
 *
 * Bakgrunn: hvert quizspørsmål og hver leksjon merkes med ett eller flere
 * kompetansemål, men i innholdet er disse skrevet som fritekst i mange
 * varianter (f.eks. «... i henhold til gjeldende regelverk» og «... og begrunne
 * valgene som er gjort» er samme læreplanmål). For å telle progresjon samler
 * vi variantene til stabile mål-ID-er (k01–k10).
 *
 * Kilden er content/kompetansemaal.json, som deles med innholdsvalideringen
 * (npm run valider) slik at nytt innhold ikke kan peke på et ukjent mål.
 * Titlene er egne, korte formuleringer justert mot gjeldende læreplan ELE03-04
 * og skal kvalitetssikres mot udir.no av fagperson før publisering.
 */

export type KompetansemaalId =
  | "k01"
  | "k02"
  | "k03"
  | "k04"
  | "k05"
  | "k06"
  | "k07"
  | "k08"
  | "k09"
  | "k10";

export interface Kompetansemaal {
  id: KompetansemaalId;
  /** Kort visningstittel */
  tittel: string;
  /** Primærområde – styrer ikon og gruppering i visningen */
  omrade: Omrade;
  /** Én linje som utdyper hva målet dekker */
  beskrivelse: string;
}

export const KOMPETANSEMAAL: Kompetansemaal[] = kart.maal as Kompetansemaal[];

const FRITEKST_TIL_ID = kart.kart as Record<string, KompetansemaalId>;

/** Slår opp den kanoniske mål-ID-en for en fritekst-streng (eller null). */
export function normaliserKompetansemaal(streng: string): KompetansemaalId | null {
  return FRITEKST_TIL_ID[streng.trim()] ?? null;
}

/** Alle fritekst-strengene kartet kjenner – brukes av innholdsvalideringen. */
export function kjenteKompetansemaalStrenger(): string[] {
  return Object.keys(FRITEKST_TIL_ID);
}

export function finnKompetansemaal(id: KompetansemaalId): Kompetansemaal | undefined {
  return KOMPETANSEMAAL.find((k) => k.id === id);
}
