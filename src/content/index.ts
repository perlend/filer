import type { FagproveCase, Leksjon, OmradeInfo, QuizSporsmal } from "./types";

import elbilladerCase from "../../content/case/elbillader-garasje.json";
import badCase from "../../content/case/bad-rehabilitering.json";

import elsikkerhetQuiz from "../../content/quiz/elsikkerhet.json";
import teoriQuiz from "../../content/quiz/teori.json";
import maalingQuiz from "../../content/quiz/maaling.json";
import installasjonQuiz from "../../content/quiz/installasjon.json";
import regelverkQuiz from "../../content/quiz/regelverk.json";

import femRegler from "../../content/leksjoner/elsikkerhet/fem-sikkerhetsregler.json";
import jordfeilbryter from "../../content/leksjoner/elsikkerhet/jordfeilbryter.json";
import strommensVirkning from "../../content/leksjoner/elsikkerhet/strommens-virkning.json";
import spenningsfall from "../../content/leksjoner/teori/spenningsfall.json";
import itOgTn from "../../content/leksjoner/teori/it-og-tn.json";
import kortslutningOgVern from "../../content/leksjoner/teori/kortslutning-og-vern.json";
import sluttkontroll from "../../content/leksjoner/maaling/sluttkontroll.json";
import isolasjonsmaaling from "../../content/leksjoner/maaling/isolasjonsmaaling.json";
import bad from "../../content/leksjoner/installasjon/bad.json";
import elbillading from "../../content/leksjoner/installasjon/elbillading.json";
import regelverkpyramiden from "../../content/leksjoner/regelverk/regelverkpyramiden.json";
import samsvarserklaering from "../../content/leksjoner/regelverk/samsvarserklaering.json";

export const OMRADER: OmradeInfo[] = [
  {
    id: "elsikkerhet",
    navn: "Elsikkerhet og FSE",
    ikon: "⚡",
    beskrivelse: "Sikker jobbing, FSE, førstehjelp og jordfeilvern",
  },
  {
    id: "teori",
    navn: "Elektroteknisk teori",
    ikon: "📐",
    beskrivelse: "Ohms lov, trefase, spenningsfall, kortslutning og motorer",
  },
  {
    id: "installasjon",
    navn: "Praktisk installasjon",
    ikon: "🔧",
    beskrivelse: "Bad, elbillading, fordelinger, forlegning og koblinger",
  },
  {
    id: "maaling",
    navn: "Måling og sluttkontroll",
    ikon: "🔍",
    beskrivelse: "Verifikasjon etter NEK 400-6 og feilsøking",
  },
  {
    id: "regelverk",
    navn: "Regelverk og dokumentasjon",
    ikon: "📋",
    beskrivelse: "FEL, FEK, samsvarserklæring, DLE og SJA",
  },
];

export const ALLE_SPORSMAL: QuizSporsmal[] = [
  ...(elsikkerhetQuiz as QuizSporsmal[]),
  ...(teoriQuiz as QuizSporsmal[]),
  ...(installasjonQuiz as QuizSporsmal[]),
  ...(maalingQuiz as QuizSporsmal[]),
  ...(regelverkQuiz as QuizSporsmal[]),
];

export const ALLE_LEKSJONER: Leksjon[] = [
  femRegler,
  jordfeilbryter,
  strommensVirkning,
  spenningsfall,
  itOgTn,
  kortslutningOgVern,
  bad,
  elbillading,
  sluttkontroll,
  isolasjonsmaaling,
  regelverkpyramiden,
  samsvarserklaering,
] as Leksjon[];

export function sporsmalForOmrade(omrade: string): QuizSporsmal[] {
  return ALLE_SPORSMAL.filter((s) => s.omrade === omrade);
}

export function leksjonerForOmrade(omrade: string): Leksjon[] {
  return ALLE_LEKSJONER.filter((l) => l.omrade === omrade);
}

export function finnLeksjon(id: string): Leksjon | undefined {
  return ALLE_LEKSJONER.find((l) => l.id === id);
}

export const ALLE_CASER: FagproveCase[] = [elbilladerCase, badCase] as FagproveCase[];

export function finnCase(id: string): FagproveCase | undefined {
  return ALLE_CASER.find((c) => c.id === id);
}
