/**
 * Stokking av svaralternativer ved visning. Innholdsfilene følger
 * konvensjonen at riktig svar alltid ligger først (riktig: 0), så uten
 * stokking ville fasiten alltid stå øverst. Stokkingen skjer derfor i
 * presentasjonslaget – innholdet forblir urørt.
 */

import type { FlervalgSporsmal } from "@/content/types";

/**
 * Fisher-Yates-stokking av alternativene i et flervalgsspørsmål.
 * Returnerer en ny rekkefølge og hvilken indeks det opprinnelig riktige
 * alternativet nå har. `tilfeldig` kan overstyres for testbarhet.
 */
export function stokkAlternativer(
  sporsmal: FlervalgSporsmal,
  tilfeldig: () => number = Math.random
): { alternativer: string[]; riktigIndeks: number } {
  const alternativer = [...sporsmal.alternativer];
  // Følg det opprinnelig riktige alternativet via teksten dets opprinnelige indeks.
  const indekser = alternativer.map((_, n) => n);

  for (let i = alternativer.length - 1; i > 0; i--) {
    const j = Math.floor(tilfeldig() * (i + 1));
    [alternativer[i], alternativer[j]] = [alternativer[j], alternativer[i]];
    [indekser[i], indekser[j]] = [indekser[j], indekser[i]];
  }

  const riktigIndeks = indekser.indexOf(sporsmal.riktig);
  return { alternativer, riktigIndeks };
}

/**
 * Stokker rekkefølgen på sant/usant-knappene. Returnerer enten
 * [true, false] eller [false, true], avhengig av `tilfeldig`.
 */
export function stokkSantUsant(tilfeldig: () => number = Math.random): boolean[] {
  return tilfeldig() < 0.5 ? [true, false] : [false, true];
}
