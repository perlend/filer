---
name: kalkulator
description: Implementer en elektro-kalkulator (Ohms lov, spenningsfall, kabeldimensjonering, kortslutning osv.) i appen. Bruk når brukeren ber om en ny kalkulator eller endringer i beregningslogikk.
---

# Implementere kalkulatorer

Kalkulatorene er appens «killer feature» og brukes på ekte jobber. **Feil beregning er verre enn en krasj** – derfor gjelder strengere krav her enn ellers i kodebasen.

## Struktur

- Ren beregningslogikk i `src/lib/calc/<navn>.ts` – pure functions, ingen UI, ingen avhengigheter
- UI-komponent separat i `src/features/kalkulatorer/`
- Tester i `src/lib/calc/<navn>.test.ts` – **obligatorisk, skrives sammen med logikken**

## Krav til beregningslogikken

1. **SI-enheter internt** (volt, ampere, ohm, meter, mm²). Konverter kun i UI-laget.
2. Valider input og kast beskrivende feil ved ugyldige verdier (negativt tverrsnitt, null lengde osv.).
3. Dokumenter formelen og kilden i JSDoc over funksjonen, f.eks. spenningsfall enfase: `ΔU = 2 · ρ · L · I / A` med ρ for kobber = 0,0175 Ω·mm²/m (ved 20 °C – oppgi temperaturantakelse).
4. Norske nettsystemer må støttes der det er relevant: 230 V IT (vanligst i bolig), 400 V TN, enfase/trefase.
5. Ikke hardkod tabellverdier fra NEK 400 (strømføringsevne, korreksjonsfaktorer) uten kildehenvisning i kommentar – og vurder opphavsrett: egne forenklede tabeller med henvisning, ikke avskrift.

## Krav til testene

- Minst ett kjent fasit-eksempel per formel, regnet for hånd (skriv utregningen i testnavnet eller kommentar)
- Grensetilfeller: null, negative verdier, svært lange kabler
- Begge nettsystemer og en-/trefase der det gjelder

## Etter implementasjon

Kjør testene og vis resultatet. Minn om at en fagperson skal verifisere fasit-eksemplene (prosjektpolicy, docs/app-plan.md §6).
