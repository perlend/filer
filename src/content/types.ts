export type Omrade = "elsikkerhet" | "teori" | "maaling" | "installasjon" | "regelverk";

export interface SporsmalFelles {
  id: string;
  omrade: Omrade;
  kompetansemaal: string[];
  sporsmal: string;
  forklaring: string;
  kilde: string;
  /** 1 = lett, 2 = middels, 3 = vanskelig */
  vanskelighetsgrad: 1 | 2 | 3;
}

export interface FlervalgSporsmal extends SporsmalFelles {
  type: "flervalg";
  alternativer: string[];
  /** Indeks i alternativer */
  riktig: number;
}

export interface SantUsantSporsmal extends SporsmalFelles {
  type: "santusant";
  riktig: boolean;
}

export interface NumeriskSporsmal extends SporsmalFelles {
  type: "numerisk";
  svar: number;
  toleranse: number;
  enhet: string;
}

export type QuizSporsmal = FlervalgSporsmal | SantUsantSporsmal | NumeriskSporsmal;

export interface LeksjonSeksjon {
  tittel: string;
  tekst: string;
}

export interface Leksjon {
  id: string;
  tittel: string;
  omrade: Omrade;
  kompetansemaal: string[];
  /** 1 = lett, 2 = middels, 3 = vanskelig */
  nivaa: 1 | 2 | 3;
  lesetidMin: number;
  seksjoner: LeksjonSeksjon[];
  huskepunkter: string[];
}

export interface OmradeInfo {
  id: Omrade;
  navn: string;
  ikon: string;
  beskrivelse: string;
}
