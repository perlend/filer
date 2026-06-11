/**
 * Elnummer: 7-sifret produktnummer for elektromateriell i Norge,
 * tildelt via EFObasen (efobasen.efo.no), som eies av EFO.
 * De to første sifrene angir hovedgruppen i elnummerbanken.
 *
 * Appen lagrer brukerens egne mest brukte elnummer lokalt.
 * Vi skipper IKKE med ferdigutfylte produktnummer – elnummer er
 * leverandørspesifikke, og feil nummer er verre enn ingen. EFObasen
 * er autoritativ kilde.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const EFOBASEN_URL = "https://efobasen.efo.no";

export interface ElnummerOppforing {
  id: string;
  /** 7 siffer */
  elnummer: string;
  navn: string;
  notat?: string;
}

export interface Hovedgruppe {
  serie: string;
  navn: string;
  beskrivelse: string;
}

/**
 * Hovedgrupper i elnummerbanken (utdrag – beskrivelser i egne ord
 * basert på EFOs oversikt «Hovedgrupper i elnummerbanken»).
 * Full og oppdatert liste finnes i EFObasen.
 */
export const HOVEDGRUPPER: Hovedgruppe[] = [
  {
    serie: "10",
    navn: "Kabel og ledning",
    beskrivelse: "Alle typer kabel og ledning, samt materiell og tilbehør for varmekabel",
  },
  {
    serie: "11",
    navn: "Kabelmuffer og kabelfordelingsskap",
    beskrivelse: "Muffer, overgangshoder, kabelfordelingsskap med tilbehør",
  },
  {
    serie: "12",
    navn: "Rør, bokser og koblingsmateriell",
    beskrivelse:
      "Materiell for skjult forlegning, koblingsbokser og -klemmer, jordingsklemmer, kanalsystemer og branntetting",
  },
  {
    serie: "13",
    navn: "Festemateriell, kabelstiger og -broer",
    beskrivelse: "Feste for rør og kabel, skruer, plugger, strips, kabelbroer og utstyrsskinner",
  },
];

const NOKKEL_LISTE = "laerling.mineElnummer.v1";

export function erGyldigElnummer(verdi: string): boolean {
  return /^\d{7}$/.test(verdi.trim());
}

/** Formaterer 7 siffer som «12 345 67» slik bransjen ofte skriver dem. */
export function formaterElnummer(verdi: string): string {
  const siffer = verdi.trim();
  if (!erGyldigElnummer(siffer)) return verdi;
  return `${siffer.slice(0, 2)} ${siffer.slice(2, 5)} ${siffer.slice(5)}`;
}

export async function hentMineElnummer(): Promise<ElnummerOppforing[]> {
  try {
    const raa = await AsyncStorage.getItem(NOKKEL_LISTE);
    return raa ? (JSON.parse(raa) as ElnummerOppforing[]) : [];
  } catch {
    return [];
  }
}

export async function lagreMineElnummer(liste: ElnummerOppforing[]): Promise<void> {
  await AsyncStorage.setItem(NOKKEL_LISTE, JSON.stringify(liste));
}

/** Forslag til vanlige produkter lærlingen kan registrere sine numre for. */
export const PRODUKTFORSLAG: string[] = [
  "PFXP 3G2,5 (kursopplegg)",
  "PFXP 3G1,5 (lys)",
  "PN 2,5 sort/blå/gul-grønn",
  "PR 2x1,5 (downlight)",
  "Vekselbryter (trapp)",
  "Dobbel stikkontakt m/jord, innfelt",
  "Jordfeilautomat 2-pol 16 A C",
  "Jordfeilautomat 2-pol 10 A C",
  "Overspenningsvern boliginstallasjon",
  "Koblingsboks utenpåliggende IP54",
  "Fjærklemme 3-leder (f.eks. Wago)",
  "Downlight LED IP44",
  "Varmekabel m/termostat bad",
  "Rør 16 mm + bend og muffer",
];
