import type { QuizSporsmal } from "@/content/types";

/** Antall riktige/gale svar per spørsmål, over alle økter. */
export type Svarlogg = Record<string, { riktig: number; galt: number }>;

export interface OmradeStatistikk {
  omrade: string;
  besvart: number;
  riktige: number;
  /** 0–100, eller null hvis ingenting er besvart */
  prosent: number | null;
}

export function registrerISvarlogg(logg: Svarlogg, sporsmalId: string, riktig: boolean): Svarlogg {
  const eksisterende = logg[sporsmalId] ?? { riktig: 0, galt: 0 };
  return {
    ...logg,
    [sporsmalId]: {
      riktig: eksisterende.riktig + (riktig ? 1 : 0),
      galt: eksisterende.galt + (riktig ? 0 : 1),
    },
  };
}

/** Treffprosent per fagområde basert på svarloggen. */
export function omradeStatistikk(alle: QuizSporsmal[], logg: Svarlogg): OmradeStatistikk[] {
  const perOmrade = new Map<string, { besvart: number; riktige: number }>();
  for (const sporsmal of alle) {
    const svar = logg[sporsmal.id];
    if (!svar) continue;
    const sum = perOmrade.get(sporsmal.omrade) ?? { besvart: 0, riktige: 0 };
    sum.besvart += svar.riktig + svar.galt;
    sum.riktige += svar.riktig;
    perOmrade.set(sporsmal.omrade, sum);
  }
  const omrader = [...new Set(alle.map((s) => s.omrade))];
  return omrader.map((omrade) => {
    const sum = perOmrade.get(omrade) ?? { besvart: 0, riktige: 0 };
    return {
      omrade,
      besvart: sum.besvart,
      riktige: sum.riktige,
      prosent: sum.besvart > 0 ? Math.round((sum.riktige / sum.besvart) * 100) : null,
    };
  });
}

/**
 * Velger spørsmålene brukeren sliter mest med: høyest feilandel først
 * (kun spørsmål med minst ett galt svar), deretter flest gale.
 */
export function velgSvakeSporsmal(
  alle: QuizSporsmal[],
  logg: Svarlogg,
  maksAntall: number
): QuizSporsmal[] {
  return alle
    .map((sporsmal) => {
      const svar = logg[sporsmal.id] ?? { riktig: 0, galt: 0 };
      const total = svar.riktig + svar.galt;
      return { sporsmal, galt: svar.galt, feilandel: total > 0 ? svar.galt / total : 0 };
    })
    .filter((k) => k.galt > 0)
    .sort((a, b) => b.feilandel - a.feilandel || b.galt - a.galt)
    .slice(0, maksAntall)
    .map((k) => k.sporsmal);
}

/**
 * Trekker spørsmål til prøvemodus: tilfeldig utvalg spredt over alle
 * områder (rundgang), med valgfri tilfeldighetskilde for testbarhet.
 */
export function velgProveSporsmal(
  alle: QuizSporsmal[],
  antall: number,
  tilfeldig: () => number = Math.random
): QuizSporsmal[] {
  const perOmrade = new Map<string, QuizSporsmal[]>();
  for (const sporsmal of alle) {
    const liste = perOmrade.get(sporsmal.omrade) ?? [];
    liste.push(sporsmal);
    perOmrade.set(sporsmal.omrade, liste);
  }
  // Stokk hvert område for seg (Fisher-Yates)
  for (const liste of perOmrade.values()) {
    for (let n = liste.length - 1; n > 0; n--) {
      const m = Math.floor(tilfeldig() * (n + 1));
      [liste[n], liste[m]] = [liste[m], liste[n]];
    }
  }
  // Rundgang mellom områdene så prøven dekker bredt
  const resultat: QuizSporsmal[] = [];
  const lister = [...perOmrade.values()];
  let indeks = 0;
  while (resultat.length < antall && lister.some((l) => l.length > 0)) {
    const liste = lister[indeks % lister.length];
    const neste = liste.pop();
    if (neste) resultat.push(neste);
    indeks++;
  }
  return resultat;
}

export type Karakterestimat = "Bestått meget godt" | "Bestått" | "Ikke bestått";

/**
 * Grovt estimat etter fagprøvens karakterskala. Kun veiledende –
 * en quiz måler ikke planlegging, utførelse og egenvurdering.
 */
export function karakterestimat(prosent: number): Karakterestimat {
  if (prosent >= 85) return "Bestått meget godt";
  if (prosent >= 60) return "Bestått";
  return "Ikke bestått";
}
