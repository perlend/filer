import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SrsKort } from "./srs";
import { beregnNyStreak, datoNokkel } from "./okt";

const NOKKEL_KORT = "laerling.srsKort.v1";
const NOKKEL_STATISTIKK = "laerling.statistikk.v1";
const NOKKEL_LESTE = "laerling.lesteLeksjoner.v1";

export interface Statistikk {
  streak: number;
  sisteOktDato: string | null;
  totaltBesvart: number;
  totaltRiktig: number;
}

export const TOM_STATISTIKK: Statistikk = {
  streak: 0,
  sisteOktDato: null,
  totaltBesvart: 0,
  totaltRiktig: 0,
};

async function hentJson<T>(nokkel: string, fallback: T): Promise<T> {
  try {
    const raa = await AsyncStorage.getItem(nokkel);
    return raa ? (JSON.parse(raa) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function hentSrsKort(): Promise<Record<string, SrsKort>> {
  return hentJson(NOKKEL_KORT, {});
}

export async function lagreSrsKort(kort: Record<string, SrsKort>): Promise<void> {
  await AsyncStorage.setItem(NOKKEL_KORT, JSON.stringify(kort));
}

export function hentStatistikk(): Promise<Statistikk> {
  return hentJson(NOKKEL_STATISTIKK, TOM_STATISTIKK);
}

/** Registrerer en fullført økt: oppdaterer streak og svartall. */
export async function registrerOkt(
  besvart: number,
  riktige: number,
  naa: Date = new Date()
): Promise<Statistikk> {
  const forrige = await hentStatistikk();
  const ny: Statistikk = {
    streak: beregnNyStreak(forrige.sisteOktDato, forrige.streak, naa),
    sisteOktDato: datoNokkel(naa),
    totaltBesvart: forrige.totaltBesvart + besvart,
    totaltRiktig: forrige.totaltRiktig + riktige,
  };
  await AsyncStorage.setItem(NOKKEL_STATISTIKK, JSON.stringify(ny));
  return ny;
}

export function hentLesteLeksjoner(): Promise<string[]> {
  return hentJson<string[]>(NOKKEL_LESTE, []);
}

export async function merkLeksjonLest(id: string): Promise<void> {
  const leste = await hentLesteLeksjoner();
  if (!leste.includes(id)) {
    await AsyncStorage.setItem(NOKKEL_LESTE, JSON.stringify([...leste, id]));
  }
}
