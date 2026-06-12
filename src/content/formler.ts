export interface Formel {
  id: string;
  navn: string;
  /** Formelen som tekst, f.eks. "U = R · I" */
  formel: string;
  /** Hva størrelsene betyr, med enheter */
  storrelser: string[];
  naarBrukes: string;
}

export interface FormelGruppe {
  tittel: string;
  ikon: string;
  formler: Formel[];
}

export const FORMELSAMLING: FormelGruppe[] = [
  {
    tittel: "Grunnleggende",
    ikon: "⚡",
    formler: [
      {
        id: "ohms-lov",
        navn: "Ohms lov",
        formel: "U = R · I",
        storrelser: ["U = spenning (V)", "R = resistans (Ω)", "I = strøm (A)"],
        naarBrukes:
          "Sammenhengen mellom spenning, strøm og resistans i en krets. Snu på den etter behov: I = U/R, R = U/I.",
      },
      {
        id: "effekt-enfase",
        navn: "Effekt (likestrøm / resistiv last)",
        formel: "P = U · I = U²/R = R · I²",
        storrelser: ["P = effekt (W)", "U = spenning (V)", "I = strøm (A)", "R = resistans (Ω)"],
        naarBrukes:
          "Effekt i likestrømskretser og rene varmelaster. P = U²/R er gull ved feilsøking: mål resistansen på elementet og du vet effekten.",
      },
      {
        id: "energi",
        navn: "Energi",
        formel: "W = P · t",
        storrelser: ["W = energi (kWh)", "P = effekt (kW)", "t = tid (h)"],
        naarBrukes:
          "Forbruk over tid – det kunden betaler for. Husk skillet: effekt er hvor fort, energi er hvor mye totalt.",
      },
      {
        id: "resistans-leder",
        navn: "Resistans i leder",
        formel: "R = ρ · L / A",
        storrelser: [
          "R = resistans (Ω)",
          "ρ = resistivitet (Ω·mm²/m), kobber 0,0175 ved 20 °C",
          "L = lederlengde (m)",
          "A = tverrsnitt (mm²)",
        ],
        naarBrukes:
          "Forventet verdi ved kontinuitetsmåling, og grunnlaget for spenningsfallformelen. Husk: tur OG retur ved måling på kurs (2 · L).",
      },
      {
        id: "serie-parallell",
        navn: "Serie- og parallellkobling",
        formel: "Serie: R = R₁ + R₂ + …   Parallell: R = (R₁·R₂)/(R₁+R₂)",
        storrelser: ["R = resulterende resistans (Ω)"],
        naarBrukes:
          "Serie: resistansene legges sammen. Parallell: alltid mindre enn den minste grenen – to like gir halvparten. Gjelder også isolasjonsresistanser ved samlemåling!",
      },
    ],
  },
  {
    tittel: "Vekselstrøm og trefase",
    ikon: "🔄",
    formler: [
      {
        id: "effekt-vekselstrom",
        navn: "Aktiv effekt, enfase AC",
        formel: "P = U · I · cos φ",
        storrelser: ["P = aktiv effekt (W)", "U = spenning (V)", "I = strøm (A)", "cos φ = effektfaktor"],
        naarBrukes: "Enfase vekselstrøm med induktiv/kapasitiv last (motorer, lysrørdrivere). For rene varmelaster er cos φ = 1.",
      },
      {
        id: "effekt-trefase",
        navn: "Aktiv effekt, trefase",
        formel: "P = √3 · U · I · cos φ",
        storrelser: [
          "P = aktiv effekt (W)",
          "U = linjespenning (V) – 230 i IT, 400 i TN",
          "I = linjestrøm (A)",
          "cos φ = effektfaktor",
        ],
        naarBrukes:
          "All symmetrisk trefaselast. Å glemme √3 (≈1,73) er den vanligste eksamensfeilen. Snudd: I = P / (√3 · U · cos φ).",
      },
      {
        id: "effekttrekanten",
        navn: "Effekttrekanten",
        formel: "S² = P² + Q²,   cos φ = P / S",
        storrelser: [
          "S = tilsynelatende effekt (VA)",
          "P = aktiv effekt (W)",
          "Q = reaktiv effekt (var)",
        ],
        naarBrukes:
          "Når du skal forstå hvorfor lav cos φ gir høyere strøm: kabler og vern må dimensjoneres for S (strømmen), mens kunden bare får nytte av P.",
      },
      {
        id: "fasespenning",
        navn: "Linje- og fasespenning (TN)",
        formel: "U(fase) = U(linje) / √3",
        storrelser: ["U(linje) = mellom faser (400 V)", "U(fase) = fase–N (230 V)"],
        naarBrukes: "I 400 V TN-nett: 400/√3 = 230 V fase–N. I 230 V IT-nett finnes ingen N – utstyr kobles fase–fase.",
      },
      {
        id: "motorstrom",
        navn: "Motorstrøm fra merkeskilt",
        formel: "I = P / (√3 · U · cos φ · η)",
        storrelser: [
          "P = avgitt (mekanisk) effekt (W)",
          "η = virkningsgrad",
          "cos φ = effektfaktor",
          "U = linjespenning (V)",
        ],
        naarBrukes:
          "Motorens merkeeffekt er AVGITT effekt – del på virkningsgraden for å finne hva nettet må levere. Brukes ved valg av vern og kabel til motor.",
      },
      {
        id: "synkront-turtall",
        navn: "Synkront turtall",
        formel: "n = 120 · f / p",
        storrelser: ["n = turtall (o/min)", "f = frekvens (Hz)", "p = antall poler"],
        naarBrukes:
          "Asynkronmotorens feltturtall: 2-polet 3000, 4-polet 1500, 6-polet 1000 o/min ved 50 Hz. Rotoren går litt saktere (sakking).",
      },
    ],
  },
  {
    tittel: "Dimensjonering og feilstrømmer",
    ikon: "📏",
    formler: [
      {
        id: "spenningsfall-enfase",
        navn: "Spenningsfall, enfase",
        formel: "ΔU = 2 · ρ · L · I / A",
        storrelser: [
          "ΔU = spenningsfall (V)",
          "ρ = 0,0175 Ω·mm²/m (kobber, 20 °C)",
          "L = lengde én vei (m)",
          "I = strøm (A)",
          "A = tverrsnitt (mm²)",
        ],
        naarBrukes:
          "Faktoren 2 = tur og retur. Anbefalt maks 4 % fra inntak til belastning (NEK 400-5-52). Ofte avgjørende på lange kurser.",
      },
      {
        id: "spenningsfall-trefase",
        navn: "Spenningsfall, trefase",
        formel: "ΔU = √3 · ρ · L · I / A",
        storrelser: ["Som enfase, men √3 i stedet for 2"],
        naarBrukes: "Symmetrisk trefaselast. Gir lavere fall enn enfase for samme last – en grunn til å velge trefase på lange strekk.",
      },
      {
        id: "kortslutningsstrom",
        navn: "Kortslutningsstrøm fra sløyfeimpedans",
        formel: "Ik = U / Zs",
        storrelser: ["Ik = kortslutnings-/jordfeilstrøm (A)", "U = spenning (V)", "Zs = sløyfeimpedans (Ω)"],
        naarBrukes:
          "Verifisere at vernet løser ut raskt nok: Ik må være større enn vernets momentanutløsning (C-automat: 5–10 × merkestrøm). Ik maks ved tavlen avgjør krav til bryteevne.",
      },
      {
        id: "utlosekrav",
        navn: "Momentanutløsning automatsikringer",
        formel: "B: 3–5 × In,   C: 5–10 × In,   D: 10–20 × In",
        storrelser: ["In = vernets merkestrøm (A)"],
        naarBrukes:
          "Sammenlign med beregnet/målt Ik min ytterst på kursen. C16 trenger altså opptil 160 A for garantert momentan utløsning.",
      },
      {
        id: "varmgang",
        navn: "Varmeutvikling i overgangsresistans",
        formel: "P = R · I²",
        storrelser: ["P = varmeeffekt (W)", "R = (overgangs)resistans (Ω)", "I = strøm (A)"],
        naarBrukes:
          "Hvorfor en løs tilkobling blir brannfarlig: effekten øker med kvadratet av strømmen. Også grunnen til at termografi avslører dårlige tilkoblinger under last.",
      },
    ],
  },
];
