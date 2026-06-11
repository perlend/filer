# Hva trengs for å lage en bra app?

Plan for funksjoner, pedagogikk, teknologi og veikart. Bygger på ferdighetskartet i [ferdigheter.md](ferdigheter.md).

## 1. Pedagogiske prinsipper (det som gjør appen *bra*)

- **Mikrolæring**: leksjoner på 3–7 minutter som passer i lunsjpausen eller i bilen mellom oppdrag. Lærlinger er på byggeplass hele dagen – ikke bak en PC.
- **Spaced repetition**: quiz-spørsmål kommer tilbake med økende intervall (f.eks. SM-2-algoritmen). Spesielt riktig for FSE/førstehjelp som uansett skal repeteres årlig.
- **Aktiv læring**: alltid oppgave før fasit – regn, velg vern, finn feilen – ikke bare lesing.
- **Praksisnært**: case fra ekte arbeidshverdag («Du skal montere varmekabel på et bad …») i stedet for abstrakt teori.
- **Gamification med måte**: streaks, nivåer per ferdighetsområde og progresjon mot kompetansemålene. Unngå støyende poengjag – målet er fagbrev, ikke high score.
- **Umiddelbar og forklarende feedback**: feil svar gir en forklaring med normhenvisning, ikke bare «feil».
- **Synlig progresjon mot læreplanen**: lærlingen ser «du har dekket 14 av 21 kompetansemål» – det motiverer og er nyttig i halvårssamtaler med fadder.

## 2. Kjernefunksjoner

### MVP (versjon 1)

1. **Quizmotor med spaced repetition**
   - Spørsmålsbank organisert etter ferdighetsområdene (elsikkerhet, teori, NEK 400, måling …)
   - Flervalg, sant/usant og numeriske svar (regneoppgaver)
   - Forklaring + kildehenvisning på hvert spørsmål
2. **Leksjoner (mikrolæring)**
   - Kort tekst + illustrasjon per tema, koblet til kompetansemål
3. **Formelsamling og kalkulatorer**
   - Ohms lov, effekt, spenningsfall, kabeldimensjonering, kortslutningsstrøm
   - Kalkulatorer er en «killer feature»: nyttig på jobb hver dag, gir grunn til å åpne appen
4. **Progresjon**
   - Per ferdighetsområde og per kompetansemål i ELE03-03
5. **Offline-støtte**
   - Byggeplasser og kjellere har dårlig dekning – innhold må caches lokalt

### Versjon 2

6. **Opplæringslogg**: lærlingen logger arbeidsoppdrag med bilder og knytter dem til kompetansemål (gull verdt mot fagprøven, og mange opplæringskontor krever logg uansett)
7. **Fagprøve-simulator**: case med planlegging → gjennomføring (quiz/valg) → dokumentasjon → egenvurdering
8. **Eksamenstrening Vg3-teori**: prøver på tid med karakterestimat
9. **Påminnelser**: daglig økt, årlig FSE-repetisjon

### Senere

10. **Fadder-/instruktørvisning**: se lærlingens progresjon (krever samtykke)
11. **Bildegjenkjenning/AI-hjelper**: «forklar dette skjemaet», «hvilket vern er dette?»
12. **Andre elektrofag**: energimontør, automatiker, telekommunikasjonsmontør – samme motor, nytt innhold

## 3. Innholdsstrategi (den egentlige jobben)

Teknologien er den enkle delen – **innholdet avgjør om appen blir bra**:

- Skriv spørsmål og leksjoner med en faglærer/montør med fagbrev som kvalitetssikrer
- Strukturér alt innhold som data (JSON/YAML eller CMS), ikke hardkodet i appen, slik at det kan oppdateres når NEK 400 revideres (ny utgave hvert 4. år)
- **Opphavsrett**: NEK 400 og lærebøker er beskyttet. Skriv egne forklaringer og henvis til norm-punkter («se NEK 400-823») i stedet for å gjengi normtekst
- Start smalt og dypt: gjør elsikkerhet/FSE komplett før du begynner på neste område

## 4. Teknologivalg (anbefaling)

