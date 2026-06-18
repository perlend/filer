# Romvisualisering – plan for app

> **Eget prosjekt**, uavhengig av lærling-appen i dette repoet. Dokumentet ligger her som planleggingsnotat.

## Idé

En app for to personer (deg og samboer) der dere kan:

1. Laste opp bilder av rom i leiligheten.
2. Velge veggfarger og møbler dere vurderer.
3. Få KI-genererte bilder av rommet ferdig møblert og med veggene malt i valgt farge.
4. Lagre resultater som **favoritter** og finne dem igjen senere – begge skal se de samme lagrede favorittene.

## Brukerflyt (MVP)

```
Ta/last opp bilde av rommet
        ↓
Velg veggfarge (fargevelger eller NCS/RAL-kode)
Velg møbler (fritekst, f.eks. «grønn 3-seter i fløyel, eikebord»,
             eller lim inn bilde av et møbel dere vurderer)
        ↓
Generer → KI lager nytt bilde av rommet med farge + møbler
        ↓
Lagre som favoritt (med navn, f.eks. «Stue – salvie + eik»)
        ↓
Galleri: bla i favoritter, se original vs. generert side om side
```

## Teknologivalg

### Bildegenerering (kjernen i appen)

Dette er **bilderedigering**, ikke ren bildegenerering: modellen må bevare rommets geometri (vinduer, dører, perspektiv) og bare endre vegger og innhold. Claude/Anthropic-API-et genererer ikke bilder, så her trengs en egen leverandør. Aktuelle kandidater å teste i fase 0:

| Kandidat | Styrke | Merknad |
|---|---|---|
| Google Gemini (bilderedigering) | God på instruksjonsbasert redigering av foto («mal veggene i denne fargen, sett inn sofa») | Enkelt API, naturlig førstevalg å prototype med |
| OpenAI gpt-image (edit/inpainting) | God kvalitet, maske-basert redigering | Maske = mer kontroll, mer arbeid |
| Stable Diffusion + ControlNet (f.eks. via Replicate) | Mest kontroll over geometri, billigst per bilde i volum | Mer kompleks oppsett og prompt-tuning |

**Anbefaling:** Start med en liten prototype (skript) som tester 2–3 av disse på faktiske bilder av leiligheten deres, og velg den som best bevarer rommet. Priser og modellnavn sjekkes mot leverandørenes dokumentasjon når dere starter (de endrer seg fort).

Viktig forventningsstyring: resultatet er en **visualisering**, ikke fargenøyaktig. Lys, skygge og eksakt fargegjengivelse vil avvike fra virkeligheten – kjøp alltid en prøveboks maling før dere maler.

### App og lagring

- **App:** Expo / React Native + TypeScript – samme stack som lærling-appen, så kompetansen gjenbrukes. Gir enkel kamera-/galleritilgang på mobil. (Alternativ: Next.js-webapp hvis dere heller vil slippe app-installasjon.)
- **Backend:** En tynn backend er nødvendig uansett, fordi API-nøkkelen til bildemodellen ikke kan ligge i appen. Anbefaling: **Supabase** (auth + Postgres + filagring) pluss én Edge Function som tar imot bilde + valg, kaller bildemodellen og returnerer resultatet.
- **Deling mellom dere to:** Begge logger inn (e-post/magisk lenke), og alle data knyttes til en felles «husholdning» – da ser dere automatisk hverandres favoritter.

## Datamodell (skisse)

| Tabell | Innhold |
|---|---|
| `household` | Felles space for dere to |
| `rooms` | Navn («Stue»), originalbilder av rommet |
| `generations` | Referanse til rom + valgt farge + møbelbeskrivelse + generert bilde + tidspunkt |
| `favorites` | Utvalgte generations med eget navn/notat |

Originalbilder og genererte bilder lagres i privat fillagring (ikke offentlig tilgjengelig – det er bilder av hjemmet deres).

## Faser

**Fase 0 – prototype (1–2 kvelder):** Skript som sender ett bilde + farge + møbelønske til 2–3 bildemodeller. Velg modell basert på resultatet. *Dette er den viktigste fasen – hvis ingen modell gir godt nok resultat, bør appen ikke bygges.*

**Fase 1 – generering i app:** Expo-app med bildeopplasting, fargevelger, møbel-fritekst, generer-knapp og resultatvisning. Ingen innlogging ennå; alt lokalt på telefonen.

**Fase 2 – favoritter og lagring:** Supabase-oppsett, lagre/navngi favoritter, galleri med før/etter-visning. Favorittene overlever reinstallasjon av appen.

**Fase 3 – deling og finpuss:** Innlogging for begge, felles husholdning, flere varianter per generering, eventuelt gjenbrukbart «møbelbibliotek» av ting dere vurderer å kjøpe.

## Kostnader og risiko

- **Kost per generering:** typisk i størrelsesorden noen øre til et par kroner per bilde avhengig av leverandør – ubetydelig for privat bruk, men sett en enkel grense i Edge-funksjonen så en feil-loop ikke koster penger.
- **Kvalitetsrisiko:** modellene kan endre ting de ikke skal (flytte vinduer, endre gulv). Avbøtes med tydelige instruksjoner («behold alt uendret bortsett fra…») og ved å generere flere varianter.
- **Personvern:** bilder av hjemmet lagres privat; ikke del API-respons-URL-er offentlig.

## Neste steg

1. Kjør fase 0-prototypen mot ekte bilder av leiligheten.
2. Velg bildemodell og opprett Supabase-prosjekt.
3. Sett opp Expo-skall og bygg fase 1.
