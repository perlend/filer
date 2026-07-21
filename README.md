# Lærling-appen ⚡ – læringsapp for elektrikerlærlinger

En app som hjelper elektrikerlærlinger i Norge å bli trygge fagarbeidere – fra første dag i lære til bestått fagprøve.

## Hva er dette?

Dette repoet inneholder grunnlaget for appen:

| Dokument | Innhold |
|---|---|
| [docs/ferdigheter.md](docs/ferdigheter.md) | Hvilke ferdigheter en elektrikerlærling må mestre – basert på læreplanen (ELE03-03), FSE, NEK 400 og kravene til fagprøven |
| [docs/app-plan.md](docs/app-plan.md) | Hva som trengs for å lage en god læringsapp: funksjoner, pedagogikk, teknologivalg og veikart (MVP → ferdig app) |
| [docs/prosjekt-skills.md](docs/prosjekt-skills.md) | Kompetansen som trengs for å gjennomføre prosjektet – og hvordan et lite team kan dekke den |
| [.claude/skills/](.claude/skills/) | Claude Code-skills for prosjektet: `quiz-innhold`, `leksjon`, `kalkulator` og `fagsjekk` |

## Målgruppe

- Elektrikerlærlinger (Vg3 / opplæring i bedrift, 2,5 år læretid)
- Elever på Vg1 elektro og datateknologi / Vg2 elenergi og ekom som forbereder seg på læretid
- Faddere/instruktører i bedrift som vil følge opp lærlingen

## Målet med appen

1. **Lære** – korte, praktiske leksjoner knyttet til kompetansemålene i læreplanen
2. **Øve** – quiz, regneoppgaver og case med repetisjon over tid (spaced repetition)
3. **Dokumentere** – logg over arbeidsoppdrag koblet mot kompetansemål (nyttig mot halvårsvurdering og fagprøve)
4. **Bestå** – målrettet trening mot eksamen (Vg3-teori) og fagprøven

## Kom i gang

Appen er bygget med [Expo](https://expo.dev) (React Native + TypeScript) og kjører helt offline.

```bash
npm install
npm start          # åpne i Expo Go på mobilen, eller trykk w for nettleser
npm test           # enhetstester (vitest)
npm run typecheck  # TypeScript
npm run valider    # validerer faginnholdet i content/
```

## Struktur

```
app/               skjermer (expo-router): hjem, øvelse/quiz, leksjoner, kalkulatorer, foto-hjelp
src/lib/calc/      beregningslogikk med tester (Ohms lov, spenningsfall, kabel)
src/lib/ai/        foto-analyse med Claude (claude-opus-4-8) + sikker nøkkellagring
src/lib/           spaced repetition (SM-2), øktbygging, lagring (AsyncStorage)
src/content/       innholdsmodell og innholdsindeks
content/           faginnhold som data: quiz (JSON) og leksjoner (JSON)
scripts/           innholdsvalidering
```

## Status

🟢 MVP under utvikling: quizmotor med spaced repetition, **113 quizspørsmål og 12 mikroleksjoner**
fordelt på fem områder (elsikkerhet/FSE, teori, praktisk installasjon, måling, regelverk),
prøvemodus med karakterestimat, 2 fagprøve-case, statistikk med «tren på svake», **læreplan-progresjon
(mestring per kompetansemål med målrettet øving)**, formelsamling, 3 kalkulatorer, fremdriftsvisning – og **Foto-hjelp**: ta bilde av en installasjon og få den
forklart opp mot NEK 400 (krever egen Anthropic API-nøkkel, kun for personlig bruk).

⚠️ **Faginnholdet er ikke kvalitetssikret av fagperson med fagbrev ennå.** Det skal gjøres før
appen vises til lærlinger – se prosjektpolicyen i [docs/app-plan.md](docs/app-plan.md).
