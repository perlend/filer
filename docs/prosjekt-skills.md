# Skills for å gjennomføre prosjektet

Hvilken kompetanse som trengs for å bygge, lansere og drifte appen beskrevet i [app-plan.md](app-plan.md). Dokumentet viser også hva som er kritisk for MVP, hva som kan vente, og hva som kan dekkes med AI-verktøy/innleid hjelp hvis man er få folk.

## Oversikt

| # | Ferdighetsområde | Trengs i MVP? | Kan dekkes av |
|---|---|---|---|
| 1 | Faglig innhold (elektrofag) | ✅ Kritisk | Fagperson med fagbrev + faglærer som kvalitetssikrer |
| 2 | Pedagogikk / læringsdesign | ✅ Kritisk | Kan læres; AI-støtte for utkast |
| 3 | Mobilutvikling (React Native/TypeScript) | ✅ Kritisk | Utvikler + AI-parprogrammering |
| 4 | UX/UI-design | ✅ Viktig | Designmaler + ferdige komponentbibliotek i MVP |
| 5 | Backend og datamodellering | 🟡 Senere (MVP er offline) | Supabase reduserer behovet kraftig |
| 6 | Testing og kvalitetssikring | ✅ Viktig | Utvikleren + pilotbrukere |
| 7 | Personvern og jus | 🟡 Før lansering | Sjekklister + ev. rådgiver |
| 8 | Distribusjon (App Store / Play) | 🟡 Før lansering | Læres av dokumentasjon |
| 9 | Markedsføring og partnerskap | 🟡 Etter pilot | Opplæringskontor er snarveien |
| 10 | Prosjektledelse / produkt | ✅ Hele veien | Eieren av prosjektet (deg) |

## 1. Faglig innhold – elektrofag

Den viktigste og vanskeligste å erstatte. Innholdet må være **riktig** – feil i en app om elsikkerhet er alvorlig.

- Fagbrev-nivå kunnskap: NEK 400, FSE, FEL, måleteknikk, beregninger
- Erfaring med hva lærlinger faktisk sliter med (en fersk montør eller faglærer er ideell)
- Evne til å skrive spørsmål med gode distraktorer (gale svaralternativer som avslører typiske misforståelser)
- **Kvalitetssikring**: minst én uavhengig fagperson bør gå gjennom alt innhold før publisering

> Har du ikke denne kompetansen selv: rekruttér en faglærer ved en videregående skole eller en montør som nylig tok fagprøven. Dette er den ene rollen som ikke kan AI-genereres uten menneskelig kontroll.

## 2. Pedagogikk og læringsdesign

- Skrive mikroleksjoner: én idé per leksjon, oppgave før fasit
- Forstå spaced repetition (SM-2/FSRS-algoritmene) godt nok til å konfigurere den riktig
- Designe progresjon: lett → vanskelig, teori → case
- Skrive forklarende feedback på feil svar (det er her læringen skjer)

Læringsressurser: «Make It Stick» (bok), artikler om retrieval practice, dokumentasjonen til Anki/FSRS.

## 3. Mobilutvikling

Kjernen i byggejobben. Med React Native/Expo-stacken fra app-plan.md:

- **TypeScript** – datamodeller for innhold, quiz og progresjon
- **React Native + Expo** – komponenter, navigasjon (expo-router), OTA-oppdateringer (EAS Update)
- **Lokal lagring** – SQLite/AsyncStorage, offline-first-tankegang
- **State management** – Zustand eller React Query er nok
- Grunnleggende app-livssyklus: bygg, signering, EAS Build

Nivå: en utvikler med webbakgrunn (React) lærer dette på noen uker. AI-verktøy (Claude Code) gjør én utvikler svært produktiv her.

## 4. UX/UI-design

- Mobil-first design for **bruk med arbeidshansker og i sollys**: store touch-flater, høy kontrast
- Informasjonsarkitektur: lærlingen skal finne en kalkulator på under 5 sekunder
- Universell utforming (WCAG): skalerbar tekst, skjermleser
- Figma til skisser; i MVP holder det med et komponentbibliotek (f.eks. Tamagui/NativeBase) og en enkel designprofil

## 5. Backend og datamodellering (fase 2)

MVP-en er offline og trenger ingen backend. Når synk og fadder-visning kommer:

- Supabase: Postgres-skjema, Row Level Security, Auth
- Synk-strategi: konflikthåndtering når samme bruker har to enheter
- Innholds-pipeline: fra Markdown/JSON i repo til app (validering med f.eks. Zod)

## 6. Testing og kvalitetssikring

- Enhetstester for kalkulatorene (feil i en kabeldimensjoneringskalkulator er verre enn en krasj) – Jest/Vitest
- Komponent-/flyttesting: React Native Testing Library, ev. Maestro for E2E
- **Faglig testing**: fagperson verifiserer alle beregninger og fasiter
- Pilottesting med ekte lærlinger: observer 3–5 stykker bruke appen, det avslører mer enn 100 automatiske tester

## 7. Personvern og jus

- GDPR: behandlingsgrunnlag, samtykke (mange brukere er 17–19 år), dataminimering, lagring i EU/EØS
- Personvernerklæring og brukervilkår (maler finnes, f.eks. fra Datatilsynets veiledere)
- Opphavsrett: egne formuleringer med henvisning til NEK 400 – aldri gjengi normtekst
- Ansvarsfraskrivelse: appen er læringsstøtte, ikke autoritativ kilde

## 8. Distribusjon

- Apple Developer-konto (99 USD/år) og Google Play Console (25 USD engang)
- App Store-review-prosessen: skjermbilder, beskrivelser, aldersgrense
- EAS Submit automatiserer det meste av innsendingen
- Versjonsstrategi: innhold via OTA-oppdatering, native endringer via butikkene

## 9. Markedsføring og partnerskap

Den undervurderte delen – en god app uten brukere hjelper ingen:

- **Opplæringskontorene** er snarveien til brukerne: de har direkte kontakt med alle lærlinger i sitt område
- Faglærere på Vg2 elenergi og ekom kan anbefale appen før læretiden
- Nelfo/El og IT Forbundet som mulige partnere
- Enkel nettside + synlighet der lærlinger er (TikTok/YouTube-snutter med regneoppgaver fungerer i denne målgruppen)

## 10. Prosjektledelse og produkt

- Prioritering: holde MVP-en liten (motstå fristelsen til å bygge alt i fase 1)
- Brukerinnsikt: intervjuer med lærlinger før og under bygging (fase 0 i veikartet)
- Iterasjon: ukentlige mål, pilot-feedback inn i backlog
- Økonomi: app-kontoer, ev. innleid design/fagperson, drift (Supabase gratis-tier holder lenge)

## Minste mulige team

| Rolle | Kan være |
|---|---|
| Produkteier + utvikler | Én person (deg) med AI-støtte |
| Fagperson elektro | Innleid/partner – noen timer per uke til innhold og QA |
| Pilotbrukere | 5–10 lærlinger via et opplæringskontor |

Med andre ord: prosjektet er gjennomførbart for én utvikler + én fagperson, så lenge MVP-en holdes til quizmotor, kalkulatorer og elsikkerhetsinnhold.

## Forslag til kompetanseplan (hvis du bygger selv)

1. **Uke 1–2**: TypeScript + React Native-grunnkurs (offisiell Expo-tutorial), skissér datamodellen
2. **Uke 3–4**: Bygg quizmotoren med statisk innhold, lær SQLite-lagring
3. **Parallelt**: rekruttér fagperson, start innholdsproduksjon for elsikkerhet/FSE
4. **Uke 5+**: kalkulatorer med enhetstester, deretter pilot
