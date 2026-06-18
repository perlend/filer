import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { getGeminiApiKey } from './settings';

export interface FurnitureImage {
  /** Lokal fil-URI (for visning og lagring). */
  uri: string;
  base64: string;
  mimeType: string;
}

export interface GenerationInput {
  /** Lokal fil-URI til originalbildet av rommet. */
  imageUri: string;
  /** Base64-innholdet av originalbildet (fra image picker). */
  imageBase64: string;
  mimeType: string;
  /** Veggfarge, f.eks. "Salviegrønn (#9CAF88)". */
  wallColor: string;
  /** Fritekstbeskrivelse av møbler, kan være tom. */
  furniture: string;
  /** Bilder av møbler som skal settes inn i rommet. */
  furnitureImages: FurnitureImage[];
}

export interface GenerationResult {
  /** Lokal fil-URI til det genererte bildet. */
  resultUri: string;
  provider: 'gemini' | 'mock';
}

const GEMINI_MODEL = 'gemini-3-pro-image-preview';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildPrompt(input: GenerationInput): string {
  const hasImages = input.furnitureImages.length > 0;
  const hasText = input.furniture.trim() !== '';

  let furniturePart: string;
  if (hasImages && hasText) {
    furniturePart =
      `Det første bildet viser rommet. De ${input.furnitureImages.length} neste bildene viser møbler ` +
      `som skal settes inn i rommet på en naturlig måte, med riktig perspektiv, skala og lys. ` +
      `Ta også hensyn til denne beskrivelsen: ${input.furniture.trim()}.`;
  } else if (hasImages) {
    furniturePart =
      `Det første bildet viser rommet. De ${input.furnitureImages.length} neste bildene viser møbler ` +
      `som skal settes inn i rommet på en naturlig måte, med riktig perspektiv, skala og lys. ` +
      `Møblene skal se ut akkurat som på møbelbildene.`;
  } else if (hasText) {
    furniturePart = `Sett inn følgende møbler på en naturlig måte i rommet: ${input.furniture.trim()}.`;
  } else {
    furniturePart = 'Behold møblene som de er.';
  }

  return (
    `Rediger fotografiet av rommet. Mal alle veggene i fargen ${input.wallColor}. ` +
    `${furniturePart} ` +
    `Behold rommets geometri nøyaktig: vinduer, dører, tak, gulv, lister og perspektiv skal være uendret. ` +
    `Behold lysforholdene fra originalbildet. Resultatet skal se ut som et ekte foto av det samme rommet.`
  );
}

async function saveBase64Image(base64: string, mimeType: string): Promise<string> {
  if (Platform.OS === 'web') return `data:${mimeType};base64,${base64}`;
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  const uri = `${FileSystem.documentDirectory}generert-${Date.now()}.${ext}`;
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}

/**
 * Kaller Gemini bilderedigering med foto + instruksjon.
 * Krever at API-nøkkel er lagt inn under Innstillinger.
 */
async function generateWithGemini(input: GenerationInput, apiKey: string): Promise<GenerationResult> {
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: buildPrompt(input) },
          { inline_data: { mime_type: input.mimeType, data: input.imageBase64 } },
          ...input.furnitureImages.map((img) => ({
            inline_data: { mime_type: img.mimeType, data: img.base64 },
          })),
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  const response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Gemini-API svarte ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error?.message) message = parsed.error.message;
    } catch {
      // behold standardmeldingen
    }
    throw new Error(message);
  }

  const json = await response.json();
  const parts: any[] = json?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
  if (!imagePart) {
    throw new Error('Gemini returnerte ikke noe bilde. Prøv igjen eller juster beskrivelsen.');
  }
  const data: string = imagePart.inlineData?.data ?? imagePart.inline_data.data;
  const mime: string = imagePart.inlineData?.mimeType ?? imagePart.inline_data?.mime_type ?? 'image/png';

  const resultUri = await saveBase64Image(data, mime);
  return { resultUri, provider: 'gemini' };
}

/** Uten API-nøkkel: returnerer originalbildet etter en kort pause, så flyten kan testes. */
async function generateMock(input: GenerationInput): Promise<GenerationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { resultUri: input.imageUri, provider: 'mock' };
}

export async function generate(input: GenerationInput): Promise<GenerationResult> {
  const apiKey = await getGeminiApiKey();
  if (apiKey) {
    return generateWithGemini(input, apiKey);
  }
  return generateMock(input);
}
