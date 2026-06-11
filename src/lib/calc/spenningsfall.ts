/**
 * Spenningsfall i kabel (resistiv beregning).
 *
 * Enfase/likestrøm: ΔU = 2 · ρ · L · I / A
 * Trefase:          ΔU = √3 · ρ · L · I / A
 *
 * ρ (resistivitet kobber) = 0,0175 Ω·mm²/m ved 20 °C. Beregningen ser bort
 * fra ledningens reaktans og temperaturstigning, og gjelder cos φ = 1 –
 * en vanlig, konservativ forenkling for tverrsnitt ≤ 50 mm².
 * NEK 400 anbefaler maks 4 % spenningsfall fra inntak til belastning
 * (se NEK 400-5-52, informativt tillegg om spenningsfall).
 */

export const RESISTIVITET_KOBBER = 0.0175; // Ω·mm²/m ved 20 °C

export type Fase = "enfase" | "trefase";

export interface SpenningsfallInput {
  /** Kabellengde én vei, i meter */
  lengdeM: number;
  /** Belastningsstrøm i ampere */
  stromA: number;
  /** Ledertverrsnitt i mm² */
  tverrsnittMm2: number;
  /** Systemspenning i volt (f.eks. 230 for IT, 400 for TN) */
  spenningV: number;
  fase: Fase;
}

export interface SpenningsfallResultat {
  /** Spenningsfall i volt */
  fallV: number;
  /** Spenningsfall i prosent av systemspenningen */
  fallProsent: number;
  /** True hvis fallet er innenfor anbefalingen på 4 % */
  innenforAnbefaling: boolean;
}

export function beregnSpenningsfall(input: SpenningsfallInput): SpenningsfallResultat {
  const { lengdeM, stromA, tverrsnittMm2, spenningV, fase } = input;
  if (!Number.isFinite(lengdeM) || lengdeM <= 0) {
    throw new Error("Lengden må være et positivt tall (meter).");
  }
  if (!Number.isFinite(stromA) || stromA <= 0) {
    throw new Error("Strømmen må være et positivt tall (ampere).");
  }
  if (!Number.isFinite(tverrsnittMm2) || tverrsnittMm2 <= 0) {
    throw new Error("Tverrsnittet må være et positivt tall (mm²).");
  }
  if (!Number.isFinite(spenningV) || spenningV <= 0) {
    throw new Error("Spenningen må være et positivt tall (volt).");
  }

  const faktor = fase === "enfase" ? 2 : Math.sqrt(3);
  const fallV = (faktor * RESISTIVITET_KOBBER * lengdeM * stromA) / tverrsnittMm2;
  const fallProsent = (fallV / spenningV) * 100;
  return { fallV, fallProsent, innenforAnbefaling: fallProsent <= 4 };
}
