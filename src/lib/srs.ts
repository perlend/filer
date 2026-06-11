/**
 * Spaced repetition basert på SM-2-algoritmen (SuperMemo-2, offentlig
 * beskrevet av Piotr Woźniak). Forenklet til binær vurdering:
 * riktig svar = kvalitet 4, galt svar = kvalitet 2.
 */

export interface SrsKort {
  sporsmalId: string;
  /** Antall vellykkede repetisjoner på rad */
  repetisjoner: number;
  /** Lettfaktor (EF), minimum 1,3 */
  lettfaktor: number;
  /** Nåværende intervall i dager */
  intervallDager: number;
  /** Neste repetisjonstidspunkt, ISO-dato */
  neste: string;
}

export const MIN_LETTFAKTOR = 1.3;
const KVALITET_RIKTIG = 4;
const KVALITET_GALT = 2;

export function nyttKort(sporsmalId: string, naa: Date = new Date()): SrsKort {
  return {
    sporsmalId,
    repetisjoner: 0,
    lettfaktor: 2.5,
    intervallDager: 0,
    neste: naa.toISOString(),
  };
}

function nyLettfaktor(ef: number, kvalitet: number): number {
  const justert = ef + (0.1 - (5 - kvalitet) * (0.08 + (5 - kvalitet) * 0.02));
  return Math.max(MIN_LETTFAKTOR, justert);
}

/** Oppdaterer kortet etter et svar og setter neste repetisjonstidspunkt. */
export function vurderKort(kort: SrsKort, riktig: boolean, naa: Date = new Date()): SrsKort {
  const kvalitet = riktig ? KVALITET_RIKTIG : KVALITET_GALT;
  const lettfaktor = nyLettfaktor(kort.lettfaktor, kvalitet);

  let repetisjoner: number;
  let intervallDager: number;
  if (!riktig) {
    // Galt svar: start intervallrekken på nytt, men behold (senket) lettfaktor
    repetisjoner = 0;
    intervallDager = 1;
  } else if (kort.repetisjoner === 0) {
    repetisjoner = 1;
    intervallDager = 1;
  } else if (kort.repetisjoner === 1) {
    repetisjoner = 2;
    intervallDager = 6;
  } else {
    repetisjoner = kort.repetisjoner + 1;
    intervallDager = Math.round(kort.intervallDager * lettfaktor);
  }

  const neste = new Date(naa.getTime() + intervallDager * 24 * 60 * 60 * 1000);
  return { ...kort, repetisjoner, lettfaktor, intervallDager, neste: neste.toISOString() };
}

/** Kort som skal repeteres nå (neste-tidspunktet er passert). */
export function forfalteKort(kort: SrsKort[], naa: Date = new Date()): SrsKort[] {
  return kort.filter((k) => new Date(k.neste).getTime() <= naa.getTime());
}
