# Romviz – nettside

Samme app som `../romviz`, men som **én enkelt HTML-fil** uten byggesteg.
Visualiser rom med nye veggfarger og møbler, og lagre favoritter.

## Bruk den

- **Lokalt:** dobbeltklikk `index.html` – den åpnes i nettleseren og fungerer med en gang.
- **På nett:** dra `index.html` inn på [app.netlify.com/drop](https://app.netlify.com/drop),
  eller legg filen i et hvilket som helst webhotell / GitHub Pages. Ingen server trengs.

## Gemini-nøkkel

Genereringen bruker Google Gemini (bilderedigering). Lag en gratis nøkkel på
[aistudio.google.com](https://aistudio.google.com/) og lim den inn under
**Innstillinger** i appen. Nøkkelen lagres kun lokalt i nettleseren din.
Uten nøkkel kjører appen i demomodus: hele flyten fungerer, men «resultatet»
er originalbildet uendret.

## Hva fungerer

- Last opp bilde av rommet
- Velg veggfarge (palett eller egen hex/NCS-kode)
- Beskriv møbler med tekst og/eller last opp inntil 3 møbelbilder
- Generer via Gemini (foto + instruksjon), eller demomodus uten nøkkel
- Før/etter: hold inne på bildet for å se originalen
- Lagre favoritter, bla i galleri, åpne detaljer, slett

## Begrensninger

- Favoritter lagres i nettleserens `localStorage` – de er **per nettleser/enhet**.
  For delte favoritter mellom to personer trengs fase 2 (Supabase), se
  `../docs/romvisualisering-plan.md`.
- `localStorage` har ca. 5 MB grense, så veldig mange favoritter med store bilder
  kan fylle opp lageret. Appen sier fra hvis lagring feiler.