| Lag | Anbefaling | Hvorfor |
|---|---|---|
| App | **React Native med Expo** (alternativ: Flutter) | Én kodebase for iOS + Android, rask utvikling, OTA-oppdateringer av innhold |
| Språk | TypeScript | Typesikkerhet i quiz-/innholdsmodellene |
| Lokal lagring | SQLite (expo-sqlite) eller WatermelonDB | Offline-first: progresjon og innhold lagres lokalt, synkes når nett |
| Backend | **Supabase** (alternativ: Firebase) | Auth, Postgres, synk og lagring uten å drifte egen server |
| Innhold | Markdown/JSON i repo til å begynne med, CMS (f.eks. Sanity) senere | Versjonskontroll på faginnhold |
| Analyse | PostHog eller Firebase Analytics | Se hvor brukerne faller av |

**Enklest mulig start**: appen kan i MVP være 100 % offline uten backend i det hele tatt – innholdet pakkes med appen, progresjon lagres lokalt. Backend legges til når man trenger synk mellom enheter og fadder-visning.

## 5. Datamodell (skisse)

```
Ferdighetsområde (f.eks. "Elsikkerhet og FSE")
 └── Modul (kobles til kompetansemål i ELE03-03)
      ├── Leksjon (markdown + illustrasjoner)
      └── Spørsmål
           ├── type: flervalg | sant/usant | numerisk
           ├── forklaring + kildehenvisning
           └── SRS-data per bruker (intervall, neste repetisjon)

Bruker
 ├── progresjon per modul/kompetansemål
 ├── streak og statistikk
 └── loggførte arbeidsoppdrag (v2)
```

## 6. Viktige ikke-funksjonelle krav

- **Personvern (GDPR)**: mange lærlinger er 17–19 år; minimer datainnsamling, lagre i EU/EØS, tydelig samtykke. Opplæringslogg med bilder fra kundeanlegg må behandles varsomt.
- **Universell utforming**: god kontrast, skalerbar tekst, skjermleser – og store touch-flater (brukes med arbeidsnever).
- **Norsk språk** (bokmål først, nynorsk senere).
- **Faglig ansvarsfraskrivelse**: appen er læringsstøtte, ikke erstatning for norm, forskrift eller instruktør.

## 7. Veikart

| Fase | Innhold | Estimat |
|---|---|---|
| 0. Validering | Snakk med 5–10 lærlinger og et opplæringskontor: hva sliter de mest med? | 2 uker |
| 1. MVP | Quizmotor + 150–300 spørsmål om elsikkerhet/FSE + kalkulatorer + progresjon, offline | 6–10 uker |
| 2. Pilot | Test med en lærlinggruppe/bedrift, iterer på innhold | 4–8 uker |
| 3. Utvidelse | Resten av ferdighetsområdene, opplæringslogg, fagprøve-simulator | løpende |

## 8. Eksisterende aktører (kjenn konkurrentene)

- **Trainor** – kurs i FSE m.m. for bedrifter ([trainor.no](https://en.trainor.no/))
- **Nextbook** – digital læringsressurs for elektrikerfaget ([nextbook.no](https://www.nextbook.no/course/elektrikerfaget))
- Opplæringskontorenes egne loggsystemer (f.eks. OLKWEB)

Nisjen for denne appen: **gratis/rimelig, mobil-first, lærling-sentrert daglig trening** – ikke bedriftskurs.

## Kilder

- [Læreplan i Vg3 elektrikerfaget (ELE03-03) – udir.no](https://www.udir.no/lk20/ele03-03)
- [Kompetansemål og vurdering ELE03-03 – udir.no](https://www.udir.no/lk20/ele03-03/kompetansemaal-og-vurdering/kv725)
- [Vurderingsgrunnlag fagprøve elektrikerfaget – Vestfold fylkeskommune](https://www.vestfoldfylke.no/globalassets/vfk---hovednettsted/dokumenter/opplaring/opplaring-i-bedrift/vurderingsgrunnlag/el/elektrikerfaget.pdf)
- [Hvordan bli elektriker – elhjem.no](https://www.elhjem.no/hvordan-blir-jeg-elektriker/)
- [Microlearning best practices – arist.com](https://arist.com/resources/blogs/microlearning-research-benefits-and-best-practices)
- [Spaced repetition apps – makeheadway.com](https://makeheadway.com/blog/spaced-repetition-app/)
