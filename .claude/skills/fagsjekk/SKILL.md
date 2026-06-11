---
name: fagsjekk
description: Kvalitetssikre faginnhold (quiz, leksjoner, kalkulatorer) før publisering. Bruk når brukeren ber om gjennomgang, QA eller sjekk av innhold i content/ eller beregninger i src/lib/calc/.
---

# Faglig kvalitetssikring av innhold

Gå systematisk gjennom innholdet som skal sjekkes og rapporter funn per fil. Dette erstatter ikke menneskelig fagkontroll, men fanger de vanligste feilene før fagpersonen bruker tid.

## Sjekkliste per innholdsenhet

### Faglig
- [ ] Er fasit/teori i samsvar med norsk praksis (230 V IT / 400 V TN, NEK 400, FSE)?
- [ ] Er normhenvisninger i `kilde` plausible og på riktig nivå (f.eks. «NEK 400-411», ikke bare «NEK 400»)?
- [ ] Sikkerhetskritisk innhold (FSE, førstehjelp, spenningstesting): er rådet konservativt og entydig? Flagg ALT som er tvetydig.
- [ ] Numeriske oppgaver: regn etter selv og vis utregningen i rapporten.

### Opphavsrett
- [ ] Ingen ordrett normtekst fra NEK 400 eller avskrift fra lærebøker.

### Pedagogisk
- [ ] Har spørsmålet en forklaring som lærer bort noe?
- [ ] Er distraktorene realistiske misforståelser?
- [ ] Leksjoner: starter med oppgave/case, én idé per leksjon?

### Teknisk
- [ ] Gyldig JSON/frontmatter mot formatet i quiz-innhold- og leksjon-skillene
- [ ] `kompetansemaal` matcher mål fra ELE03-03 (docs/ferdigheter.md)
- [ ] Unike `id`-er

## Rapportformat

Grupper funn i **Blokkerende** (faglig feil, tvetydig sikkerhetsråd, opphavsrettsbrudd), **Bør fikses** (pedagogisk svakt) og **Småplukk**. Avslutt alltid med påminnelsen om at en fagperson med fagbrev må godkjenne før publisering.
