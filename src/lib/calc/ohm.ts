/**
 * Ohms lov og effekt.
 *
 * Formler: U = R · I, P = U · I (resistiv last / likestrøm).
 * Kilde: grunnleggende elektroteknikk (Vg1/Vg2-pensum).
 */

export interface OhmResultat {
  /** Spenning i volt */
  u: number;
  /** Strøm i ampere */
  i: number;
  /** Resistans i ohm */
  r: number;
  /** Effekt i watt */
  p: number;
}

export interface OhmInput {
  u?: number;
  i?: number;
  r?: number;
  p?: number;
}

/**
 * Løser Ohms lov ut fra nøyaktig to kjente størrelser (U, I, R eller P)
 * og returnerer alle fire. SI-enheter: volt, ampere, ohm, watt.
 */
export function losOhm(input: OhmInput): OhmResultat {
  const oppgitt = (Object.entries(input) as [string, number | undefined][]).filter(
    ([, v]) => v !== undefined
  );
  if (oppgitt.length !== 2) {
    throw new Error("Oppgi nøyaktig to av størrelsene U, I, R og P.");
  }
  for (const [navn, verdi] of oppgitt) {
    if (!Number.isFinite(verdi) || (verdi as number) <= 0) {
      throw new Error(`${navn.toUpperCase()} må være et positivt tall.`);
    }
  }

  const { u, i, r, p } = input;

  if (u !== undefined && i !== undefined) {
    return { u, i, r: u / i, p: u * i };
  }
  if (u !== undefined && r !== undefined) {
    const strom = u / r;
    return { u, i: strom, r, p: u * strom };
  }
  if (u !== undefined && p !== undefined) {
    const strom = p / u;
    return { u, i: strom, r: u / strom, p };
  }
  if (i !== undefined && r !== undefined) {
    const spenning = i * r;
    return { u: spenning, i, r, p: spenning * i };
  }
  if (i !== undefined && p !== undefined) {
    const spenning = p / i;
    return { u: spenning, i, r: spenning / i, p };
  }
  // gjenstår: r og p
  const strom = Math.sqrt((p as number) / (r as number));
  const spenning = strom * (r as number);
  return { u: spenning, i: strom, r: r as number, p: p as number };
}
