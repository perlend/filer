# Lærling-appen – læringsapp for elektrikerlærlinger

App som hjelper norske elektrikerlærlinger (Vg3 elektrikerfaget, ELE03-03) frem til fagprøven. Alt innhold og all kommunikasjon er på norsk bokmål.

## Nøkkeldokumenter

- `docs/ferdigheter.md` – ferdighetskartet (læreplan, FSE, NEK 400, fagprøve) som alt innhold knyttes til
- `docs/app-plan.md` – funksjoner, pedagogikk, teknologivalg (React Native/Expo + TypeScript, offline-first) og veikart
- `docs/prosjekt-skills.md` – kompetansebehov for gjennomføring

## Prosjekt-skills (.claude/skills/)

- `quiz-innhold` – lage quizspørsmål (JSON-format og regler)
- `leksjon` – skrive mikroleksjoner (mal og pedagogiske regler)
- `kalkulator` – implementere beregningslogikk (krav om tester og SI-enheter)
- `fagsjekk` – kvalitetssikre innhold før publisering

## Ufravikelige regler

1. **Aldri gjengi normtekst fra NEK 400 eller lærebøker ordrett** – egne formuleringer med henvisning (opphavsrett).
2. Sikkerhetskritisk innhold (FSE, førstehjelp) skal være konservativt og entydig; flagg tvil i stedet for å gjette.
3. Beregningslogikk skal alltid ha enhetstester med håndregnede fasit-eksempler.
4. Alt faginnhold skal kvalitetssikres av fagperson med fagbrev før publisering – si dette eksplisitt når innhold leveres.

## Planlagt struktur (når koden kommer)

- `content/quiz/` og `content/leksjoner/` – faginnhold som data (JSON/Markdown)
- `src/lib/calc/` – ren beregningslogikk med tester
- `src/features/` – UI per funksjonsområde
