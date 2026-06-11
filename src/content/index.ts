import type { Leksjon, OmradeInfo, QuizSporsmal } from "./types";

import elsikkerhetQuiz from "../../content/quiz/elsikkerhet.json";
import teoriQuiz from "../../content/quiz/teori.json";
import maalingQuiz from "../../content/quiz/maaling.json";

import femRegler from "../../content/leksjoner/elsikkerhet/fem-sikkerhetsregler.json";
import jordfeilbryter from "../../content/leksjoner/elsikkerhet/jordfeilbryter.json";
import spenningsfall from "../../content/leksjoner/teori/spenningsfall.json";
import itOgTn from "../../content/leksjoner/teori/it-og-tn.json";
import sluttkontroll from "../../content/leksjoner/maaling/sluttkontroll.json";

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
    beskrivelse: "Ohms lov, trefase, spenningsfall og nettsystemer",
  },
  {
    id: "maaling",
    navn: "Måling og sluttkontroll",
    ikon: "🔍",
    beskrivelse: "Verifikasjon etter NEK 400-6 og feilsøking",
  },
];

export const ALLE_SPORSMAL: QuizSporsmal[] = [
  ...(elsikkerhetQuiz as QuizSporsmal[]),
  ...(teoriQuiz as QuizSporsmal[]),
  ...(maalingQuiz as QuizSporsmal[]),
];

export const ALLE_LEKSJONER: Leksjon[] = [
  femRegler,
  jordfeilbryter,
  spenningsfall,
  itOgTn,
  sluttkontroll,
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
