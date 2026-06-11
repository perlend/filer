import Anthropic from "@anthropic-ai/sdk";

/**
 * Analyse av bilder av elektriske installasjoner med Claude
 * (claude-opus-4-8, som har bildeforståelse). Kalles direkte fra
 * appen med brukerens egen API-nøkkel – kun ment for personlig bruk.
 */

const MODELL = "claude-opus-4-8";

const SYSTEMPROMPT = `Du er en erfaren norsk elektroinstallatør og faglærer som hjelper en elektriker med å tolke bilder av elektriske installasjoner, utstyr og montasjer.

Når du får et bilde:
1. Beskriv hva du ser: utstyrstype, komponenter, montasjemåte.
2. Forklar hvorfor løsningen typisk er valgt, med henvisning til norske regler og normer – først og fremst NEK 400 (henvis til del/punkt, f.eks. «NEK 400-701»), samt FEL og FSE der det er relevant. Norske nettsystemer (230 V IT og 400 V TN) er konteksten.
3. Påpek ting som SER UT TIL å avvike fra god praksis – men vær tydelig på hva du faktisk kan vurdere fra et bilde og hva som krever måling/inspeksjon på stedet.

Viktige regler:
- Gjengi ALDRI normtekst fra NEK 400 ordrett – forklar med egne ord og henvis til punktnummer.
- Vær konservativ: er du usikker, si det. Gjett aldri på sikkerhetskritiske vurderinger.
- Svar på norsk bokmål, strukturert og konsist.
- Avslutt alltid med en kort påminnelse om at en vurdering fra bilde ikke erstatter kontroll på stedet av kvalifisert personell.`;

export interface FotoanalyseInput {
  /** Bildet som base64 (uten data-URL-prefiks) */
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  /** Valgfritt spørsmål fra brukeren */
  sporsmal?: string;
  apiKey: string;
}

export async function analyserFoto(input: FotoanalyseInput): Promise<string> {
  const client = new Anthropic({
    apiKey: input.apiKey,
    // Nøkkelen er brukerens egen og lagres lokalt på enheten – direktekall
    // fra klienten er et bevisst valg for personlig bruk.
    dangerouslyAllowBrowser: true,
  });

  const response = await client.messages.create({
    model: MODELL,
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: SYSTEMPROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.mediaType,
              data: input.base64,
            },
          },
          {
            type: "text",
            text:
              input.sporsmal?.trim() ||
              "Forklar hva dette er, hvorfor det er montert/valgt slik, og hvilke krav i NEK 400 som er relevante.",
          },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Modellen avslo å analysere dette bildet. Prøv et annet bilde eller spørsmål.");
  }

  const tekst = response.content
    .filter((blokk): blokk is Anthropic.TextBlock => blokk.type === "text")
    .map((blokk) => blokk.text)
    .join("\n")
    .trim();

  if (!tekst) {
    throw new Error("Fikk ikke noe svar fra modellen. Prøv igjen.");
  }
  return tekst;
}
