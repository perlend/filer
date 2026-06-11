/**
 * Forenklet kabeldimensjonering: minste ledertverrsnitt ut fra
 * belastningsstrøm og samlet korreksjonsfaktor.
 *
 * Tabellen under er FORENKLEDE veiledende verdier for kobberleder med
 * PVC-isolasjon (70 °C), to belastede ledere, referanseinstallasjonsmetode C,
 * omgivelsestemperatur 30 °C – basert på IEC 60364-5-52. Verdiene er ikke
 * avskrift av NEK 400; ved prosjektering skal strømføringsevnen alltid
 * kontrolleres mot NEK 400-5-52 tabell 52B med riktige korreksjonsfaktorer.
 *
 * Resultatet er VEILEDENDE læringsstøtte, ikke prosjekteringsgrunnlag.
 */

export interface KabelTabellRad {
  tverrsnittMm2: number;
  /** Strømføringsevne i ampere før korreksjon */
  kapasitetA: number;
}

export const KABEL_TABELL: readonly KabelTabellRad[] = [
  { tverrsnittMm2: 1.5, kapasitetA: 17.5 },
  { tverrsnittMm2: 2.5, kapasitetA: 24 },
  { tverrsnittMm2: 4, kapasitetA: 32 },
  { tverrsnittMm2: 6, kapasitetA: 41 },
  { tverrsnittMm2: 10, kapasitetA: 57 },
  { tverrsnittMm2: 16, kapasitetA: 76 },
  { tverrsnittMm2: 25, kapasitetA: 101 },
];

export interface KabelInput {
  /** Belastningsstrøm (eller vernets merkestrøm) i ampere */
  stromA: number;
  /**
   * Samlet korreksjonsfaktor (temperatur × forlegning × gruppering),
   * 0 < faktor ≤ 1. Standard 1.
   */
  korreksjonsfaktor?: number;
}

export interface KabelResultat {
  tverrsnittMm2: number;
  /** Strømføringsevne etter korreksjon, i ampere */
  korrigertKapasitetA: number;
}

/**
 * Finner minste tverrsnitt i tabellen der korrigert strømføringsevne
 * (kapasitet × korreksjonsfaktor) er ≥ belastningsstrømmen.
 */
export function minsteTverrsnitt(input: KabelInput): KabelResultat {
  const { stromA, korreksjonsfaktor = 1 } = input;
  if (!Number.isFinite(stromA) || stromA <= 0) {
    throw new Error("Strømmen må være et positivt tall (ampere).");
  }
  if (!Number.isFinite(korreksjonsfaktor) || korreksjonsfaktor <= 0 || korreksjonsfaktor > 1) {
    throw new Error("Korreksjonsfaktoren må være større enn 0 og høyst 1.");
  }

  for (const rad of KABEL_TABELL) {
    const korrigert = rad.kapasitetA * korreksjonsfaktor;
    if (korrigert >= stromA) {
      return { tverrsnittMm2: rad.tverrsnittMm2, korrigertKapasitetA: korrigert };
    }
  }
  throw new Error(
    "Strømmen overstiger tabellens største tverrsnitt (25 mm²). Bruk NEK 400 tabell 52B."
  );
}
