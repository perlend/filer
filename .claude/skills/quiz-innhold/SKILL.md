---
name: quiz-innhold
description: Lag eller revider quizspørsmål for elektrikerlærling-appen. Bruk når brukeren ber om nye spørsmål, spørsmålsbank, oppgaver eller quiz-innhold til et ferdighetsområde.
---

# Lage quizspørsmål

Du lager spørsmål til en læringsapp for norske elektrikerlærlinger (Vg3 elektrikerfaget, ELE03-03). Innholdet skal være på bokmål.

## Format

Spørsmål lagres som JSON i `content/quiz/<ferdighetsomrade>.json`:

```json
{
  "id": "elsikkerhet-fse-001",
  "omrade": "elsikkerhet",
  "kompetansemaal": ["risikovurdere anlegg og utstyr ..."],
  "type": "flervalg",
  "sporsmal": "Hva er første sikkerhetsregel ved arbeid på frakoblet anlegg?",
  "alternativer": ["Frakoble fullstendig", "Spenningsteste", "Jorde og kortslutte", "Varsle LFS"],
  "riktig": 0,
  "forklaring": "De fem sikkerhetsreglene starter alltid med fullstendig frakobling. Se FSE § 14.",
  "kilde": "FSE § 14",
  "vanskelighetsgrad": 1
}
```

Typene er `flervalg`, `santusant` og `numerisk` (numerisk har `svar` + `toleranse` i stedet for `alternativer`/`riktig`).

## Regler

1. **Aldri gjengi normtekst fra NEK 400 ordrett** – skriv egne formuleringer og henvis til normpunkt i `kilde` (opphavsrett).
2. Hvert spørsmål skal ha en `forklaring` som lærer bort noe, ikke bare bekrefter fasit. Forklar *hvorfor* de gale alternativene er gale når det er plass.
3. Distraktorene (gale alternativer) skal speile typiske misforståelser hos lærlinger – ikke åpenbart tullete svar.
4. Numeriske oppgaver skal bruke realistiske verdier fra norsk installasjonspraksis (230V IT, 400V TN, vanlige kabeltverrsnitt 1,5/2,5/4/6 mm²).
5. Knytt spørsmålet til kompetansemål fra ELE03-03 (se docs/ferdigheter.md).
6. Sikkerhetskritisk innhold (FSE, førstehjelp, spenningstesting) skal være konservativt og entydig – ved tvil, ikke publiser.

## Etter generering

- Valider JSON-strukturen (kjør innholdsvalidering hvis scriptet finnes i `scripts/`).
- Minn brukeren på at en fagperson med fagbrev må kvalitetssikre innholdet før det publiseres – det er prosjektets policy (docs/app-plan.md §3).
