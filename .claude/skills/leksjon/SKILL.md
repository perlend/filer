---
name: leksjon
description: Skriv en mikroleksjon for elektrikerlærling-appen. Bruk når brukeren ber om leksjoner, læringsinnhold eller forklaringer av et tema som skal inn i appen.
---

# Skrive mikroleksjoner

Leksjoner er korte læringstekster (3–7 minutters lesing) for norske elektrikerlærlinger. Lagres som Markdown med frontmatter i `content/leksjoner/<ferdighetsomrade>/<slug>.md`.

## Mal

```markdown
---
tittel: "Jordfeilbryter – slik virker den"
omrade: elsikkerhet
kompetansemaal:
  - "installere og sette i drift ulike fordelingssystemer ... med tilhørende jordfeilvern"
nivaa: 1
lesetid: 4
---

## Tenk først 🤔
(Én konkret oppgave eller et case FØR teorien – aktiv læring.)

## Teori
(Maks én hovedidé per leksjon. Kort, konkret, praksisnært.)

## På jobben 🔧
(Hvordan dette ser ut i arbeidshverdagen på byggeplass.)

## Husk
(2–4 kulepunkter – det lærlingen skal sitte igjen med.)
```

## Regler

1. **Én idé per leksjon.** Hvis du trenger to H2-teoriseksjoner, del i to leksjoner.
2. Start alltid med en oppgave/case («Tenk først») – aldri med definisjoner.
3. Skriv for en 18-åring på byggeplass: korte setninger, fagbegreper forklares første gang de brukes.
4. Henvis til norm/forskrift (f.eks. «se NEK 400-411») men **gjengi aldri normtekst ordrett**.
5. Praksisnære eksempler fra norsk installasjonsvirkelighet: bolig, bad, elbillader, landbruk.
6. Knytt leksjonen til kompetansemål fra ELE03-03 (docs/ferdigheter.md har hele kartet).
7. Foreslå 2–3 quizspørsmål til leksjonen til slutt (bruk quiz-innhold-skillen for selve formatet).

Minn brukeren på faglig kvalitetssikring før publisering.
